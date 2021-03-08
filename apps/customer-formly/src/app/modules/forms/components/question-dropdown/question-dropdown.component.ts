import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import { Answer, Client, Driver } from '../../models';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-question-dropdown',
  templateUrl: './question-dropdown.component.html',
  styleUrls: ['./question-dropdown.component.scss']
})
export class QuestionDropdownComponent implements OnInit, OnDestroy {
  public ngUnsubscriber: Subject<any> = new Subject<void>();

  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Input() isInvalid: boolean;
  @Input() isMobile: boolean;
  @Input() client: Client;
  @Input() isLastQuestion: boolean;

  @Output() getVehicleData: EventEmitter<{
    type: string;
    value: any;
    isVinDetails: boolean;
  }> = new EventEmitter();

  @Output() getOccupationsFromIndustry: EventEmitter<
    string
  > = new EventEmitter();

  options: any[];

  constructor() {}
  ngOnInit(): void {
    this.options = [...this.properties.options];
    // gets options data by event call if vehicle details are available
    const { 
      isVehicleYear, 
      isVehicleMake, 
      isVehicleModel, 
      isSelectObject,
      selectObjectName
    } = this.properties
    if (isSelectObject) {
      if (selectObjectName === 'drivers') {
        if (this.client && this.client.drivers && this.client.drivers.length > 0) {
          this.options = this.client.drivers
          .map((driver, i) => {
            return {
              id: driver.id,
              name: this.handleDriversName(driver, i)
            }
          })
        }
      }
    }
    const value = this.currentForm.value[this.properties.id]
    if (value && (isVehicleYear || isVehicleMake || isVehicleModel)) {
      this.handleValueChange(value, true)
    }
  }

  handleDriversName(driver: Driver, index) {
    if (driver.applicantGivenName && driver.applicantSurname) {
      return `${driver.applicantGivenName} ${driver.applicantSurname}`;
    } else if (driver.applicantSurname) {
      return `${driver.applicantSurname}`;
    } else if (driver.applicantGivenName) {
      return `${driver.applicantGivenName}`;
    } else {
      return `Driver ${index} (No Name)`
    }
  }

  handleDropdownPosition() {
    if (this.isLastQuestion) {
      return 'top';
    } else {
      return 'auto';
    }
  }

  handleValueChange(value, isVinDetails) {
    if (this.properties.isSelectObject) {
      value = value.id;
    }
    let type = '';
    if (this.properties.isVehicleYear) {
      type = 'year';
    }
    if (this.properties.isVehicleMake) {
      type = 'make';
    }
    if (this.properties.isVehicleModel) {
      type = 'model';
    }
    if (type) {
      this.getVehicleData.emit({ type, value, isVinDetails });
    }
    if (this.properties.isIndustry) {
      this.getOccupationsFromIndustry.emit(value);
    }
    this.currentForm.patchValue({ [this.properties.answerId]: value });
    this.currentForm.get(this.properties.answerId).markAsDirty();
  }

  ngOnDestroy() {
    try {
      this.ngUnsubscriber.next();
      this.ngUnsubscriber.complete();
    } catch (e) {
      // console.warn('ngOnDestroy', e);
    }
  }
}
