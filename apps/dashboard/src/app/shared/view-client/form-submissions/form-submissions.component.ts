import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { SubmissionService } from '@xilo-mono/form-contracts';
import { VendorIntegrationMappingService } from '../../../form-builder/form/integrations-manager/services/vendorIntegrationMapping.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-submissions',
  templateUrl: './form-submissions.component.html',
  styleUrls: [
    '../view-client.component.css',
    './form-submissions.component.scss',
  ],
})
export class FormSubmissionsComponent implements OnInit {
  formView: any;
  clientId: string;
  loading = true;
  submissions: any = [];
  activeSubmissionIndex = 0;

  parsedSubmissions = [];
  xmlOutput: string;

  public get isIntakeForm() {
    return this.formView?.components[0].type === 'intake-form';
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
    private companyService: CompanyService,
    private submissionService: SubmissionService,
    private integrationMapperService: VendorIntegrationMappingService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.getRoute();
  }

  setSubmissionActive(index) {
    this.activeSubmissionIndex = index;
  }

  isSubmissionActive(index) {
    return index === this.activeSubmissionIndex;
  }

  // TODO: move to service
  formatFormSubmissionForDisplay(submission) {
    const responses = Array.isArray(submission.responses)
      ? submission.responses[0]
      : submission.responses;
    const sections = this.formView.components[0].fieldGroup.map((component) => {
      if (component.fieldGroup) {
        const questions = [];

        component.fieldGroup.forEach((field) => {
          if (this.isIntakeForm) {
            const questionText =
              field.templateOptions.text || field.templateOptions.label;

            const answerKey = field.key;
            const answerText =
              responses[component.key][answerKey] || ' - ';

            questions.push({
              questionText,
              answerText,
            });
          } else {
            const questionGroupKey = field.key;
            field.fieldGroup.forEach((question) => {
              const questionText =
                question.templateOptions.text || question.templateOptions.label;
              const answerKey = question.key;
              const answerText =
                responses[component.key][questionGroupKey][
                  answerKey
                ] || '-';
            });
          }
        });

        return {
          title: component.templateOptions.label,
          questions,
        };
      } else if (component.fieldArray) {
        const questionGroups = [];
        const fieldGroup = component.fieldArray.fieldGroup;
        responses[component.key].forEach(
          (responseQuestionGroup, responseQuestionGroupIndex) => {
            const questionGroup = [];
            const questions = [];
            fieldGroup.forEach((field) => {
              if (this.isIntakeForm) {
                const questionText =
                  field.templateOptions.text || field.templateOptions.label;
                const answerKey = field.key;
                const answerText =
                  responses[component.key][
                    responseQuestionGroupIndex
                  ][answerKey] || ' - ';
                const question = {
                  questionText,
                  answerText,
                };
                questions.push(question);
              } else {
                const questionGroupKey = field.key;
                field.fieldGroup.forEach((customerField) => {
                  const questionText =
                    customerField.templateOptions.text ||
                    customerField.templateOptions.label;
                  const answerKey = customerField.key;
                  const answerText =
                    responses[component.key][
                      responseQuestionGroupIndex
                    ][questionGroupKey][answerKey] || ' - ';
                  const question = {
                    questionText,
                    answerText,
                  };
                  questions.push(question);
                });
              }
            });

            questionGroup.push(questions);
            questionGroups.push(questionGroup);
          }
        );

        return {
          title: component.templateOptions.label,
          questionGroups,
          isMultiple: true,
          selectedQuestionGroupIndex: 0,
        };
      }
    });

    const parsedSubmission = {
      formTitle: this.formView.title,
      sections,
    };

    this.parsedSubmissions.push(parsedSubmission);
  }

  sendSubmission() {
    // TODO Add Vendor ID Dynamically by pulling from DB
    this.integrationMapperService
      .createSubmissionWithFormAndMapping({
        formId: this.formView.metadata.key,
        clientId: this.clientId,
      })
      .subscribe(
        (res: {
          xiloAuthUpsertEzlynxAutoResponse: {
            body: {
              url;
            };
          };
        }) => {
          console.log('Integration mapping submission response', res);
          this.alertService.success({
            html: `Submission successfully uploaded!<br><a target="_blank" href="${res.xiloAuthUpsertEzlynxAutoResponse.body.url}">${res.xiloAuthUpsertEzlynxAutoResponse.body.url}</a>`,
          });
        }
      );
  }

  getRoute() {
    // TODO: there should be a better way to get the clientId without parsing the URL
    const url = this.router.url;
    const urlArray = url.split('/');
    const urlDirect = urlArray[1];
    if (urlDirect === 'profile') {
      this.clientId = urlArray[4];
      this.submissionService.getFormAndSubmissionById(this.clientId).subscribe(
        (response) => {
          this.loading = false;
          this.submissions = response.submissions;
          this.formView = response.formView;
          // TODO: look into multiple submissions
          this.formatFormSubmissionForDisplay(this.submissions[0]);
        },
        (error) => {
          this.loading = false;
          this.logService.console(error);
        }
      );
    }
  }
}
