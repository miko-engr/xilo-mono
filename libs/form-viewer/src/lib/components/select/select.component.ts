import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { VehicleListService } from '@xilo-mono/form-contracts';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { Subscription } from 'rxjs/internal/Subscription';
import { getIndustries, findOccupations } from '../../common/industry.util';

@Component({
  selector: 'xilo-mono-form-viewer-select',
  templateUrl: './select.component.html',
  styleUrls: ['../../form-viewer.component.scss']
})

export class CustomSelectComponent extends FieldType implements OnInit {
  isInvalid = false;
  errorMessage = false;
  vehicleSubscription: Subscription;
  industrySubscription: Subscription;
  bodyStyles = [];

  constructor(
    private vehicleListService: VehicleListService
  ) {
    super();
  }

  ngOnInit() {
    this.setupField();
  }

  setupField() {
    if (this.to.dataKey === 'vehicleYear') {
      const oneYearFromNow = new Date().getFullYear() + 1;
      const opts = [];
      for (let i = oneYearFromNow;i>1949;i--) {
        opts.push({label: i, value: i});
      }
      this.to.options = opts;
    } else if (this.to.dataKey === 'vehicleMake') {
      const vehicleYearField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleYear';
      });
      if (vehicleYearField) {
        const vyf = vehicleYearField.formControl;
        this.vehicleSubscription = vyf.valueChanges.pipe(
          startWith(vyf.value),
          map(val => {
            if (val) {
              this.vehicleListService.getEZMakes(val)
              .pipe(
                map(opts => {
                  return opts.map(opt => ({ label: opt.trim(), value: opt.trim() }))
                })
              )
              .subscribe(opts => this.to.options = opts, 
              error => console.log(error));
            }
          })
        ).subscribe();
      }
    } else if (this.to.dataKey === 'vehicleModel') {
      const vehicleYearField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleYear';
      });
      const vehicleMakeField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleMake';
      });
      if (vehicleMakeField && vehicleYearField) {
        const vmf = vehicleMakeField.formControl;
        this.vehicleSubscription = vmf.valueChanges.pipe(
          startWith(vmf.value),
          map(val => {
            if (val) {
              this.vehicleListService.getEZModels(vehicleYearField.formControl.value, val)
              .pipe(
                map(opts => {
                  return opts.map(opt => ({ label: opt.trim(), value: opt.trim() }))
                })
              )
              .subscribe(opts => this.to.options = opts, 
              error => console.log(error));
            }
          })
        ).subscribe();
      }
    } else if (this.to.dataKey === 'vehicleBodyStyle') {
      const vehicleYearField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleYear';
      });
      const vehicleMakeField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleMake';
      });
      const vehicleModelField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleModel';
      });
      const vehicleBodyStyleField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vehicleBodyStyle';
      });
      const vinField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'vin';
      });
      if (vehicleMakeField && vehicleYearField && vehicleModelField) {
        const vmof = vehicleModelField.formControl;
        this.vehicleSubscription = vmof.valueChanges.pipe(
          startWith(vmof.value),
          map(val => {
            if (val) {
              this.vehicleListService.getEZSubModels(
                vehicleYearField.formControl.value, 
                vehicleMakeField.formControl.value, 
                val
              )
              .pipe(
                map(opts => {
                  this.bodyStyles = opts;
                  return opts.map(opt => ({ label: opt.split('|')[0].trim(), value: opt.split('|')[0].trim() }))
                })
              )
              .subscribe(opts => this.to.options = opts, 
              error => console.log(error));
            }
          })
        ).subscribe();
        if (vinField && vehicleBodyStyleField) {
          const vinF = vinField.formControl;
          const vbsF = vehicleBodyStyleField.formControl;
          vbsF.valueChanges.pipe(
            startWith(vbsF.value),
            map(val => {
              if (val) {
                const vinBodyStyle = this.bodyStyles.find(bs => {
                  return bs.includes(val);
                });

                if (vinBodyStyle && !vinF.value) {
                  const suggestedVin = vinBodyStyle ? vinBodyStyle.split('|')[1].trim() : null;
                  vinF.patchValue(suggestedVin);
                }
                
              }
            })
          ).subscribe();
        }
      }
    } else if (this.to.dataKey === 'industry') {
      this.to.options = getIndustries()
        .map(opt => ({label: opt, value: opt}));
      if (!this.to.options) {
      }
    } else if (this.to.dataKey === 'occupation') {
      const industryField = this.field.parent.fieldGroup.find(field => {
        return field.templateOptions.dataKey === 'industry';
      });
      if (industryField) {
        const indFieldControl = industryField.formControl;
        this.industrySubscription = indFieldControl.valueChanges.pipe(
          startWith(indFieldControl.value),
          map(val => {
            if (val) {
              this.to.options = findOccupations(val)
              .map(opt => ({label: opt, value: opt}));
            }
          })
        ).subscribe();
      }
    }
  }

  getError() {
    return 'Invalid response';
  }

  handleValueChange(value, isVinDetails) {
    this.form.patchValue({ [this.model.answerId]: value });
    this.form.get(this.model.answerId).markAsDirty();
  }

  handleDropdownPosition() {
    return 'auto';
  }
}
