import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
@Component({
  selector: 'xilo-mono-form-viewer-intake-section',
  templateUrl: './intake-section.component.html',
  styleUrls: [
    '../../assets/custom-theme.scss',
    './intake-section.component.scss',
  ],
})
export class IntakeSectionTypeComponent extends FieldType implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

  constructor(private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.field.fieldGroup.forEach((field) => {
      if (field.type === 'checkbox') {
        field.templateOptions.label = '';
        if (field.templateOptions.required) field.templateOptions.text += ' *';
      }
    });
  }

  onRepeat() {
    this.field.parent.templateOptions.onAdd();
    this.field.parent.templateOptions.subIndex++;
  }
}
