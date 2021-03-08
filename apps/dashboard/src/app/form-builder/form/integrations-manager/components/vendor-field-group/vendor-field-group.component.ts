import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vendor-field-group',
  templateUrl: './vendor-field-group.component.html',
  styleUrls: ['./vendor-field-group.component.scss']
})
export class VendorFieldGroupComponent implements OnInit{
  @Input() form = null;
  @Input() formFields;
  @Input() integrationMapping;
  @Input() fieldGroup: {
    key: string;
    label?: string;
    hideDescendants?: boolean;
    isRequired?: boolean;
    typeDefinition: {
      properties: {
        hideDescendants?: boolean;
        showDescendants?: boolean;
      },
      type: string;
    };
    type: string;
  };

  ngOnInit() {
  }

  isField(property) {
    const obj = (property.value.typeDefinition) ? property.value.typeDefinition : property.value;

    return obj.type === 'string' || obj.type === 'integer' || obj.type === 'date';
  }

  isArrayType(obj) {
    return obj.type === 'array';
  }

  isObjectType(obj) {
    return obj.type === 'object';
  }

  createParentKey(currentKey: string, newValue: string) {
    if (!currentKey) {
      return newValue;
    }
    return `${currentKey}.${newValue}`;
  }

}
