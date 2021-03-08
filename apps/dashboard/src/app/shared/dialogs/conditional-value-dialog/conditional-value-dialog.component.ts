import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { IVendorMapping } from '../../../form-builder/form/integrations-manager/interfaces/IVendorMapping';
import { IVendorTransformation } from '../../../form-builder/form/integrations-manager/interfaces/IVendorTransformation';
import { QueryBuilderConfig } from 'angular2-query-builder';

@Component({
  selector: 'app-conditional-value-dialog',
  templateUrl: './conditional-value-dialog.component.html',
  styleUrls: ['./conditional-value-dialog.component.css'],
})
export class ConditionalValueDialogComponent implements OnInit {
  vendorMapping: IVendorMapping = this.data.vendorMapping;
  transformation: IVendorTransformation = {};
  viewOptions = false;
  conditionalOperators = [
    { title: 'Equals', sign: '=' },
    { title: 'Does Not Equal', sign: '!=' },
    { title: 'Is Greater Than', sign: '>' },
    { title: 'Is Less Than', sign: '<' },
    { title: 'Contains', sign: '+' },
    { title: 'Does Not Contain', sign: '!+' },
    { title: 'Is Empty', sign: '!' },
    { title: 'Is Not Empty', sign: '!!' },
  ];
  options = this.data.options;
  hidden = false;
  fields = this.data.formFields;
  query = {
    condition: 'and',
    rules: [
      {field: 'age', operator: '<=', value: 'Bob'},
      {field: 'gender', operator: '>=', value: 'm'}
    ]
  };
  config: QueryBuilderConfig = {
    fields: {
      age: {name: 'Age', type: 'number'},
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      }
    }
  }
  
  constructor(
    private logService: LogService,
    public dialogRef: MatDialogRef<ConditionalValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onQueryChange() {
    
  }

  addTransformation() {
    this.transformation = {
      method: null,
      formFieldKey: this.vendorMapping.formFieldKey,
      formFieldLabel: this.vendorMapping.formFieldLabel,
      vendorFieldType: this.vendorMapping.vendorFieldType
    };
  }

  removeTransformation() {
    if (confirm('Are you sure you want to delete this?')) {
      this.vendorMapping.transformation = null;
      this.dialogRef.close('delete');
    }
  }

  saveSettings() {
    if (this.transformation) {
      this.vendorMapping.transformation = this.transformation;
    }
    this.dialogRef.close(this.vendorMapping);
  }
}
