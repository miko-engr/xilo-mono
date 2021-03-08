import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfMapperComponent } from './pdf-mapper.component';

describe('PdfMapperComponent', () => {
  let component: PdfMapperComponent;
  let fixture: ComponentFixture<PdfMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfMapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
