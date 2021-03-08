import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Answer } from '../../models';
import { FormGroup } from '@angular/forms';
import { ApplicationStateService } from '../../services';

@Component({
  selector: 'app-question-textbox',
  templateUrl: './question-textbox.component.html',
  styleUrls: ['./question-textbox.component.scss'],
})
export class QuestionTextboxComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Input() isInvalid: boolean;
  options = {
    componentRestrictions: {
      country: ['US'],
    },
  };
  @Input() errorMessage: string;

  @Output() triggerGetVehicleByVIN = new EventEmitter<{
    vehicleVin: string;
    clicked: boolean;
  }>();
  vehicleVin: string;

  @Output() triggerSearchByAddress = new EventEmitter<{
    answer: Answer;
    addressObj: any;
  }>();

  constructor(private applicationService: ApplicationStateService) {}

  ngOnInit(): void {
    if (this.properties.isVehicleVIN && this.properties.id) {
      this.currentForm
        .get([this.properties.id])
        .valueChanges.subscribe((value) => {
          this.handleVinChange(value);
        });
    }
  }
  handleAddressChange(address: any) {
    this.currentForm.patchValue({
      [this.properties.id]: address.formatted_address,
    });
    this.triggerSearchByAddress.emit({
      answer: this.properties,
      addressObj: address,
    });
  }
  triggerSearchByVin() {
    if (this.vehicleVin) {
      this.triggerGetVehicleByVIN.emit({
        vehicleVin: this.vehicleVin,
        clicked: true,
      });
    }
  }
  handleVinChange(value) {
    if (value) {
      this.vehicleVin = value;
      this.triggerGetVehicleByVIN.emit({ vehicleVin: value, clicked: false });
    } else {
      this.applicationService.formErrorsSource.next(null);
    }
  }
  getError() {
    return this.currentForm.get(this.properties.answerId).errors &&
      this.currentForm.get(this.properties.answerId).errors.pattern
      ? this.properties.isEmail
        ? 'Please enter a valid email address'
        : 'Invalid pattern'
      : this.properties.errorText;
  }
}
