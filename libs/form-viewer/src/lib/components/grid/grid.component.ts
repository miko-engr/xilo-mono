import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { GridOptions } from 'ag-grid-community';
import { GridCellComponent } from './cell.component';

@Component({
  selector: 'xilo-mono-form-viewer-grid',
  template: `
    <div [ngStyle]="style">
      <ag-grid-angular
        #agGrid
        style="width: 100%; height: 100%"
        class="className"
        [gridOptions]="gridOptions"
        [rowData]="model"
        (firstDataRendered)="onFirstDataRendered($event)"
      >
      </ag-grid-angular>
    </div>
  `,
})
export class CustomGridComponent extends FieldArrayType implements OnInit {
  @ViewChild('agGrid') agGrid: TemplateRef<any>;

  gridOptions: GridOptions;
  style: any = {};

  ngOnInit() {
    this.style = {
      width: this.to.width,
      height: this.to.height,
    };

    this.to.gridOptions.columnDefs.forEach(
      (column) => (column.cellRendererFramework = GridCellComponent)
    );

    const gridOptions: GridOptions = this.to.gridOptions || {};
    gridOptions.context = {
      parentField: this.field,
    };

    this.gridOptions = gridOptions;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}
