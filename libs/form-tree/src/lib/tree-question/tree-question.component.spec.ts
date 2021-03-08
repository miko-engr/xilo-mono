import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeQuestionComponent } from './tree-question.component';

describe('TreeQuestionComponent', () => {
  let component: TreeQuestionComponent;
  let fixture: ComponentFixture<TreeQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
