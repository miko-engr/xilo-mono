import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfService } from '../../../../../services/pdf.service';
import { FormBuilderService } from '@xilo-mono/form-contracts';
import { ToastService } from '../../../../../services/toast.service';
import { Pdf } from '../../../../../models/pdf.model';
import { Params, ActivatedRoute } from '@angular/router';

type PdfUploadModes = 'create' | 'replace'

@Component({
  selector: 'xilo-pdf-mapper-layout',
  templateUrl: './pdf-layout.component.html',
  styleUrls: ['./pdf-layout.component.scss'],
})
export class PdfMapperLayout implements OnInit {
  @ViewChild('pdfChildComponent') pdfChildComponent;
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  activePdfIndex = 0;
  // TODO: activePdf should be of type Pdf, but it has incorrect "id" type = string
  activePdf = {};
  pdfs = []
  formFields = []
  pdfId = null;
  uploadPDF: Pdf & { mode:PdfUploadModes, originalPdfId?:number }
  pdfUploadMode: PdfUploadModes
  loading = false;
  constructor(
    private formBuilderService: FormBuilderService,
    private pdfService: PdfService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getPDFs();
  }

  getPDFs() {
    this.pdfService.getByFormKey(this.queryParams.id)
    .subscribe(pdfs => {
      this.pdfs = pdfs;
      this.activePdf = this.pdfs[0];
    }, error => {
      console.log(error);
    })
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    if (inputNode.files[0].name) {
        const fileName = inputNode.files[0].name.split('.')[1];
        if (fileName !== 'pdf') {
            this.toastService.showError('This file is not a PDF');
            return;
        }
        this.uploadPDF.fileName = inputNode.files[0];
    }
  }

  openPDFMenu(mode:PdfUploadModes) {
    this.pdfUploadMode = mode
    const formName = mode === 'replace' ? this.activePdf['formName'] : null
    
    this.uploadPDF = { ...new Pdf(
      null,
      null,
      false,
      formName,
      null,
      'Yes',
      this.queryParams.id
    ), mode,
      originalPdfId : this?.activePdf?.['id'] 
    }
  }

  closePDFMenu() {
    this.uploadPDF = null;
  }

  uploadPdf() {
    if (!this.uploadPDF.fileName) {
        this.toastService.showWarn('Please select file');
    } else {
        this.loading = true;
        this.pdfService.post(this.uploadPDF, false)
            .subscribe(newPdf => {
                if (this.uploadPDF.mode === 'create') this.pdfs.push(newPdf['obj'])
                this.loading = false;
                const uploadModeWord = this.uploadPDF.mode === 'create' ? 'uploaded' : 'replaced' 
                this.toastService.showSuccess(`PDF ${uploadModeWord} successfully`)

                if (this.uploadPDF.mode === 'create') {
                  const last = this.pdfs.length - 1
                  this.activePdfIndex = last
                  this.changeActivePDF(this.pdfs[last], last) 
                } else {
                  this.changeActivePDF(this.pdfs[this.activePdfIndex], this.activePdfIndex)
                }
                
                this.closePDFMenu()
            }, error => {
                this.loading = false;
                // TODO: we should standardize error handling
                const isDuplicateFieldsError = error?.error?.error?.message.startsWith('PDF contains duplicated field names')
                const isMissingFieldsError   = error?.error?.error?.message.startsWith('This PDF missing field names that were previously mapped')

              if (isDuplicateFieldsError || isMissingFieldsError) {
                // TODO: we should standardize error handling
                const [message, link] = error.error.error.message.split(' :: ')
                const params = { duration:10000, link, linkName:'View' }

                this.toastService.showError(message, params)
              } else
                  this.toastService.showError('Couldn\'t upload PDF');
            });
    }
  }

  deletePDF(pdf: any, i: any) {
    if (confirm('Are you sure you want to delete this PDF?')) {
      this.pdfService.delete(pdf)
      .subscribe(data => {
        this.pdfs.splice(i, 1);
      }, error => console.log(error));
    }
  }

  changeActivePDF(pdf: any, index: any) {
    this.activePdf = pdf;
    this.activePdfIndex = index;
    this.uploadPDF = null
    setTimeout(() => {
      this.formBuilderService.changePDF(true);
    }, 500);
  }
  
  getPdfUploadButtonText() {
    return this.pdfUploadMode === 'create' ? 'Create PDF' : 'Replace PDF'
  }
  
  getPdfUploadTitleText() {
    return this.pdfUploadMode === 'create' ? 'Add new PDF' : 'Replace current PDF'
  }

}
