import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfBuilderComponent } from './pdf-builder.component';
import { SharedModule } from '../../../../shared/shared.module';

describe.skip('PdfBuilderComponent', () => {
  let component: PdfBuilderComponent;
  let fixture: ComponentFixture<PdfBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [ PdfBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
