import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectsSettingsComponent } from './prospects-settings.component';

describe.skip('ProspectsSettingsComponent', () => {
  let component: ProspectsSettingsComponent;
  let fixture: ComponentFixture<ProspectsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
