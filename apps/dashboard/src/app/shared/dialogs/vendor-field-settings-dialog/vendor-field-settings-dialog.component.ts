import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { IVendorMapping } from '../../../form-builder/form/integrations-manager/interfaces/IVendorMapping';

@Component({
  selector: 'app-vendor-field-settings-dialog',
  templateUrl: './vendor-field-settings-dialog.component.html',
  styleUrls: ['./vendor-field-settings-dialog.component.css'],
})
export class VendorFieldsSettingsDialogComponent implements OnInit {
  vendorMapping: IVendorMapping = this.data.vendorMapping;

  constructor(
    public dialogRef: MatDialogRef<VendorFieldsSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  saveSettings() {
    this.dialogRef.close(this.vendorMapping);
  }
}
