import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'xilo-mono-form-viewer-question-wrapper-panel',
  templateUrl: './question-wrapper.component.html',
  styleUrls: ['./question-wrapper.component.scss']
})
export class FormViewerQuestionPanelWrapperComponent extends FieldWrapper implements OnInit {
  @ViewChild('header') header: ElementRef;
  width = window.innerWidth;

  isClosed = false;

  @HostListener('keydown.enter')
  enter() {
    if (this.form.valid) {
      this.onRepeat();
    }
  }

  constructor(
    private formViewService: FormViewService
  ) {
    super();
  }

  ngOnInit() {
    this.formViewService.scrollState
    .subscribe(key => {
      if (this.field.parent && this.field.parent.type === 'intake-repeat' && this.field.parent.key === key) {
        this.header.nativeElement.scrollIntoView({behavior: 'smooth'});
      } else if (key === this.field.key) {
        this.header.nativeElement.scrollIntoView({behavior: 'smooth'});
      }
    })
  }

  get isMobile() {
    return this.width <= 767;
  }

  onRepeat() {
    this.field.parent.templateOptions.onAdd();
    this.field.parent.templateOptions.subIndex = (this.field.parent.model.length - 1);
  }

  onSwitchSubIndex(index: number) {
    this.field.parent.templateOptions.subIndex = index;
  }

  subIndexIsActive(subIndex: string | number) {
    return this.field.parent.templateOptions.subIndex === subIndex;
  }

  onRemoveObject(index: number) {
    if (this.field.parent.templateOptions.subIndex === index) {
      this.field.parent.templateOptions.subIndex = 0;
    } else {
      --this.field.parent.templateOptions.subIndex;
    }
    this.field.parent.templateOptions.onRemove(index);
  }

}
