import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ListAllFormsModule } from '../../../../../../customer-form/src/app/modules/forms/modules/list-all-forms/list-all-forms.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ListAllFormsComponent } from '../../../../../../customer-form/src/app/modules/forms/modules/list-all-forms/list-all-forms.component';
import { MockComponent } from 'ng-mocks';
import { FormSubmissionsComponent } from './form-submissions.component';
import { NgxLoadingComponent } from 'ngx-loading';
import { LogService } from '../../../services/log.service';
import { CompanyService } from '../../../services/company.service';
import { dummyForm, dummyFormSubmission } from './dummy-form-submission-data';

class ActivatedRouteMock {
  snapshot: ActivatedRouteSnapshot;
  queryParams: any;
  params: any;

  constructor() {
    this.snapshot = new ActivatedRouteSnapshot();
  }

  sendData(data) {
    this.queryParams.next(data);
  }

}

class MockLogService {
  constructor() {
  }

  console() {
  }
}

describe('SubmissionsComponent', () => {

  let component: FormSubmissionsComponent;
  let fixture: ComponentFixture<FormSubmissionsComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        ListAllFormsModule,
        RouterTestingModule.withRoutes([{
          path: 'form/list-all-forms', component: ListAllFormsComponent
        }]),
        HttpClientTestingModule
      ],
      declarations: [
        FormSubmissionsComponent,
        MockComponent(NgxLoadingComponent)
      ],
      providers: [
        CompanyService,
        {
          provide: LogService,
          useClass: MockLogService
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubmissionsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.get(ActivatedRoute);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    fixture.detectChanges();

    jest.resetAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('methods', () => {

    describe('setSubmissionActive', () => {

      it('should set the active submission index', () => {
        component.setSubmissionActive(5);
        expect(component.activeSubmissionIndex).toEqual(5);
      });

    });

    describe('isSubmissionActive', () => {
      it('should return boolean indicating submission is active', () => {
        expect(component.isSubmissionActive(0)).toEqual(true);
        expect(component.isSubmissionActive(1)).toEqual(false);
      });

    });

    describe('getRoute', () => {
      it('should parse url for client id', () => {
        jest.spyOn(router, 'url', 'get').mockReturnValue('localhost/profile/prospects/view/1234/submissions');
        component.getRoute();

        expect(component.clientId).toEqual('1234');
      });

    });

    describe('formatFormSubmissionForDisplay', () => {
      it('should create a display object that is formatted for display', () => {

        const result = component.formatFormSubmissionForDisplay(dummyForm, dummyFormSubmission);

        expect(result.formTitle).toEqual('Auto Form');
        expect(result.sections[0]).toEqual({
          title: 'Insured',
          questions: [{
            questionText: 'Are you a current client?',
            answerText: 'Yes'
          }]
        });

        expect(result.sections[1]).toEqual({
          title: 'Drivers',
          isMultiple: true,
          selectedQuestionGroupIndex: 0,
          questionGroups: [
            [{
              questionText: 'First Name',
              answerText: 'Steven'
            }, {
              questionText: 'Last Name',
              answerText: 'Senkus'
            }, {
              questionText: 'What is their marital status?',
              answerText: 'Married'
            }],
            [{
              questionText: 'First Name',
              answerText: 'Jon'
            }, {
              questionText: 'Last Name',
              answerText: 'Corrin'
            }, {
              questionText: 'What is their marital status?',
              answerText: 'Single'
            }]]
        });
      });
    });


  });
});
