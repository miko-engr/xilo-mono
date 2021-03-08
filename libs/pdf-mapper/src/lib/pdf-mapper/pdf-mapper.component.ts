import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData } from 'pdfjs-dist';
import { MatMenuTrigger } from '@angular/material/menu';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { FormBuilderService } from '@xilo-mono/form-contracts';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'xilo-mono-pdf-mapper',
  templateUrl: './pdf-mapper.component.html',
  styleUrls: ['./pdf-mapper.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: false },
    },
  ],
})
export class PdfMapperComponent implements OnInit, OnDestroy {
  @Input() pdf: any;
  @Input() formFields: any;
  @Input() forms: any;
  @Input() pdfSrc: any;
  @Input() contextMenu: MatMenuTrigger = null;
  @Input() formFieldsRetrieved;
  @Input() zoom = 1;

  @Output() 'after-load-complete' = new EventEmitter<any>();
  @Output() updateFormField = new EventEmitter<any>();

  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  copiedObject: any;
  showContextMenu = false;
  hasCopiedObject = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  pdfLoaded = false;
  @ViewChild('pdfViewer', { static: false }) pdfViewer: ElementRef;
  @ViewChild('reactiveForm') reactiveForm;

  updatedFormFields = {};
  keysRetrieved = false;
  selectedIndex = null;
  searchNameValue = '';
  searchWhereKeyValue = '';
  fieldIndexNumber = null;

  p = 1;

  readonly dpiRatio = 96 / 72;
  pdfViewerScrollBinding: any;
  pdfScrollOffsets: any = {
    left: 0,
    top: 0,
  };
  pdfOverlayStyle: any = {
    'width.px': 0,
    'height.px': 0,
  };
  public pdfZoom = 1;
  hasExpectedValue = {};
  mappingMethod = 'Form';
  selectedFormIndex: any;
  selectedAnswerIndex: any;
  selectedFormTitle: string;
  answers = [];
  params = this.route.snapshot.params;
  highlighted = false;
  data = null
  isCheckboxOrInput = 'checkbox'
  formFieldSubscription: Subscription;
  formTreeDraggingSubscription: Subscription;
  formTreeIsDragging = false;
  readonly FORM_TYPES = ['intake-form', 'customer-form']

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private renderer: Renderer2,
    private formBuilderService: FormBuilderService
  ) {}

  ngOnInit(): void {
    // this.contextMenu = this.triggers.last;
    // this.formViewService.data.subscribe(data => { 
    //   this.data = Object.keys(data).length ? data : null
    // });
    this.formFieldSubscription = this.formBuilderService.formFieldData
    .subscribe(data => {
      this.data = Object.keys(data).length ? data : null;
    });
    this.formTreeDraggingSubscription = this.formBuilderService.formTreeDragging
    .subscribe(isDragging => {
      this.formTreeIsDragging = isDragging;
    });
    console.log(this.formFields);
  }

  ngOnDestroy(): void {
    // this.formViewService.dataSource.unsubscribe()
    this.formFieldSubscription.unsubscribe();
    this.formTreeDraggingSubscription.unsubscribe();
  }

  onContextMenu(event: MouseEvent, obj) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu) {
      this.contextMenu.menuData = { obj: obj };
      this.contextMenu.menu.focusFirstItem('mouse');
    }
    if (localStorage.getItem('copiedObject')) {
      this.copiedObject = JSON.parse(localStorage.getItem('copiedObject'));
      this.hasCopiedObject = true;
    }
    this.contextMenu.openMenu();
  }

  removeCopiedObject() {
    this.hasCopiedObject = false;
    this.showContextMenu = false;
    this.copiedObject = null;
    localStorage.removeItem('copiedObject');
  }

  async copyObject(eventObj: any) {
    const iField = this.formFields[eventObj.index];
    this.copiedObject = {
      name: iField.name,
      type: iField.type,
      expectedValue: iField.expectedValue,
      whereKey: iField.whereKey,
      whereValue: iField.whereValue,
    };
    this.hasCopiedObject = true;
    this.showContextMenu = false;
    localStorage.setItem('copiedObject', JSON.stringify(this.copiedObject));
  }

  async pasteObject(eventObj: any) {
    if (this.copiedObject) {
      this.formFields[eventObj['index']].name = this.copiedObject.name;
      this.formFields[eventObj['index']].type = this.copiedObject.type;
      this.formFields[
        eventObj['index']
      ].expectedValue = this.copiedObject.expectedValue;
      this.formFields[eventObj['index']].whereKey = this.copiedObject.whereKey;
      this.formFields[
        eventObj['index']
      ].whereValue = this.copiedObject.whereValue;
      this.hasCopiedObject = false;
      this.showContextMenu = false;
      this.copiedObject = null;
      localStorage.removeItem('copiedObject');
    }
  }

  setIndex(indexNumber: string) {
    if (
      indexNumber === 'null' ||
      !indexNumber ||
      this.formFields[this.selectedIndex].name.includes('_')
    ) {
      if (indexNumber === 'null' || !indexNumber) {
        this.fieldIndexNumber = null;
      } else {
        const array = this.formFields[this.selectedIndex].name.split('_');
        this.formFields[this.selectedIndex].name = array[0];
      }
    } else {
      this.formFields[this.selectedIndex].name = `${
        this.formFields[this.selectedIndex].name
      }_${indexNumber}`;
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
    this.formFields[this.selectedIndex]['isCheckbox'] = this.formFields[
      this.selectedIndex
    ]['isCheckbox']
      ? this.formFields[this.selectedIndex]['isCheckbox']
      : false;
    this.formFields[this.selectedIndex]['isWhereFunction'] = this.formFields[
      this.selectedIndex
    ]['isWhereFunction']
      ? this.formFields[this.selectedIndex]['isWhereFunction']
      : false;
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

  updatePdf() {
    this.updatedFormFields = {
      pdfId: this.params.id,
      fields: this.formFields,
    };
    // this.pdfService.updateFormField(this.updatedFormFields)
    //     .subscribe(pdfData => {
    //         this.logService.success('Form fields updated successfully');
    //     }, error => {
    //         this.logService.console(error, true);
    //     });
  }

  getAnswers(formId: any) {
    const form = this.forms.filter((f) => +f.id === +formId)[0];
    this.selectedFormTitle = form.title;
    // this.answerService.getAnswersByFormId(formId)
    // .subscribe(data => {
    //   this.answers = data['obj'];
    // }, error => {
    //   this.logService.console(error, true);
    // });
  }

  setValue(i, value: any) {
    const newValue = value.target ? value.target.value : value;
    if (this.formFields[i]) {
      this.formFields[i]['expectedValue'] = newValue;
    }
  }

  returnExists(value) {
    if (
      (typeof value !== 'undefined' && value && value !== '') ||
      value === false
    ) {
      return true;
    } else {
      return false;
    }
  }

  returnIndex(i: any) {
    const indexAdd = +this.p * 10 - 10;
    return +i + indexAdd;
  }

  addtypeinFormField(index, value) {
    this.formFields[index].type = value;
  }

  addExpectedValue(index, expectedValue) {
    this.formFields[index].expectedValue = expectedValue;
  }

  public getInputPosition(input: any, index): any {
    if (!this.pdfViewer || !this.pdfLoaded) {
      return {};
    }

    let pageElement = this.pdfViewer['element'].nativeElement;

    /*
    const pageElement = this.pdfViewer['element'].nativeElement.firstChild
      .firstChild.firstChild;
    if (!pageElement) {
      return {};
    }
    */

   const child = pageElement.firstChild.firstChild || pageElement;

   if (index % 100 === 0) {
     console.log(this.pdfViewer['element'].nativeElement);
     console.log(pageElement);
     console.log(pageElement.firstChild.firstChild);
   }
    
    if (!child) {
      console.log('pageElement not found: ');
      return {};
    }

    const marginLeft = pageElement.offsetLeft;
    const leftOffset = input.left - this.pdfScrollOffsets.left + marginLeft;
    const topOffset = input.top - this.pdfScrollOffsets.top;
    const styling = {
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
      height: `${input.height}px`,
      width: `${input.width}px`,
    };

    // if (input.type) {
    //   styling['border'] = '1px solid #23D6C8';
    // } else {
    //   styling['border'] = '1px solid red';
    // }

    return styling;
  }

  private createInput(
    annotation: any,
    rect: number[] = null,
    page: number,
    pageHeight: number
  ) {
    const name = annotation.fieldName;
    const input = this.formFields.filter((item) => item.name === name)[0];
    if (!input) {
      return;
    }

    if (rect) {
      input.top = rect[1] - (rect[1] - rect[3]);
      input.top += (page - 1) * (pageHeight + 10);
      input.left = rect[0];
      input.height = rect[1] - rect[3];
      input.width = rect[2] - rect[0];
    }
  }

  loadComplete(pdf: PDFDocumentProxy): void {
    // get annotations and add inputs
    for (let i = 1; i <= pdf.numPages; i++) {
      let currentPage = null;
      pdf
        .getPage(i)
        .then((p) => {
          currentPage = p;
          return p.getAnnotations();
        })
        .then((ann) => {
          const annotations = (<any>ann) as PDFAnnotationData[];

          annotations
            .filter((a) => a.subtype === 'Widget')
            .forEach((a) => {
              const fieldRect = currentPage
                .getViewport({ scale: this.dpiRatio })
                .convertToViewportRectangle(a.rect);
              const pageHeight = currentPage.getViewport({
                scale: this.dpiRatio,
              }).height;
              this.createInput(a, fieldRect, i, pageHeight);
            });
        });
      if (i === pdf.numPages) {
        this.pdfLoaded = true;
      }
    }

    // set proper overlay position and dimensions
    this.updateOverlayDimensions();

    // bind scroll event to pdf viewer container, to update input positions
    this.pdfViewerScrollBinding = this.renderer.listen(
      this.pdfViewer['element'].nativeElement.querySelector(
        '.ng2-pdf-viewer-container'
      ),
      'scroll',
      (e) => {
        this.updatePDFScrollOffsets(e);
      }
    );
  }

  updatePDFScrollOffsets(event) {
    this.pdfScrollOffsets = {
      left: event.target.scrollLeft,
      top: event.target.scrollTop,
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
    this.pdfOverlayStyle['width.px'] =
      this.pdfViewer['element'].nativeElement.offsetWidth - 17;
    this.pdfOverlayStyle['height.px'] =
      this.pdfViewer['element'].nativeElement.offsetHeight - 17;
  }

  public zoomIn(): void {
    this.formFields = this.formFields.map((i) => {
      i.left *= 0.25 / this.pdfZoom + 1;
      i.top *= 0.25 / this.pdfZoom + 1;
      i.width *= 0.25 / this.pdfZoom + 1;
      i.height *= 0.25 / this.pdfZoom + 1;
      return i;
    });
    this.pdfZoom += 0.25;
  }

  public zoomOut(): void {
    this.formFields = this.formFields.map((i) => {
      i.left *= 1 - 0.25 / this.pdfZoom;
      i.top *= 1 - 0.25 / this.pdfZoom;
      i.width *= 1 - 0.25 / this.pdfZoom;
      i.height *= 1 - 0.25 / this.pdfZoom;
      return i;
    });
    this.pdfZoom -= 0.25;
  }

  returnToForms() {
    this.router.navigate(['/profile/forms/pdfs']);
  }

  onDragOver($event) {
    this.highlighted = true;
  }

  onDragLeave($event) {
    this.highlighted = false;
  }

  updateField(index) {
    this.updateFormField.emit({ field: this.formFields[index], index })
  }

  onMouseOver(index, name) {
    if (this.data && this.formTreeIsDragging) {
      this.data.name = this.data.templateOptions.placeholder;
      this.formFields[index] = { ...this.formFields[index], ...this.data };
      this.updateFormField.emit({ field: this.formFields[index], index })
      this.data = null
    }
  }

  onMouseUp(index, name) {
    if (this.data && this.formTreeIsDragging) {
      if (this.data) {
        this.formFields[index] = { ...this.formFields[index], ...this.data };
        this.updateFormField.emit({ field: this.formFields[index], index })
        this.data = null
      }
    }
  }

  deleteField(index) {
    const copy = JSON.parse(JSON.stringify(this.formFields[index]));
    this.formFields[index] = {
      name: copy.name,
      width: copy.width,
      top: copy.top,
      left: copy.left,
      height: copy.height
    };
    this.updateFormField.emit({ field: this.formFields[index], index });
  }

  onDrop($event, index) {
    this.formFields[index]['dragAndDropQuestion'] = $event.element.data.value;
    this.highlighted = false;
  }

  allowDrop(element, index) {
    return true;
  }

  applyField(type) {
    console.log(type);
  }

  disableClose(event) {
    event.stopPropagation();
  }
  
  isRepeatSection(input) {
    const  components = this.formBuilderService.form.components[0]
    const  type       = this.getSectionTypeById(components, input.parentValue) 
    return type?.endsWith('-repeat')
  }

  getSectionTypeById(formComponents, sectionId) {
    if (!this.FORM_TYPES.includes(formComponents?.type)) throw new Error(`Unexpected form type: "${formComponents?.type}"`)
    const sections = formComponents.fieldGroup
    const section  = sections.find(x => x.key === sectionId)
    return section && section.type
  }

}
