import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getValueofPropertyKeyFromForm } from '../components/page/page-helper-functions';
@Pipe({
  name: 'valueInterpolate'
})
export class ValueInterpolatePipe implements PipeTransform {
  transform(
    currentText: string,
    mainForm: FormGroup,
    subindex: number
  ): string {
    const matchedKeys = currentText.match(/(#(.*?)#)/g) || [];
    const keys = matchedKeys.map(key => key.toString().replace(/#/g, ''));
    keys.forEach(key => {
      const v = getValueofPropertyKeyFromForm(
        { answerId: key },
        mainForm,
        subindex
      );
      console.log(key, v);
      const regex = new RegExp(`#${key}#`, 'g');
      if (v) {
        currentText = currentText.replace(regex, v);
      }
    });

    return currentText;
  }
}
