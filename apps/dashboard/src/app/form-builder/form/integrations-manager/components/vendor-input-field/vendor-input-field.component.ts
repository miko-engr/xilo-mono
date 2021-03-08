import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { IVendorMapping } from '../../interfaces/IVendorMapping';
import { VendorIntegrationMappingService } from '../../services/vendorIntegrationMapping.service';
import _ from 'lodash';
import { MatMenuTrigger } from '@angular/material/menu';
import { Transformation } from '../../../../../models/transformation.model';
import { isMatch } from '@xilo-mono/form-helper';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilderService } from '@xilo-mono/form-contracts';
import { VendorFieldsSettingsDialogComponent } from 'apps/dashboard/src/app/shared/dialogs/vendor-field-settings-dialog/vendor-field-settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConditionalValueDialogComponent } from 'apps/dashboard/src/app/shared/dialogs/conditional-value-dialog/conditional-value-dialog.component';

@Component({
  selector: 'vendor-input-field',
  templateUrl: './vendor-input-field.component.html',
  styleUrls: ['./vendor-input-field.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: false },
    },
  ],
})
export class VendorInputFieldComponent implements OnInit {
  @Input() integrationMapping;
  @Input() companyName;
  @Input() index;
  @Input() field;
  @Input() fieldKey;
  @Input() fieldParentKey;
  @Input() form = null;
  @Input() formFields;
  @Input() isRequired = false;
  @Output() mappingUpdated: EventEmitter<{}> = new EventEmitter();

  @Input() fieldName: string;
  @Input() fieldId: string;

  // TODO: tree component created causes massive lag in page, disabling for now
  dropDownEnabled = true;
  value = '';
  highlighted = false;
  showDebugData = false;
  isHardCode = false;
  integrationSearchValue = '';
  vendorMapping: IVendorMapping = null;
  hasError = false;
  error;
  hasWarning = false;
  warning;
  contextMenuPosition = { x: '0px', y: '0px' };
  contextMenu: MatMenuTrigger = null;
  showContextMenu = false;
  settingsMenuPosition = { x: '0px', y: '0px' };
  showSettingsMenu = false;
  transformation: Transformation = new Transformation();
  formFieldSubscription: Subscription;
  formTreeDraggingSubscription: Subscription;
  formTreeIsDragging = false;
  data = null;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  conditionOperators = [
    { title: 'Equals', sign: '=' },
    { title: 'Does Not Equal', sign: '!=' },
    { title: 'Is Greater Than', sign: '>' },
    { title: 'Is Less Than', sign: '<' },
    { title: 'Contains', sign: '+' },
    { title: 'Does Not Contain', sign: '!+' },
    { title: 'Is Empty', sign: '!' },
    { title: 'Is Not Empty', sign: '!!' },
  ];
  constructor(
    public dialog: MatDialog,
    private formBuilderService: FormBuilderService,
    private vendorIntegrationMappingService: VendorIntegrationMappingService
  ) {}

  ngOnInit() {
    this.formFieldSubscription = this.formBuilderService.formFieldData.subscribe(
      (data) => {
        this.data = (data && Object.keys(data).length) ? data : null;
      }
    );
    this.formTreeDraggingSubscription = this.formBuilderService.formTreeDragging.subscribe(
      (isDragging) => {
        this.formTreeIsDragging = isDragging;
      }
    );
    if (this.integrationMapping) {
      const foundMapping = _.find(this.integrationMapping.jsonMapping, {
        vendorPath: `${this.fieldParentKey}.${this.fieldKey}`,
      });
      if (foundMapping) {
        this.vendorMapping = foundMapping;
        // @ts-ignore
        if (foundMapping.staticValue) {
          this.value = foundMapping.staticValue;
        } else if (foundMapping.formFieldLabel) {
          this.value = foundMapping.formFieldLabel;
        } else {
          this.value = 'Invalid Value - Please Remove';
        }
      } else {
        this.vendorMapping = null;
        this.value = null;
      }
    }
  }

  onFormTreeQuestionClick(questionObj) {
    this.value = questionObj.templateOptions?.label
      ? questionObj.templateOptions.label
      : questionObj.target.value;
    const vendorFieldType = this.field.enum ? 'enum' : this.field.type;
    const vendorMapping: IVendorMapping = {
      vendorPath: `${this.fieldParentKey}.${this.fieldKey}`,
      vendorFieldType: vendorFieldType,
      staticValue: questionObj.target.value,
      staticArrayIndex: null,
      formFieldKey: null,
      formFieldLabel: null,
    };
    this.vendorMapping = vendorMapping;
    if (this.validateField(null)) {
      this.vendorIntegrationMappingService.addMapping(
        vendorMapping,
        this.integrationMapping
      );
      this.isHardCode = !this.isHardCode;
    } else {
      this.vendorMapping = null;
      this.value = null;
    }
  }

  onDropVendorField() {
    if (this.data && this.formTreeIsDragging) {
      console.log(this.data);
      const xiloField = this.data.field;
      if (!this.validateField(xiloField)) return;
      this.value = xiloField.templateOptions.label;
      const vendorFieldType = this.field.enum ? 'enum' : this.field.type;
      this.highlighted = false;

      const vendorMapping = {
        vendorPath: `${this.fieldParentKey}.${this.fieldKey}`,
        vendorFieldType: vendorFieldType,
        staticValue: null,
        staticArrayIndex: null,
        formFieldKey: xiloField.key,
        formFieldLabel: this.value,
      };

      this.vendorMapping = vendorMapping;

      this.vendorIntegrationMappingService.addMapping(
        vendorMapping,
        this.integrationMapping
      );
      // this.formFields[index] = { ...this.formFields[index], ...this.data };
      // this.updateFormField.emit({ field: this.formFields[index], index });
      this.data = null;
      this.formBuilderService.changeFormFieldData(null);
    }
  }

  onDragOver() {
    if (this.data && this.formTreeIsDragging) {
      this.highlighted = true;
    }
  }

  onDragLeave() {
    if (this.data && this.formTreeIsDragging) {
      this.highlighted = false;
    }
  }

  onMouseUp(index, name) {
    if (this.data && this.formTreeIsDragging) {
      console.log(this.data);
      if (this.data) {
        // this.formFields[index] = { ...this.formFields[index], ...this.data };
        // this.updateFormField.emit({ field: this.formFields[index], index });
        // this.data = null;
      }
    }
  }

  removeItem() {
    this.value = null;

    this.vendorIntegrationMappingService.removeMapping(
      this.vendorMapping,
      this.integrationMapping
    );
    this.vendorMapping = null;
  }

  displayFn(obj?: any): string | undefined {
    return obj ? obj.label : undefined;
  }

  setIntegrationFields(event: any) {
    this.integrationSearchValue = '';
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.settingsMenuPosition.x = '40%';
    this.settingsMenuPosition.y = '40%';
    this.trigger.menu.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  validateField(xiloField) {
    if (this.field.enum) {
      if (
        xiloField &&
        !(xiloField.type === 'radio' || xiloField.type === 'select')
      ) {
        this.error = 'This field must be a select menu or radio';
        this.hasError = true;
        return false;
      } else if (xiloField) {
        const options = xiloField.templateOptions.options;
        const values = options.map((opt) => opt.value);
        let hasMisMatch = false;
        const misMatchedValues = [];
        for (let value of values) {
          if (!this.field.enum.includes(value)) {
            const valueIsInEnums = isMatch(value, this.field.enum, 0.75);
            if (valueIsInEnums.status !== true) {
              hasMisMatch = true;
              misMatchedValues.push(value);
            }
          }
        }
        if (hasMisMatch) {
          this.error = `Options ${misMatchedValues.join(', ')} are not valid for this field`;
          this.hasError = true;
          return false;
        }
      } else if (this.hasHardCodedValue()) {
        if (!this.field.enum.includes(this.vendorMapping.staticValue)) {
          const valueIsInEnums = isMatch(
            this.vendorMapping.staticValue,
            this.field.enum,
            0.75
          );
          if (valueIsInEnums.status !== true) {
            this.error = `Option ${this.vendorMapping.staticValue} is not valid for this field`;
            this.hasError = true;
            return false;
          }
        }
      }
    }
    if (this.field.type === 'integer') {
      if (xiloField) {
        if (xiloField.type === 'input') {
          if (xiloField.templateOptions.type !== 'number') {
            this.error =
              'This field must be a number field and not a text field';
            this.hasError = true;
            return false;
          }
          if (this.field.minimum || this.field.maximum) {
            if (this.field.maximum !== xiloField.templateOptions.max) {
              this.warning = `This field has a maximum of ${this.field.maximum}. We suggest adding this to your form field`;
              this.hasWarning = true;
            } else if (this.field.minimum !== xiloField.templateOptions.min) {
              this.warning = `This field has a minimum of ${this.field.minimum}. We suggest adding this to your form field`;
              this.hasWarning = true;
            }
          }
        } else {
          this.error = 'This field must be a number field';
          this.hasError = true;
          return false;
        }
      } else if (
        (this.field.minimum || this.field.maximum) &&
        this.hasHardCodedValue()
      ) {
        if (this.field.maximum < +this.value) {
          this.error = `This field has a maximum of ${this.field.maximum}. Your number is too large`;
          this.hasError = true;
        } else if (this.field.minimum > +this.value) {
          this.error = `This field has a minimum of ${this.field.minimum}. Your number is too small`;
          this.hasError = true;
        }
      }
    }
    if (this.field.type === 'string') {
      if (xiloField) {
        if (this.field.minLength || this.field.maxLength) {
          if (this.field.maxLength !== xiloField.templateOptions.max) {
            this.warning = `This field has a maximum length of ${this.field.maxLength}. We suggest adding this to your form field`;
            this.hasWarning = true;
          } else if (this.field.minLength !== xiloField.templateOptions.min) {
            this.warning = `This field has a minimum length of ${this.field.minLength}. We suggest adding this to your form field`;
            this.hasWarning = true;
          }
        }
      } else if (
        (this.field.minLength || this.field.maxLength) &&
        this.hasHardCodedValue()
      ) {
        if (this.field.maxLength < this.value.length) {
          this.error = `This field has a max length of ${this.field.maxLength}. Your text is too long`;
          this.hasError = true;
        } else if (this.field.minLength > this.value.length) {
          this.error = `This field has a min length of ${this.field.minLength}. Your text is too short`;
          this.hasError = true;
        }
      }
    }
    if (this.field.type === 'date') {
      if (
        !(
          xiloField.templateOptions && xiloField.templateOptions.type === 'date'
        )
      ) {
        this.error = 'This field must be a date type';
        this.hasError = true;
        return false;
      } else if (
        (this.field.minLength || this.field.maxLength) &&
        this.hasHardCodedValue()
      ) {
        if (this.field.maxLength < this.value.length) {
          this.warning = `This field has a max length of ${this.field.maxLength}. Your text is too long`;
          this.hasWarning = true;
        } else if (this.field.minLength > this.value.length) {
          this.warning = `This field has a min length of ${this.field.minLength}. Your text is too short`;
          this.hasWarning = true;
        }
      }
    }
    if (this.field.subType) {
      const dataKeysList = [
        { value: 'occupation', display: 'Occupation' },
        { value: 'industry', display: 'Industry' },
        { value: 'vehicleYear', display: 'Vehicle Year' },
        { value: 'vehicleMake', display: 'Vehicle Make' },
        { value: 'vehicleModel', display: 'Vehicle Model' },
        { value: 'vehicleBodyStyle', display: 'Vehicle Body Style' },
        { value: 'vin', display: 'VIN' },
      ];
      for (let obj of dataKeysList) {
        if (
          this.field.subType === obj.value &&
          !this.hasDataKeyAndParam(xiloField, obj.value)
        ) {
          this.error = `This field must be an ${obj.display} field`;
          this.hasError = true;
          return false;
        }
      }
    }
    return true;
  }

  hasDataKeyAndParam(xiloField: any, param: string) {
    return (
      xiloField &&
      xiloField.templateOptions &&
      xiloField.templateOptions.dataKey &&
      xiloField.templateOptions.dataKey === param
    );
  }

  hasHardCodedValue() {
    return this.vendorMapping && this.vendorMapping.staticValue;
  }

  removeTransformation() {
    if (confirm('Are you sure you want to delete this?')) {
      this.showSettingsMenu = false;
    }
  }

  returnType() {
    if (this.field.enum) {
      return 'Select options'
    } else {
      return this.field.type;
    }
  }

  saveSettings() {
    if (confirm('Are you sure you want to save these changes?')) {
      this.showSettingsMenu = false;
    }
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(VendorFieldsSettingsDialogComponent, {
      width: '60rem',
      panelClass: 'dialog',
      data: {
        vendorMapping: this.vendorMapping
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.vendorMapping = result;
      }
    });
  }

  openConditionalValueDialog() {
    const dialogRef = this.dialog.open(ConditionalValueDialogComponent, {
      width: '60rem',
      panelClass: 'dialog',
      data: {
        vendorMapping: this.vendorMapping,
        options: this.field.enum,
        formFields: this.formFields
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.vendorMapping = result;
      }
    });
  }
}
