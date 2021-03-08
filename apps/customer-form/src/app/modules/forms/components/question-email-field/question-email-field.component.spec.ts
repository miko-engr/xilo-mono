import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEmailFieldComponent } from './question-email-field.component';

describe('QuestionEmailFieldComponent', () => {
  let component: QuestionEmailFieldComponent;
  let fixture: ComponentFixture<QuestionEmailFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEmailFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEmailFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
