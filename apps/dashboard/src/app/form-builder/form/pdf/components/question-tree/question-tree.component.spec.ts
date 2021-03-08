import { PdfQuestionTreeComponent } from './question-tree.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FormViewService } from '@xilo-mono/form-contracts';
import { dummyFormTemplateResponse} from './dummy-form-template-response'


class MockActivatedRoute {
  private innerTestParams?: any = {
    formId: '5'
  };
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testParams);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();

  constructor(params?: Params) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
  }

  get testParams() {
    return this.innerTestParams;
  }

  set testParams(params: {}) {
    this.innerTestParams = params;
    this.subject.next(params);
  }

  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }
}


describe('QuestionTreeComponent', () => {

  let component: PdfQuestionTreeComponent;
  let fixture: ComponentFixture<PdfQuestionTreeComponent>;
  let activatedRouteStub: MockActivatedRoute;
  let httpMock: HttpTestingController;

  describe('initialization', () => {

    beforeEach(async(() => {
      activatedRouteStub = new MockActivatedRoute();

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PdfQuestionTreeComponent],
        providers: [
          FormViewService,
          {
            provide: ActivatedRoute,
            useValue: { // Mock
              queryParams: of(
                {
                  formId: '5'
                }
              )
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));



    beforeEach(() => {
      fixture = TestBed.createComponent(PdfQuestionTreeComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.inject(HttpTestingController);
      const formTemplateService = TestBed.inject(FormViewService);

      spyOn(formTemplateService, 'getFormByFormId').and.returnValue(of(dummyFormTemplateResponse));
      fixture.detectChanges();
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should initialize', () => {
      activatedRouteStub.testParams = {
        formId: '5'
      };

      expect(component).toBeTruthy();
    });

    it('should set a formId from query parameter', () => {
      expect(component.formId).toEqual('5');
    })

    it('should handle form template response', () => {
      expect(component.formData.length).toEqual(6);

    });
  });

});
