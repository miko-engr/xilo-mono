import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerFormFacade } from '../../+state/customer-form/customer-form.facade';

@Component({
  selector: 'xilo-mono-form-viewer-selectbox',
  templateUrl: './selectbox.component.html',
  styleUrls: ['./selectbox.component.scss'],
})
export class CustomSelectboxComponent extends FieldType
  implements OnInit, OnDestroy {
  public selectOptionList: Array<string> = [];
  key;

  isLastQuestionInSection = false;

  private ngUnsubscriber$ = new Subject();

  public get isMultipleSelect() {
    return this.to?.isMultipleSelect;
  }

  constructor(private customerFormFacade: CustomerFormFacade) {
    super();
  }

  ngOnInit() {
    if (this.isMultipleSelect && this.formControl?.value) {
      this.selectOptionList = this.formControl.value;
    }
    this.customerFormFacade.isLastQuestionInSection$
      .pipe(takeUntil(this.ngUnsubscriber$))
      .subscribe((isLast) => {
        this.isLastQuestionInSection = isLast;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscriber$.next();
    this.ngUnsubscriber$.complete();
  }

  getValue(): string {
    return this.formControl?.value;
  }

  handleOptionSelect(item) {
    if (!this.isMultipleSelect) {
      this.formControl.patchValue(item.value);
      this.formControl.markAsDirty();
      this.gotoNext();
    } else if (this.isMultipleSelect) {
      if (!this.selectOptionList.includes(item.value)) {
        this.selectOptionList.push(item.value);
      } else {
        if (this.selectOptionList.includes(item.value)) {
          this.selectOptionList.splice(
            this.selectOptionList.indexOf(item.value),
            1
          );
        }
      }
      this.formControl.patchValue(this.selectOptionList);
      this.formControl.markAsDirty();
    }
  }

  handleInputChange(target) {
    // if (target.value) {
    //   this.options = this.to.options.filter(
    //     op => op.label.toLowerCase().indexOf(target.value.toLowerCase()) > -1
    //   );
    // } else {
    //   this.options = [...this.to.options];
    // }
  }

  isSelectedOption(data): boolean {
    return this.selectOptionList.includes(data);
  }

  gotoNext() {
    setTimeout(() => {
      this.customerFormFacade.next();
    }, 500);
  }

  handleTooltipClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  formatLSO(labeledSelectOptions) {
    return JSON.parse(labeledSelectOptions);
  }
}
