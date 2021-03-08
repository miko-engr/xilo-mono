import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionAddFileComponent } from './question-add-file.component';

describe('MultipleAddComponent', () => {
  let component: QuestionAddFileComponent;
  let fixture: ComponentFixture<QuestionAddFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAddFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAddFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
