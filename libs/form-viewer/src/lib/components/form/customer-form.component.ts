import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { FormViewService } from '@xilo-mono/form-contracts';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'xilo-mono-form-viewer-customer-form',
  styles: [
    `
      .hidden {
        display: none;
      }
    `,
  ],
  template: `
    <div
      *ngFor="let step of field.fieldGroup; let index = index; let last = last"
    >
      <formly-field
        [field]="step"
        [ngClass]="activeSection !== +index ? 'hidden' : ''"
      ></formly-field>
    </div>
  `,
})
export class CustomerFormTypeComponent extends FieldType implements OnInit {
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  activeSection = 0;
  nextFormQuestionSubscription: Subscription;

  constructor(
    private formViewService: FormViewService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.queryParams = Object.assign({}, this.route.snapshot.queryParams);
      this.queryParams.section = +this.queryParams.section || 0;
      this.activeSection = this.queryParams.section;
    });
    this.field.templateOptions = {
      ...this.field.templateOptions,
      onNextForm: (section?: number) => {
        this.nextForm(section);
      },
    };
    this.nextFormQuestionSubscription = this.formViewService.nextFormSection.subscribe(
      (section) => {
        if (section !== null) {
          console.log('Next section hit: ', section);
          this.nextForm(section);
          this.formViewService.onNextFormBySection(null);
        }
      },
      (error) => console.log(error)
    );
  }

  ngAfterViewInit() {
    const test = this.formViewService.form;
  }

  nextForm(section: number) {
    console.log(section);
    this.queryParams.section =
      section != null ? section : +this.queryParams.section + 1;
    this.activeSection = this.queryParams.section;
    this.queryParams.question = 0;
    this.refreshRoute();
  }

  refreshRoute() {
    this.router.navigate([], {
      queryParams: {
        ...this.queryParams,
      },
    });
    setTimeout(() => {
      this.formViewService.changeLoadState('loaded');
    }, 500);
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every((f) => this.isValid(f));
  }
}
