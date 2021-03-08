import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-vendor-dialog',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.css'],
  })
  export class VendorDialog implements OnInit {
      vendor = {vendorName: null, username: null, password: null, accessToken: null, completed: false, state: null, carrier: null, agency: null};

    constructor(
        public dialogRef: MatDialogRef<VendorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.vendor.vendorName = this.data.vendorName;
        this.vendor.username = this.data.username;
    }

    closeDialog() {
      this.vendor.completed = true;
      if (this.vendor.vendorName === 'RATER') {
        this.vendor.vendorName = this.vendor.carrier.toUpperCase();
      } else  {
        this.vendor.vendorName = this.vendor.vendorName.toUpperCase();
      }
      this.dialogRef.close(this.vendor);
    }

  }
