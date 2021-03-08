import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Answer } from '../../models';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-question-date-field',
  templateUrl: './question-date-field.component.html',
  styleUrls: ['./question-date-field.component.scss']
})
export class QuestionDateFieldComponent implements OnInit {
  @Input() properties: Answer;
  @Input() currentForm: FormGroup;
  @Input() isInvalid: FormGroup;
  public min;
  public max;
  owlDateValue;
  constructor(private datePipe: DatePipe, private zone: NgZone) {}

  ngOnInit(): void {
    const { isRestrictDate, dateNumber, dateType } = this.properties
    if (isRestrictDate && dateNumber && dateType !== 'null') {
      let units: moment.unitOfTime.DurationConstructor = dateType;
      this.max = moment().add(dateNumber, units).toDate()
      this.min = new Date()
    }
    this.currentForm
      .get(this.properties.answerId)
      .valueChanges.subscribe(value => {
        this.owlDateValue = value;
      });
    this.zone.run(z => {
      setTimeout(() => {
        const v = this.currentForm.get(this.properties.answerId).value;
        this.owlDateValue = v;
      }, 100);
    });
  }

  handleDateChange(value) {
    value = new Date(value);
    if (value instanceof Date && !isNaN(value.getTime())) {
      const date = this.datePipe.transform(value, 'MM/dd/yyyy');
      this.currentForm.get(this.properties.answerId).setValue(date);
    } else {
      this.currentForm.get(this.properties.answerId).markAsTouched();
      this.currentForm
        .get(this.properties.answerId)
        .setErrors({ invalid: true });
    }
  }
}
