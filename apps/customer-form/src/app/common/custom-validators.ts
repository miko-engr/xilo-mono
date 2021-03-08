import { ValidatorFn, AbstractControl } from '@angular/forms';
import { parseAddress } from 'parse-address';

export function InputTrimValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value &&
      isString(control.value) &&
      control.value.trim() === ''
      ? { required: true }
      : null;
  };
}
export function AddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return
      control.value &&
      isString(control.value) &&
      parseAddress(control.value) &&
      parseAddress(control.value).number &&
      parseAddress(control.value).street &&
      parseAddress(control.value).city &&
      parseAddress(control.value).state &&
      parseAddress(control.value).zip
      ? null
      : { required: true };
  };
}
function isString(text) {
  return typeof text === 'string';
}
