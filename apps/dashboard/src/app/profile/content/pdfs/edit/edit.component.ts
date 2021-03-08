import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { LogService } from '../../../../services/log.service';
import { PdfService } from '../../../../services/pdf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CompanyService } from '../../../../services/company.service';
import { Driver } from '../../../../models/driver.model';
import { Vehicle } from '../../../../models/vehicle.model';
import { Home } from '../../../../models/home.model';
import { Client } from '../../../../models/client.model';
import { Business } from '../../../../models/business.model';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {PDFDocumentProxy} from 'ng2-pdf-viewer';
import { PDFAnnotationData } from 'pdfjs-dist';

export interface Key {
    key: string;
    label: string;
}

export interface KeyGroup {
    type: string;
    keys: Key[];
}

export const _filter = (opt: Key[], value: string): Key[] => {
    const filterValue = value.toLowerCase();

    return opt
            .filter(key => key.label.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
    selector: 'app-pdf-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['../../../business/business.component.css', '../pdf.component.css']
})
export class EditPdfComponent implements OnInit, OnDestroy {
  @ViewChild('pdfViewer')
  private pdfViewer: ElementRef;

  params = this.route.snapshot.params;
  rKeys;
  keyGroups: KeyGroup[] = [
      { type: 'client', keys: [] },
      { type: 'drivers', keys: [] },
      { type: 'vehicles', keys: [] },
      { type: 'homes', keys: [] },
      { type: 'business', keys: [] },
      { type: 'company', keys: [] },
      { type: 'locations', keys: [] },
  ];
  formFields = [];
  answers = [];
  updatedFormFields = {};
  formFieldsRetrieved = false;
  keysRetrieved = false;
  pdfSrc;
  keyword = 'Value';
  notFound = 'Not Found';
  myControl = new FormControl();
  keyGroupOptions: Observable<KeyGroup[]>[] = [];
  showExpectedValue = false;

  p = 1;

  keyForm: FormGroup = this._formBuilder.group({});

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
  selectedIndex = null;

  constructor(
      private logService: LogService,
      private pdfService: PdfService,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private companyService: CompanyService,
      private _formBuilder: FormBuilder,
      private renderer: Renderer2
  ) { }

  ngOnInit() {
      this.getKeys();
      // tslint:disable-next-line: no-non-null-assertion
  }

  ngOnDestroy() {
    if (this.pdfViewerScrollBinding) { this.pdfViewerScrollBinding(); }
  }

  private _filterGroup(value: any): KeyGroup[] {
      if (value && typeof value === 'string') {
        return this.keyGroups
          .map(group => ({type: group.type, keys: _filter(group.keys, value)}))
          .filter(group => group.keys.length > 0);
      } else if (typeof value === 'object') {
          const field = this.formFields[value.formField];
          if (field) {
              field.type = value.type;
              field.value = value.key;
          }
      }
      return this.keyGroups;
  }

  displayFn(obj?: any): string | undefined {
      return obj ? obj.label : undefined;
  }

  dropItFormFields(event: CdkDragDrop<string[]>) {
      if (event.previousIndex !== event.currentIndex) {
          moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
          this.formFields.forEach((formField, i) => {
              formField.position = i;
          });
      }
  }

  getFormFields() {
      this.pdfService.getFormField(this.params)
          .subscribe(formField => {
              this.formFields = formField['obj'];
              this.pdfSrc = formField['fileUrl'];
              this.keyForm.addControl('showExpectedValue', new FormControl(this.showExpectedValue));
              this.formFields.forEach((field, index) => {
                  this.answers[index] = field.type;
                  const label = (field.type && field.value) ? this.rKeys[field.type][field.value] : '';
                  const type = field.type ? field.type : '';
                  const key = field.value ? field.value : '';
                  const expectedValue = field.expectedValue ? field.expectedValue : '';
                  const obj = { type: type, label: label, key: key, formField: index, expectedValue: expectedValue };
                  const control = new FormControl(obj);
                  this.keyForm.addControl(index.toString(), control);
                  this.keyForm.addControl(`${ index.toString() }-p`, new FormControl(expectedValue));
                  // tslint:disable-next-line: no-non-null-assertion
                  const keyGroupOption = this.keyForm.get(index.toString())!.valueChanges
                  .pipe(
                      startWith(''),
                      map(value => this._filterGroup(value))
                  );
                  this.keyGroupOptions.push(keyGroupOption);
              });
              this.formFieldsRetrieved = true;
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

  downloadDefault() {
      const fileName = `test-123.pdf`;
      this.pdfService.filledFormDefault(this.params.id)
          .subscribe(async (pdf: Blob) => {
              const url = window.URL.createObjectURL(new Blob([pdf]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
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

    return {
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
      height: `${input.height}px`,
      width: `${input.width}px`,
    };
  }

  private createInput(annotation: any, rect: number[] = null) {
    const formControl = new FormControl(annotation.buttonValue || '');

    const name = annotation.fieldName;
    const input = this.formFields.filter(item => item.name === name)[0];
    if (!input) { return; }

    if (rect) {
      input.top = rect[1] - (rect[1] - rect[3]);
      input.left = rect[0];
      input.height = (rect[1] - rect[3]);
      input.width = (rect[2] - rect[0]);
    }

    return formControl;
  }

  private addInput(annotation: any, rect: number[] = null): void {
    this.keyForm.addControl(annotation.fieldName, this.createInput(annotation, rect));
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
            const fieldRect = currentPage.getViewport(this.dpiRatio).convertToViewportRectangle(a.rect);
            this.addInput(a, fieldRect);
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
}
