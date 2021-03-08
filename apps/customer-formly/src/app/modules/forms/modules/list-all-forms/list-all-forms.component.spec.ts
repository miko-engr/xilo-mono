import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllFormsComponent } from './list-all-forms.component';

describe('ListAllFormsComponent', () => {
  let component: ListAllFormsComponent;
  let fixture: ComponentFixture<ListAllFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
