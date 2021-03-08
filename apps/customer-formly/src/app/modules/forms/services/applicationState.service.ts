import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AutocompleteAddressTriggerEvent,
  FormError
} from '../components/page/page.interface';
import { Answer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {

  answers: Answer[] = [];

  addressAutocompleteSource = new BehaviorSubject<
    AutocompleteAddressTriggerEvent
  >(null);
  addressAutocomplete = this.addressAutocompleteSource.asObservable();

  formErrorsSource = new BehaviorSubject<FormError>(null);

  constructor() {}

  setAnswers(answers: Answer[]) {
    this.answers = answers;
  }

  getAnswers() {
    return this.answers;
  }

}
