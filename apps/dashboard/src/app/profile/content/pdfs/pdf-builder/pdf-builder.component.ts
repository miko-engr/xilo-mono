import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { LogService } from '../../../../services/log.service';
import { PdfService } from '../../../../services/pdf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import {PDFDocumentProxy} from 'ng2-pdf-viewer';
import { PDFAnnotationData } from 'pdfjs-dist';
import { Pdf } from '../../../../models/pdf.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { AnswerService } from '../../../../services/answer.service';
import { Answer } from '../../../../models/answer.model';
import { Form } from '../../../../models/form.model';
import { FormService } from '../../../../services/form.service';


export interface Key {
  key: string;
  label: string;
}

export interface KeyGroup {
  type: string;
  keys: Key[];
}


@Component({
  selector: 'app-pdf-builder',
  templateUrl: './pdf-builder.component.html',
  styleUrls: ['./pdf-builder.component.scss']
})
export class PdfBuilderComponent implements OnInit, OnDestroy {
  @ViewChild('pdfViewer')
  private pdfViewer: ElementRef;
  @ViewChild('reactiveForm') reactiveForm;

  params = this.route.snapshot.params;
  rKeys;
  pdf: Pdf;
  keyGroups: KeyGroup[] = [
      { type: 'client', keys: [] },
      { type: 'drivers', keys: [] },
      { type: 'vehicles', keys: [] },
      { type: 'homes', keys: [] },
      { type: 'business', keys: [] },
      { type: 'company', keys: [] },
      { type: 'locations', keys: [] },
      { type: 'policies', keys: [] },
      { type: 'recreationalVehicles', keys: [] },
  ];
  formFields = [];
  answers: Answer[] = [];
  forms: Form[] = [];
  updatedFormFields = {};
  formFieldsRetrieved = false;
  keysRetrieved = false;
  pdfSrc;
  keyGroupOptions: KeyGroup[] = [];
  selectedIndex = null;
  searchNameValue = '';
  searchWhereKeyValue = '';
  fieldIndexNumber = null;

  p = 1;

  readonly dpiRatio = 96 / 72;
  pdfViewerScrollBinding: any;
  pdfScrollOffsets: any = {
    left: 0,
    top: 0
  };
  pdfOverlayStyle: any = {
    'width.px': 0,
    'height.px': 0
  };
  public pdfZoom = 1;
  hasExpectedValue = {};
  mappingMethod = 'Form';
  selectedFormIndex: any;
  selectedAnswerIndex: any;
  selectedFormTitle: string;

  copiedObject: any;
  showContextMenu = false;
  hasCopiedObject = false;
  contextMenu: MatMenuTrigger = null;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;


  constructor(
      private answerService: AnswerService,
      private formService: FormService,
      private logService: LogService,
      private pdfService: PdfService,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private companyService: CompanyService,
      private router: Router,
      private renderer: Renderer2
  ) { }

  ngOnInit() {
      this.getKeys();
      // tslint:disable-next-line: no-non-null-assertion
  }

  ngOnDestroy() {
    if (this.pdfViewerScrollBinding) { this.pdfViewerScrollBinding(); }
  }

  removeCopiedObject() {
    this.hasCopiedObject = false;
    this.showContextMenu = false;
    this.copiedObject = null;
    localStorage.removeItem('copiedObject');
    this.logService.success('Cleared');
  }

  async copyObject(eventObj: any) {
    const iField = this.formFields[eventObj.index];
    this.copiedObject = {name: iField.name, type: iField.type, expectedValue: iField.expectedValue,
                          whereKey: iField.whereKey, whereValue: iField.whereValue};
    this.hasCopiedObject = true;
    this.showContextMenu = false;
    localStorage.setItem('copiedObject', JSON.stringify(this.copiedObject));
    this.logService.success('Copied');
  }

  async pasteObject(eventObj: any) {
    if (this.copiedObject) {
      this.formFields[eventObj['index']].name = this.copiedObject.name;
      this.formFields[eventObj['index']].type = this.copiedObject.type;
      this.formFields[eventObj['index']].expectedValue = this.copiedObject.expectedValue;
      this.formFields[eventObj['index']].whereKey = this.copiedObject.whereKey;
      this.formFields[eventObj['index']].whereValue = this.copiedObject.whereValue;
      this.hasCopiedObject = false;
      this.showContextMenu = false;
      this.copiedObject = null;
      localStorage.removeItem('copiedObject');
      this.logService.success('Pasted');
    }
  }

  onContextMenu(event: MouseEvent, obj) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'obj': obj };
    this.contextMenu.menu.focusFirstItem('mouse');
    if (localStorage.getItem('copiedObject')) {
      this.copiedObject = JSON.parse(localStorage.getItem('copiedObject'));
      this.hasCopiedObject = true;
    }
    this.contextMenu.openMenu();
  }

  fieldIsMultiple(type: string) {
    return ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'policies', 'recreationalVehicles'].includes(type);
  }

  setIndex(indexNumber: string) {
    if ((indexNumber === 'null' || !indexNumber) || this.formFields[this.selectedIndex].name.includes('_')) {
      if (indexNumber === 'null' || !indexNumber) {
        this.fieldIndexNumber = null;
      } else {
        const array = this.formFields[this.selectedIndex].name.split('_');
        this.formFields[this.selectedIndex].name = array[0];
      }
    } else {
      this.formFields[this.selectedIndex].name = `${this.formFields[this.selectedIndex].name}_${indexNumber}`;
    }
  }

  setInput(input: any, index: any) {
    this.selectedIndex = index;
    this.selectedFormIndex = null;
    this.selectedAnswerIndex = null;
    this.searchNameValue = this.formFields[this.selectedIndex].name;
    this.searchWhereKeyValue = this.formFields[this.selectedIndex].whereKey;
    if (this.searchNameValue.includes('_')) {
      this.fieldIndexNumber = this.searchNameValue.split('_')[1];
    }
    this.formFields[this.selectedIndex]['isCheckbox'] = this.formFields[this.selectedIndex]['isCheckbox'] ?
      this.formFields[this.selectedIndex]['isCheckbox'] : false;
    this.formFields[this.selectedIndex]['isWhereFunction'] = this.formFields[this.selectedIndex]['isWhereFunction'] ?
      this.formFields[this.selectedIndex]['isWhereFunction'] : false;
  }

  setFieldByAnswer(index: any) {
    const answer = this.answers[index];
    this.formFields[this.selectedIndex].name = answer.propertyKey;
    if (this.formFields[this.selectedIndex].name.includes('_')) {
      const numbersArray = this.formFields[this.selectedIndex].name.split('_');
      this.fieldIndexNumber = numbersArray[1];
    }
    this.formFields[this.selectedIndex].type = answer.objectName;
  }

  setFieldName(event: any) {
    this.searchNameValue = '';
    this.formFields[this.selectedIndex].name = event.option.value.key;
    if (this.formFields[this.selectedIndex].name.includes('_')) {
      const numbersArray = this.formFields[this.selectedIndex].name.split('_');
      this.fieldIndexNumber = numbersArray[1];
    }
    this.formFields[this.selectedIndex].type = event.option.value.type;
  }

  setFieldWhereKey(event: any) {
    this.searchWhereKeyValue = '';
    this.formFields[this.selectedIndex]['whereKey'] = event.option.value.key;
  }

  displayFn(obj?: any): string | undefined {
      return obj ? obj.label : undefined;
  }

  getFormFields() {
      this.pdfService.getFormField(this.params)
          .subscribe(formField => {
              this.pdf = formField['pdf'];
              this.formFields = formField['obj'];
              this.pdfSrc = formField['fileUrl'];
              this.formFieldsRetrieved = true;
              this.contextMenu = this.triggers.last;
              this.getForms();
          }, error => {
              this.logService.console(error, true);
          });
  }

  updatePdf() {
      this.updatedFormFields = {
          pdfId: this.params.id,
          fields: this.formFields
      };
      this.pdfService.updateFormField(this.updatedFormFields)
          .subscribe(pdfData => {
              this.logService.success('Form fields updated successfully');
          }, error => {
              this.logService.console(error, true);
          });
  }

  getForms() {
    this.formService.getByCompany(true)
    .subscribe(forms => {
        this.forms = forms['obj'];
    }, error => {
        this.logService.console(error, true);
    });
  }

  getAnswers(formId: any) {
    const form = this.forms.filter(f => +f.id === +formId)[0];
    this.selectedFormTitle = form.title;
    this.answerService.getAnswersByFormId(formId)
    .subscribe(data => {
      this.answers = data['obj'];
    }, error => {
      this.logService.console(error, true);
    });
  }

  async getKeys() {
      try {
          this.rKeys = await this.companyService.getKeysAsync('all', 'all');
          this.keyGroups[0].keys = Object.keys(this.rKeys['client']).map(key => ({ key: key, label: this.rKeys['client'][key] }));
          this.keyGroups[1].keys = Object.keys(this.rKeys['drivers']).map(key => ({ key: key, label: this.rKeys['drivers'][key] }));
          this.keyGroups[2].keys = Object.keys(this.rKeys['vehicles']).map(key => ({ key: key, label: this.rKeys['vehicles'][key] }));
          this.keyGroups[3].keys = Object.keys(this.rKeys['homes']).map(key => ({ key: key, label: this.rKeys['homes'][key] }));
          this.keyGroups[4].keys = Object.keys(this.rKeys['business']).map(key => ({ key: key, label: this.rKeys['business'][key] }));
          this.keyGroups[5].keys = Object.keys(this.rKeys['company']).map(key => ({ key: key, label: this.rKeys['company'][key] }));
          this.keyGroups[6].keys = Object.keys(this.rKeys['locations']).map(key => ({ key: key, label: this.rKeys['locations'][key] }));
          this.keyGroups[7].keys = Object.keys(this.rKeys['policies']).map(key => ({ key: key, label: this.rKeys['policies'][key] }));
          this.keyGroups[8].keys = Object.keys(this.rKeys['recreationalVehicles']).map(key => ({ key: key, label: this.rKeys['recreationalVehicles'][key] }));
          this.keysRetrieved = true;
          this.getFormFields();
      } catch (error) {
          this.logService.console(error, false);
      }
  }

  setValue(i, value: any) {
      const newValue = value.target ? value.target.value : value;
      if (this.formFields[i]) {
          this.formFields[i]['expectedValue'] = newValue;
      }
  }

  returnExists(value) {
      if ((typeof value !== 'undefined' && value && value !== '') || value === false) {
          return true;
      } else {
          return false;
      }
  }

  returnIndex(i: any) {
      const indexAdd = (+this.p * 10) - 10;
      return (+i + indexAdd);
  }

  addtypeinFormField(index, value) {
      this.formFields[index].type = value;
  }

  addExpectedValue(index, expectedValue) {
      this.formFields[index].expectedValue = expectedValue;
  }

  public getInputPosition(input: any): any {
    if (!this.pdfViewer) { return {}; }

    const pageElement = this.pdfViewer['element'].nativeElement.firstChild.firstChild.firstChild;
    if (!pageElement) { return {}; }

    const marginLeft = pageElement.offsetLeft;
    const leftOffset = input.left - this.pdfScrollOffsets.left + marginLeft;
    const topOffset = input.top - this.pdfScrollOffsets.top;
    const styling = {
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
      height: `${input.height}px`,
      width: `${input.width}px`,
    };

    if (input.type) {
      styling['border'] = '1px solid #23D6C8';
    } else {
      styling['border'] = '1px solid red';
    }

    return styling;
  }

  private createInput(annotation: any, rect: number[] = null, page: number, pageHeight: number) {

    const name = annotation.fieldName;
    const input = this.formFields.filter(item => item.name === name)[0];
    if (!input) { return; }

    if (rect) {
      input.top = rect[1] - (rect[1] - rect[3]);
      input.top += (page - 1) * (pageHeight + 10);
      input.left = rect[0];
      input.height = (rect[1] - rect[3]);
      input.width = (rect[2] - rect[0]);
    }
  }

  loadComplete(pdf: PDFDocumentProxy): void {
    // get annotations and add inputs
    for (let i = 1; i <= pdf.numPages; i++) {
      let currentPage = null;
      pdf.getPage(i).then(p => {
        currentPage = p;
        return p.getAnnotations();
      }).then(ann => {
        const annotations = (<any>ann) as PDFAnnotationData[];

        annotations
          .filter(a => a.subtype === 'Widget')
          .forEach(a => {
            const fieldRect = currentPage.getViewport({scale: this.dpiRatio}).convertToViewportRectangle(a.rect);
            const pageHeight = currentPage.getViewport({scale: this.dpiRatio}).height;
            this.createInput(a, fieldRect, i, pageHeight);
          });
      });
    }

    // set proper overlay position and dimensions
    this.updateOverlayDimensions();

    // bind scroll event to pdf viewer container, to update input positions
    this.pdfViewerScrollBinding = this.renderer.listen(this.pdfViewer['element'].nativeElement.querySelector('.ng2-pdf-viewer-container'), 'scroll', (e) => {
      this.updatePDFScrollOffsets(e);
    });
  }

  updatePDFScrollOffsets(event) {
    this.pdfScrollOffsets = {
      left: event.target.scrollLeft,
      top: event.target.scrollTop
    };
  }

  truncatedText(input: any) {
    if (input && input.name.length) {
      const nameLength = 8.5 * input.name.length;
      if (input.width < nameLength) {
        const length = input.width / 8.5;
        return input.name.substring(input.name.length - length);
      } else {
        return input.name;
      }
    } else {
        return input.name;
    }
 }

  truncatedTextVar(input: string, max: number) {
    if (input && input.length) {
      if (input.length > max) {
        return input.substring(input.length - max);
      } else {
        return input;
      }
    } else {
        return input;
    }
 }

  updateOverlayDimensions() {
    this.pdfOverlayStyle['width.px'] = this.pdfViewer['element'].nativeElement.offsetWidth - 17;
    this.pdfOverlayStyle['height.px'] = this.pdfViewer['element'].nativeElement.offsetHeight - 17;
  }

  public zoomIn(): void {
    this.formFields = this.formFields.map(i => {
      i.left *= (.25 / this.pdfZoom) + 1;
      i.top *= (.25 / this.pdfZoom) + 1;
      i.width *= (.25 / this.pdfZoom) + 1;
      i.height *= (.25 / this.pdfZoom) + 1;
      return i;
    });
    this.pdfZoom += .25;
  }

  public zoomOut(): void {
    this.formFields = this.formFields.map(i => {
      i.left *= 1 - (.25 / this.pdfZoom);
      i.top *= 1 - (.25 / this.pdfZoom);
      i.width *= 1 - (.25 / this.pdfZoom);
      i.height *= 1 - (.25 / this.pdfZoom);
      return i;
    });
    this.pdfZoom -= .25;
  }

  returnToForms() {
    this.router.navigate(['/profile/forms/pdfs']);
  }
}
