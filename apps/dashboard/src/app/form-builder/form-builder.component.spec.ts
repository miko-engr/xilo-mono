import { TestBed, async } from '@angular/core/testing';
import { FormBuilderMainComponent } from './form-builder.component';

describe.skip('FormBuilderMainComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormBuilderMainComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormBuilderMainComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should render title', () => {
    const fixture = TestBed.createComponent(FormBuilderMainComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to builder-ui-ng!'
    );
  });
});
