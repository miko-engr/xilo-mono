import {
  Component,
  ViewChild,
  TemplateRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormlyFieldConfig, FieldArrayType } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';

@Component({
  selector: 'xilo-mono-form-viewer-datatable',
  template: `
    <ngx-datatable
      #table
      class="bootstrap"
      [rows]="model"
      [columns]="to.columns"
      [columnMode]="to.columnMode"
      [rowHeight]="to.rowHeight"
      [headerHeight]="to.headerHeight"
      [footerHeight]="to.footerHeight"
      [limit]="to.limit"
      [scrollbarH]="to.scrollbarH"
      [reorderable]="to.reorderable"
      [externalSorting]="true"
      [selectionType]="'single'"
    >
      <ng-template
        #defaultColumn
        ngx-datatable-cell-template
        let-rowIndex="rowIndex"
        let-value="value"
        let-row="row"
        let-column="column"
      >
        <formly-field
          [field]="getField(field, column, rowIndex)"
        ></formly-field>
      </ng-template>
    </ngx-datatable>
  `,
})
export class CustomDataTableComponent extends FieldArrayType
  implements OnInit, AfterViewInit {
  @ViewChild('defaultColumn') public defaultColumn: TemplateRef<any>;

  ngOnInit(): void {
    console.log("CustomDataTableComponent", this)
  }
  
  ngAfterViewInit() {
    this.to.columns.forEach(
      (column) => (column.cellTemplate = this.defaultColumn)
    );
  }

  getField(
    field: FormlyFieldConfig,
    column: TableColumn,
    rowIndex: number
  ): FormlyFieldConfig {
    return field.fieldGroup[rowIndex].fieldGroup.find(
      (f) => f.key === column.prop
    );
  }
}
