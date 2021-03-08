import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'xilo-mono-form-viewer-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

export class CustomRadioComponent extends FieldType implements OnInit {
  isInvalid = false;
  errorMessage = false;

  ngOnInit() {

  }
}
