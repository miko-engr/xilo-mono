import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';
import { Params, ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BlockDialogComponent } from './block-dialog/block-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilderService, FormViewService } from '@xilo-mono/form-contracts';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-tree',
  templateUrl: './form-tree.component.html',
  styleUrls: ['./form-tree.component.scss'],
})
export class FormTreeComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() form: any;
  @Input() isSettingOpened = false;
  @Input() isConditionOpened = false;
  @Input() mode = 'form-editor';
  @Output() switchSetting = new EventEmitter();
  @Output() switchCondition = new EventEmitter();
  @Output() selectQuestion = new EventEmitter();
  @Output() selectSection = new EventEmitter();
  @Output() tabItemClicked = new EventEmitter();
  @Output() deleteNode = new EventEmitter();
  @Output() jsonData = new EventEmitter();
  @Output() questionClicked = new EventEmitter();
  activeSection;
  activeQuestionGroup;
  copyActiveSection;
  sectionKeys = [];
  questionGroupKeys = [];
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  mainForm;
  mainFormCopy;
  questionHoverId;
  isDragging = false;
  dragItem = null;
  onOpenBlockDialogSubscription: Subscription;
  onSearchQuestionSubscription: Subscription;
  startX;
  startY;
  currentX;
  currentY;
  sourceElement;

  constructor(
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private formViewService: FormViewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mainForm = this.form.components[0];
    this.sectionKeys = this.mainForm.fieldGroup.map((fg) => fg.key);
    if (this.mainForm.type === 'customer-form') {
      this.questionGroupKeys = this.mainForm.fieldGroup.map((fg) => {
        if (fg.fieldArray) {
          return fg.fieldArray.fieldGroup.map((fgg) => fgg.key);
        } else {
          return fg.fieldGroup.map((fgg) => fgg.key);
        }
      });
    }
    this.mainFormCopy = this.makeCopy(this.form.components[0]);
    this.onOpenBlockDialogSubscription = this.formViewService.openBlockDialog.subscribe(
      (openDialog) => {
        if (openDialog) {
          this.openBlockDialog(0, 0, 0, true);
        }
      },
      (error) => {
        console.log(error, ' Fired');
      }
    );
    this.onSearchQuestionSubscription = this.formBuilderService.searchQuestions.subscribe(
      (searchValue) => {
        if (searchValue) {
          this.searchQuestion(searchValue);
        } else {
          // this.mainForm = this.makeCopy(this.form.components[0]);
        }
      },
      (error) => {
        console.log(error, ' Fired');
      }
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.onOpenBlockDialogSubscription.unsubscribe();
  }

  trackByKey = (item: any) => item.key;

  changeActiveSection(index: any) {
    if (this.activeSection === index) {
      this.activeSection = null;
      this.selectSection.emit(-1);
    } else {
      this.activeSection = index;
      this.selectSection.emit(index);
    }
  }

  changeActiveQuestionGroup(index: any) {
    if (this.activeQuestionGroup === index) {
      this.activeQuestionGroup = null;
      this.selectQuestion.emit(-1);
    } else {
      this.activeQuestionGroup = index;
      this.selectQuestion.emit(index);
    }
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  onIsDragging() {
    this.activeSection = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.cdRef.reattach();
    moveItemInArray(
      this.mainForm.fieldGroup,
      event.previousIndex,
      event.currentIndex
    );
  }

  dropItem(event: CdkDragDrop<string[]>) {
    this.cdRef.reattach();
    if (this.mode !== 'json-only') {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  makeCopy(item: object) {
    return JSON.parse(JSON.stringify(item));
  }

  onSettingClick(section, questionGroup?, question?) {
    this.switchSetting.emit({
      question,
      section,
      questionGroup,
    });
  }

  onConditionsClick(node) {
    this.switchCondition.emit(node);
  }

  onDuplicateClick(sectionIndex, questionIndex = null) {
    if (this.mainForm.fieldGroup && this.mainForm.fieldGroup[sectionIndex]) {
      if (!questionIndex && questionIndex !== 0) {
        const newSection = cloneDeep(this.mainForm.fieldGroup[sectionIndex]);
        newSection.key = v4();
        this.mainForm.fieldGroup.splice(sectionIndex + 1, 0, newSection);
      } else {
        let section = this.mainForm.fieldGroup[sectionIndex];
        if (section.fieldArray) {
          section = section.fieldArray;
        }

        if (section.fieldGroup[questionIndex]) {
          const newQuestion = cloneDeep(section.fieldGroup[questionIndex]);
          newQuestion.key = v4();
          section.fieldGroup.splice(questionIndex + 1, 0, newQuestion);
        }
      }
    }
  }

  duplicate(item: FormlyFieldConfig) {
    let keyMappings = {};
    const duplicated = this.duplicateRecursive(item, keyMappings);
    this.remapConditionalLogic(duplicated, keyMappings);
    return duplicated;
  }

  duplicateRecursive(
    item: FormlyFieldConfig,
    keyMappings: { [key: string]: string } = {}
  ) {
    const newItem = cloneDeep(item);
    newItem.key = v4();
    keyMappings[<string>item.key] = newItem.key;
    if (newItem.fieldArray) {
      newItem.fieldArray.fieldGroup = newItem.fieldArray?.fieldGroup?.map(
        (child) => this.duplicateRecursive(child, keyMappings)
      );
    } else if (item.fieldGroup) {
      newItem.fieldGroup = newItem.fieldGroup?.map((child) =>
        this.duplicateRecursive(child, keyMappings)
      );
    }
    return newItem;
  }

  remapConditionalLogic(
    item: FormlyFieldConfig,
    keyMappings: { [key: string]: string }
  ) {
    if (item.templateOptions?.query) {
      item.templateOptions.query.rules?.forEach((rule) => {
        rule.field = this.getMappedValue(rule.field, keyMappings);
      });
    }
    if (item.fieldArray) {
      item.fieldArray.fieldGroup?.forEach((child) =>
        this.remapConditionalLogic(child, keyMappings)
      );
    } else if (item.fieldGroup) {
      item.fieldGroup?.forEach((child) =>
        this.remapConditionalLogic(child, keyMappings)
      );
    }
  }

  getMappedValue(value: string, keyMappings: { [key: string]: string }) {
    const mapped = keyMappings[value];
    return mapped || value;
  }

  onDuplicateSection(sectionIndex: number) {
    const currentSection = this.mainForm?.fieldGroup[sectionIndex];
    if (currentSection) {
      const newSection = this.duplicate(currentSection);
      this.mainForm.fieldGroup.splice(sectionIndex + 1, 0, newSection);
    }
  }

  onDuplicateQuestionGroup(sectionIndex: number, questionGroupIndex: number) {
    const section = this.mainForm?.fieldGroup[sectionIndex];
    if (section) {
      const fieldGroup = section.fieldArray
        ? section.fieldArray.fieldGroup
        : section.fieldGroup;
      const currentQuestionGroup = fieldGroup[questionGroupIndex];
      if (currentQuestionGroup) {
        const newQuestionGroup = this.duplicate(currentQuestionGroup);
        fieldGroup.splice(questionGroupIndex + 1, 0, newQuestionGroup);
      }
    }
  }

  onDuplicateQuestion(
    sectionIndex: number,
    questionGroupIndex: number,
    questionIndex: number
  ) {
    const section = this.mainForm?.fieldGroup[sectionIndex];
    if (section) {
      const sectionFieldGroup = section.fieldArray
        ? section.fieldArray.fieldGroup
        : section.fieldGroup;
      if (questionGroupIndex) {
        const questionGroup = sectionFieldGroup[questionGroupIndex];
        if (questionGroup) {
          const fieldGroup = questionGroup.fieldArray
            ? questionGroup.fieldArray.fieldGroup
            : questionGroup.fieldGroup;
          const currentQuestion = fieldGroup[questionIndex];
          if (currentQuestion) {
            const newQuestion = this.duplicate(currentQuestion);
            fieldGroup.splice(questionIndex + 1, 0, newQuestion);
          }
        }
      } else {
        const currentQuestion = sectionFieldGroup[questionIndex];
        if (currentQuestion) {
          const newQuestion = this.duplicate(currentQuestion);
          sectionFieldGroup.splice(questionIndex + 1, 0, newQuestion);
        }
      }
    }
  }

  onDeleteClick(sectionIndex: any, questionIndex: any = null) {
    if (this.mainForm.fieldGroup && this.mainForm.fieldGroup[sectionIndex]) {
      if (!questionIndex && questionIndex !== 0) {
        if (this.mainForm.fieldGroup.length === 1) {
        }
        this.mainForm.fieldGroup.splice(sectionIndex, 1);
      } else {
        let section = this.mainForm.fieldGroup[sectionIndex];
        if (section.fieldArray) {
          section = section.fieldArray;
        }

        if (section.fieldGroup[questionIndex]) {
          section.fieldGroup.splice(questionIndex, 1);
        }
      }
    }
  }

  onDeleteSection(sectionIndex: number) {
    if (this.mainForm.fieldGroup && this.mainForm.fieldGroup[sectionIndex]) {
      if (this.mainForm.fieldGroup.length === 1) {
        return alert(
          'Please create another section to delete this one. Each form must have at least 1 section'
        );
      }
      this.mainForm.fieldGroup.splice(sectionIndex, 1);
    }
  }

  onDeleteQuestionGroup(sectionIndex: number, questionGroupIndex: number) {
    const section = this.mainForm?.fieldGroup[sectionIndex];
    if (section) {
      const fieldGroup = section.fieldArray
        ? section.fieldArray.fieldGroup
        : section.fieldGroup;
      if (fieldGroup.length === 1) {
        return alert(
          'Please create another question group to delete this one. Each section  must have at least 1 question group'
        );
      }
      fieldGroup?.splice(questionGroupIndex, 1);
    }
  }

  onDeleteQuestion(
    sectionIndex: number,
    questionGroupIndex: number,
    questionIndex: number
  ) {
    const section = this.mainForm?.fieldGroup[sectionIndex];
    if (section) {
      const sectionFields = section.fieldArray
        ? section.fieldArray.fieldGroup
        : section.fieldGroup;
      if (questionGroupIndex || questionGroupIndex === 0) {
        const questionGroup = sectionFields[questionGroupIndex];
        if (questionGroup) {
          const fieldGroup = questionGroup.fieldArray
            ? questionGroup.fieldArray.fieldGroup
            : questionGroup.fieldGroup;
          if (fieldGroup.length === 1) {
            return alert(
              'Please create another question to delete this one. Each question group must have at least 1 question'
            );
          }
          fieldGroup?.splice(questionIndex, 1);
        }
      } else {
        if (sectionFields.length === 1) {
          return alert(
            'Please create another question to delete this one. Each section must have at least 1 question'
          );
        }
        sectionFields?.splice(questionIndex, 1);
      }
    }
  }

  onTabItemClicked(obj: {
    item: any;
    tab: any;
    questionGroupIndex: any;
    questionIndex: any;
    sectionIndex: any;
  }) {
    let { item } = obj;
    const { tab, sectionIndex, questionIndex, questionGroupIndex } = obj;
    item = this.makeCopy(item);
    delete item.id;
    delete item.label;
    delete item.icon;
    delete item.value;
    delete item.src;
    let section =
      this.mainForm.fieldGroup && this.mainForm.fieldGroup[sectionIndex];
    if (section) {
      if (tab.id === 0) {
        item.key = v4();
        this.mainForm.fieldGroup.push(item);
      } else {
        if (section.fieldArray) {
          section = section.fieldArray;
        }
        if (tab.id === 2) {
          item.key = v4();
          section.fieldGroup.splice(questionGroupIndex + 1, 0, item);
        } else {
          const group =
            this.mainForm.type === 'intake-form'
              ? section
              : section.fieldGroup[questionGroupIndex];
          if (item.isGroup) {
            delete item.isGroup;
            for (let i = 0; i < item.data.length; i++) {
              const oneItem = item.data[i];
              oneItem.key = v4();
            }
            group.fieldGroup.splice(questionIndex + 1, 0, ...item.data);
          } else {
            item.key = v4();
            group.fieldGroup.splice(questionIndex + 1, 0, item);
          }
        }
      }
      setTimeout(() => {
        this.selectSection.emit(sectionIndex);
      }, 500);
    }
  }

  getConnectedList(sections: any[]): any[] {
    if (this.sectionKeys.length === 0) {
      this.sectionKeys = sections.map((x) => `${x.key}`);
    }
    return this.sectionKeys;
  }

  onHoverDuringDrag(index) {
    if (this.isDragging) {
      if (this.dragItem === 'questionGroup') {
        this.activeQuestionGroup = index;
      }
    }
  }

  onDragStart(event: any, section, questionGroup?: any) {
    this.dragItem = questionGroup ? 'questionGroup' : null;
    this.isDragging = true;
    this.formBuilderService.changeFormTreeDragging(true);
    this.sourceElement = event.source.element.nativeElement;
    const type = event.source.data.type === 'checkbox' ? 'checkbox' : 'input';
    const rect = event.source.element.nativeElement.getBoundingClientRect();
    const data = {
      field: event.source.data,
      value: event.source.data.key,
      placeholder: event.source.data.templateOptions.placeholder,
      parentValue: section.key,
      type,
      index: 0,
    };

    // @ts-ignore
    if (type === 'checkbox') data.expectedValue = true;

    this.formBuilderService.changeFormFieldData(data);
    this.startX = rect.x;
    this.startY = rect.y;
    this.cdRef.detach();
    // console.log('Dragging', event, this.isDragging);
    // if (this.mode !== 'json-only') {
    //   this.activeSection = 'all';
    // }
  }

  onDragMoved($event) {
    this.currentX = $event.event.clientX;
    this.currentY = $event.event.clientY;
  }

  onDragEnd($event) {
    this.isDragging = false;
    this.cdRef.reattach();
    setTimeout(() => {
      this.formBuilderService.changeFormTreeDragging(false);
    }, 500);
  }

  openBlockDialog(
    questionIndex: any,
    questionGroupIndex: any,
    sectionIndex: any,
    isSection?: boolean,
    isQuestionGroup?: boolean
  ) {
    const dialogRef = this.dialog.open(BlockDialogComponent, {
      width: '40rem',
      panelClass: 'dialog',
      data: {
        isSection: isSection,
        isQuestionGroup: isQuestionGroup,
        questionIndex: questionIndex,
        questionGroupIndex: questionGroupIndex,
        sectionIndex: sectionIndex,
        formType: this.mainForm.type,
      },
    });
    dialogRef.afterClosed().subscribe((results) => {
      if (results) {
        this.onTabItemClicked(results);
      }
    });
  }

  searchQuestion(value: string) {
    value = value.toLowerCase();
    let filter = [];
    this.mainFormCopy = this.makeCopy(this.form.components[0]);
    const filteredData = this.mainFormCopy.fieldGroup.map((fg) => {
      if (fg.fieldArray) {
        filter = fg.fieldArray.fieldGroup.filter((fAFg) => {
          const lowerCaseLabel =
            fAFg.templateOptions && fAFg.templateOptions.label
              ? fAFg.templateOptions.label.toLowerCase()
              : null;
          return lowerCaseLabel.split(' ').some((i) => i.startsWith(value));
        });
        fg.fieldArray.fieldGroup = filter;
      } else if (fg.fieldGroup) {
        filter = fg.fieldGroup.some((fGFg) => {
          const lowerCaseLabel =
            fGFg.templateOptions && fGFg.templateOptions.label
              ? fGFg.templateOptions.label.toLowerCase()
              : null;
          return lowerCaseLabel.split(' ').some((i) => i.startsWith(value));
        });
        fg.fieldGroup = filter;
      }
      return fg;
    });
    this.mainForm.fieldGroup = filteredData.filter((fg) => {
      if (fg.fieldArray) return fg.fieldArray.fieldGroup.length ? true : false;
      else if (fg.fieldArray) return fg.fieldGroup.length ? true : false;
    });
  }

  onQuestionClick(question) {
    this.questionClicked.emit(question);
  }
}
