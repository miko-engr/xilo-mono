import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmitedComponent } from './form-submited.component';

describe('FormSubmitedComponent', () => {
  let component: FormSubmitedComponent;
  let fixture: ComponentFixture<FormSubmitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSubmitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubmitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
