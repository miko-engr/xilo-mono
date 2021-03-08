import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupHeaderComponent } from './signup-header.component';

describe.skip('SignupHeaderComponent', () => {
  let component: SignupHeaderComponent;
  let fixture: ComponentFixture<SignupHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
