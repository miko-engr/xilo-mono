import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Answer } from '../../models';
import {
  HttpEvent,
} from '@angular/common/http';
import {
  ClientService,
  ApplicationStateService
} from '../../services';
import {
  Params,
  ActivatedRoute
} from '@angular/router';
import { ngf } from 'angular-file';

@Component({
  selector: 'app-question-add-file',
  templateUrl: './question-add-file.component.html',
  styleUrls: ['./question-add-file.component.scss']
})
export class QuestionAddFileComponent implements OnInit {
  @Input() properties: Answer;
  @Output() changeQuestion: EventEmitter<string> = new EventEmitter();
  uploadPercent;
  fileUploaded = false;
  fileUploadError = false;
  filesToUpload;
  uploadFormData: FormData;
  httpEvent: HttpEvent<{}>;

  constructor(
    private applicationService: ApplicationStateService,
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}
  handleUploadDocument() {
    const interval = setInterval(() => {
        if (this.uploadFormData) {
            this.fileUploaded = false;
            const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
            this.clientService.uploadDocument(queryParams.clientId, this.uploadFormData)
            .subscribe(data => {
                this.fileUploaded = true;
                delete this.filesToUpload;
                this.uploadFormData = null;
                // this.changeQuestion.emit('next');
            }, error => {
              console.log(error);
              this.applicationService.formErrorsSource.next({
                message: 'There was an issue uploading this file',
                type: 'warning'
              });
              this.fileUploadError = true;
              delete this.filesToUpload;
              this.uploadFormData = null;
            });
            clearInterval(interval);
        }
    }, 500);
    setTimeout(() => {
        clearInterval(interval);
    }, 6000);
  }

}
