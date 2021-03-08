import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPhoneNumberFieldComponent } from './question-phone-number-field.component';

describe('QuestionPhoneNumberFieldComponent', () => {
  let component: QuestionPhoneNumberFieldComponent;
  let fixture: ComponentFixture<QuestionPhoneNumberFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPhoneNumberFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPhoneNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
