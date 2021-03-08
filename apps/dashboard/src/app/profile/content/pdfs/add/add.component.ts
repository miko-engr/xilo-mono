import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../../services/log.service';
import { Pdf } from '../../../../models/pdf.model';
import { PdfService } from '../../../../services/pdf.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['../pdf.component.css']
})
export class AddPdfComponent implements OnInit {
    pdf = new Pdf(null);
    pdfs: Pdf[];
    selectedPdf: Pdf = new Pdf(null, null, false, null);
    pdfsRetrieved = false;
    version = false;
    loading = false;

    constructor(
        private logService: LogService,
        private pdfService: PdfService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getPdfs();
    }

    getPdfs() {
        this.pdfService.getByList()
            .subscribe(pdf => {
                this.pdfs = pdf['obj'];
                this.reorderPdfs();
            }, error => {
                this.logService.console(error, true);
            });
    }

    reorderPdfs() {
        this.pdfs.sort((a, b) => (a.formName > b.formName) ? 1 : ((b.formName > a.formName) ? -1 : 0));
        this.pdfsRetrieved = true;
    }

    createPdf() {
        if (!this.selectedPdf.fileName) {
            this.logService.warn('Please Select file');
        } else {
            this.loading = true;
            this.pdfService.post(this.selectedPdf, this.version)
                .subscribe(newPdf => {
                    this.pdfs.push(newPdf['obj']);
                    this.onResetEditing();
                    this.loading = false;
                    this.router.navigate(['/profile/forms/pdfs/pdf-home']);
                    this.logService.success('New pdf uploded successfully');
                }, error => {
                    this.loading = false;
                    this.logService.console(error, true);
                });
        }
    }

    onFileSelected() {
        const inputNode: any = document.querySelector('#file');
        if (inputNode.files[0].name) {
            const fileName = inputNode.files[0].name.split('.')[1];
            if (fileName !== 'pdf') {
                this.logService.error('Only .pdf extension is supported');
                return;
            }
            this.selectedPdf.fileName = inputNode.files[0];
        }
    }

    onResetEditing() {
        this.selectedPdf = new Pdf();
    }

}
