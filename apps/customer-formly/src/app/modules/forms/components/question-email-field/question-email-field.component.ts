import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-email-field',
  templateUrl: './question-email-field.component.html',
  styleUrls: ['./question-email-field.component.scss']
})
export class QuestionEmailFieldComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  emailChanged(event) {
    // var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!reg.test(event)) {
    //   return;
    // }
  }
}
