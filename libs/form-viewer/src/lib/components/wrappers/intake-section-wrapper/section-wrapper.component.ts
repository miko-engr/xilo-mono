import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FormViewService } from '@xilo-mono/form-contracts';
@Component({
  selector: 'xilo-mono-form-viewer-section-wrapper-panel',
  templateUrl: './section-wrapper.component.html',
  styleUrls: ['./section-wrapper.component.scss'],
})
export class FormViewerSectionPanelWrapperComponent extends FieldWrapper
  implements OnInit {
  @ViewChild('header') header: ElementRef;
  @ViewChild('mainbody') mainbody: ElementRef;
  isClosed = false;
  @HostListener('keydown.enter')
  enter() {
    if (this.form.valid) {
      this.onRepeat();
    }
  }
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    const headerRect = this.header.nativeElement.getBoundingClientRect();
    const bodyRect = this.mainbody.nativeElement.getBoundingClientRect();
    const totalHeight = headerRect.height + bodyRect.height + 24;
    if (headerRect.top < 128 && headerRect.top > -totalHeight + 128) {
      if (this.field.parent.key) {
        this.formViewService.changeSectionActiveView(this.field.parent.key);
      } else {
        if (this.field.key) {
          this.formViewService.changeSectionActiveView(this.field.key);
        }
      }
    }
  }
  constructor(private formViewService: FormViewService) {
    super();
  }
  ngOnInit() {
    this.formViewService.scrollState.subscribe((key) => {
      if (
        this.field.parent &&
        this.field.parent.type === 'intake-repeat' &&
        this.field.parent.key === key
      ) {
        const elementRect = this.header.nativeElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset - 126;
        window.scrollTo({
          top: absoluteElementTop,
          left: 0,
          behavior: 'smooth',
        });
      } else if (key === this.field.key) {
        const elementRect = this.header.nativeElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset - 126;
        window.scrollTo({
          top: absoluteElementTop,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }
  onRepeat() {
    this.field.parent.templateOptions.onAdd();
    this.field.parent.templateOptions.subIndex =
      this.field.parent.model.length - 1;
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
    } else if (this.field.parent.templateOptions.subIndex > 0) {
      --this.field.parent.templateOptions.subIndex;
    }
    this.field.parent.templateOptions.onRemove(index);
  }
  iconClicked() {
    this.isClosed = !this.isClosed;
  }
}
