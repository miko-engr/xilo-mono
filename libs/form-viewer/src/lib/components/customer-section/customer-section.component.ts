import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FieldType } from '@ngx-formly/core';
import { FormViewService } from '@xilo-mono/form-contracts';
import { Subscription } from 'rxjs/internal/Subscription';
import { CustomerFormFacade } from '../../+state/customer-form/customer-form.facade';

@Component({
  selector: 'xilo-mono-form-viewer-customer-section',
  templateUrl: './customer-section.component.html',
  styleUrls: ['./customer-section.component.scss'],
})
export class CustomerSectionTypeComponent extends FieldType implements OnInit {
  activeGroup = 0;
  activeSection = 0;
  nextFormSubscription: Subscription;
  nextFormQuestionSubscription: Subscription;

  constructor(
    private formViewService: FormViewService,
    private customerFormFacade: CustomerFormFacade
  ) {
    super();
  }

  ngOnInit() {
    this.customerFormFacade.questionIndex$.subscribe((index) => {
      this.activeGroup = index;
    });
    this.customerFormFacade.sectionIndex$.subscribe((index) => {
      this.activeSection = index;
    });

    this.nextFormSubscription = this.formViewService.nextForm.subscribe(
      (next) => {
        if (next) {
          console.log('Next question hit: ', next);
          this.onNextForm();
          this.formViewService.onNextForm(false);
        }
      },
      (error) => console.log(error)
    );
  }

  ngAfterViewInit() {
    this.formViewService.sectionLoaded();
  }

  onNextForm(question?: number) {
    this.customerFormFacade.next();
  }

  onRepeat() {
    this.field.parent.templateOptions.onAdd();
    this.field.parent.templateOptions.subIndex++;
  }
}
