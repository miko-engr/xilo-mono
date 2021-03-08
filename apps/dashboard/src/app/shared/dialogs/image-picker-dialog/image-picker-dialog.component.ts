import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AppImageService } from '../../../services/app-image.service';
import { escapeRegExp } from '@angular/compiler/src/util';
import { HttpEvent } from '@angular/common/http';
import { UploadService } from '../../../services/upload.service';

@Component({
    selector: 'app-image-picker-dialog',
    templateUrl: './image-picker-dialog.component.html',
    styleUrls: ['./image-picker-dialog.component.css'],
  })
  export class DialogImagePicker implements OnInit {

    brandColor = null;
    imagesRetrieved = false;

    images = [];
    uploadPercent;
    fileUploaded = false;
    fileUploadError = false;
    filesToUpload;
    uploadFormData: FormData;
    httpEvent: HttpEvent<{}>;

    constructor(
        public dialogRef: MatDialogRef<DialogImagePicker>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private appImageService: AppImageService,
        private uploadService: UploadService
    ) {}

    ngOnInit() {
        this.getImages();
    }

    openLink(data: any) {
      this.dialogRef.close(data);
    }

    storeImage(i: number) {
        const image = this.images[i];
        this.openLink(image);
    }

    removeImage() {
        this.openLink(false);
    }

  handleUploadDocument() {
    const interval = setInterval(() => {
        if (this.uploadFormData) {
            this.fileUploaded = false;
            this.uploadService.postImage(this.uploadFormData)
            .subscribe(file => {
                this.fileUploaded = true;
                delete this.filesToUpload;
                this.uploadFormData = null;
                const data = {
                    imageUrl: `https://s3-us-west-2.amazonaws.com/rent-z/${file['obj'].file}`,
                    imageIsSVG: false
                };
                this.openLink(data);
            }, error => {
              console.log(error);
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

    getImages() {
        this.appImageService.getAll()
            .subscribe(appImages => {
                if (appImages['obj']) {
                    for (let i = 0; i < appImages['obj'].length; i++) {
                        const aI = appImages['obj'][i];
                        this.images.push(this.replaceAll(aI.image, '!{}', this.data.brandColor));
                        if (!appImages['obj'][i + 1]) {
                            this.imagesRetrieved = true;
                        }
                    }
                }
            }, error => {

            });
    }

    returnIcon() {
        if (this.data.type === 'question') {
            return this.data.obj.image;
        } else if (this.data.type === 'answer') {
            return this.data.obj.icon;
        }
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

  }
