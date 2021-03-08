import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-form-builder-component-condition-setting',
  templateUrl: './condition-setting.html',
  styleUrls: ['./condition-setting.scss'],
})
export class ConditionSettingComponent implements OnInit {
  @Output() refreshPreview = new EventEmitter();

  @Input() set selectedField(value: any) {
    this.selectedNode = value;
    this.query = value?.templateOptions?.query;
    if (this.query && !this.query.showWhenTrue) {
      this.query.showWhenTrue = false;
    }
  }
  @Input() form;

  @Output() closePanel = new EventEmitter();
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  query: any;
  selectedNode;
  config = {};
  queryConfig = {};
  newQuery = false;

  constructor(
    private formViewService: FormViewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.config = this.generateConfigData(this.form.components);
  }

  showQuery() {
    return (this.query && this.query?.rules?.length > 0) || this.newQuery;
  }

  createQuery() {
    this.query = { condition: 'and', rules: [], showWhenTrue: true };
    this.newQuery = true;
  }

  onQueryChange(queryData) {
    if (this.selectedNode) {
      if (this.selectedNode.type === 'intake-repeat') {
        this.selectedNode.fieldArray.templateOptions.query = queryData.query;
        this.selectedNode.fieldArray.hideExpression = queryData.expression;
      } else {
        this.selectedNode.templateOptions.query = queryData.query;
        this.selectedNode.hideExpression = queryData.expression;
      }
      this.formViewService.changeRebuildForm(true);
    }
  }

  generateConfigData(components) {
    const fieldsData = {};
    components.forEach((component) => {
      if (component.fieldGroup?.length > 0) {
        this.setQueryFromFieldGroup(component.fieldGroup, fieldsData);
      }
    });
    return { fields: fieldsData };
  }

  setQueryFromFieldGroup(fieldGroups, fieldsData, parents: string[] = []) {
    fieldGroups.forEach((fieldGroup) => {
      if (fieldGroup.fieldGroup?.length > 0) {
        // Section form type
        this.setQueryFromFieldGroup(fieldGroup.fieldGroup, fieldsData, [
          ...parents,
          fieldGroup.key,
        ]);
      } else if (fieldGroup.fieldArray?.fieldGroup?.length > 0) {
        // Repeat form type
        this.setQueryFromFieldGroup(
          fieldGroup.fieldArray.fieldGroup,
          fieldsData,
          [...parents, fieldGroup.key]
        );
      } else {
        this.generateConfig(fieldGroup, fieldsData, parents); // Actual element
      }
    });
  }

  generateConfig(element, fieldsData, parents: string[] = []) {
    if (element.templateOptions.label) {
      const fieldConfig = {
        name: element.templateOptions.label,
        parents: [...parents],
        type: element.templateOptions.type || 'string',
        options: null,
      };
      if (
        element.type === 'select' ||
        element.type === 'selectbox' ||
        element.type === 'radio'
      ) {
        fieldConfig.type = 'category';
        fieldConfig.options =
          element.templateOptions.options?.map((opt) => {
            return {
              name: opt.label,
              value: opt.value,
            };
          }) || [];
      } else if (element.type === 'checkbox') {
        fieldConfig.type = 'category';
        fieldConfig.options = [
          { name: 'Checked', value: true },
          { name: 'Unchecked', value: false },
        ];
      }

      fieldsData[element.key] = fieldConfig;
    }
  }

  onRefreshPreview() {
    this.refreshPreview.emit();
  }

  onClose() {
    this.closePanel.emit();
  }
}
