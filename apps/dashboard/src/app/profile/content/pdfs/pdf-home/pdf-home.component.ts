import { Component, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { LogService } from '../../../../services/log.service';
import { PdfService } from '../../../../services/pdf.service';
import { Pdf } from '../../../../models/pdf.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discount-home',
  templateUrl: './pdf-home.component.html',
  styleUrls: ['../pdf.component.css']
})
export class PdfHomeComponent implements OnInit {

  pdfsRetrieved = false;
  pdfs: Pdf[];

  constructor(
    private logService: LogService,
    private pdfService: PdfService,
    private router: Router
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

  deletePdfs(i: number) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.pdfService.delete(this.pdfs[i])
        .subscribe(data => {
          this.pdfs.splice(i, 1);
        }, error => {
          this.logService.console(error, true);
        });
    }
  }

  routeToPdf(id) {
    this.router.navigate(['./profile/builder/pdf', id]);
  }

}

