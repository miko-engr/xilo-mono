import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlookVerifyComponent } from './outlook-verify.component';

describe.skip('OutlookVerifyComponent', () => {
  let component: OutlookVerifyComponent;
  let fixture: ComponentFixture<OutlookVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlookVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlookVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
