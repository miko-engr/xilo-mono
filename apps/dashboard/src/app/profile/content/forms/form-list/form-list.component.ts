import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DialogTemplatePicker } from '../../../../shared/dialogs/template-picker-dialog/template-picker-dialog.component';
import { Company } from '../../../../models/company.model';
import { Form } from '../../../../models/form.model';
import { Page } from '../../../../models/page.model';
import { LogService } from '../../../../services/log.service';
import { FormService } from '../../../../services/form.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { AgentService } from '../../../../services/agent.service';
import { DialogImagePicker } from '../../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';
import { UploadService } from '../../../../services/upload.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { FileService } from '../../../../services/file.service';
import { Question } from '../../../../models/question.model';
import { Answer } from '../../../../models/answer.model';
import { escapeRegExp } from '@angular/compiler/src/util';
import { AnswerPickerDialog } from '../../../../shared/dialogs/answer-picker-dialog/answer-picker-dialog.component';
import { Pdf } from '../../../../models/pdf.model';
import { PdfService } from '../../../../services/pdf.service';
import { IntegrationService } from '../../../../services/integration.service';
import { IntegrationValidatorDialogComponent } from '../../../../shared/dialogs/integration-validator/validator-dialog.component';
import { EZLynxService } from '../../../../services/ezlynx.service';
import { PLRaterService } from '../../../../services/pl-rater.service';
import { FormViewService } from '@xilo-mono/form-contracts';
import { HawksoftService } from '../../../../services/hawksoft.service';

@Component({
    selector: 'app-content-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['../../../business/business.component.css', '../form.component.css']
})
export class ContentFormsListComponent implements OnInit {
    states = [ 'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
                'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA',
                'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
                'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC',
                   'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
    company: Company;
    forms: Form[];
    companyRetrieved = false;
    formsRetrieved = false;
    addingForm = false;
    isFormSettings = false;
    editingForm = false;
    selectedForm = null;
    selectedTag = '';
    selectedAgent = null;
    newForm = new Form();
    loading = false;
    myFormData: FormData;
    disableUploadLogo = false;
    userFileUploaded = false;
    userFiles;
    user: User;
    massEdit = false;
    pdfs: Pdf[];
    infusionsoftTags: any[] = [];
    copiedObject = null;
    disableUploadBanner = false;
    bannerFile;
    thankyouPageFile;

    constructor(
        private agentService: AgentService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private integrationService: IntegrationService,
        private ezlynxService: EZLynxService,
        private fileService: FileService,
        private formService: FormService,
        private formViewService: FormViewService,
        private hawksoftService: HawksoftService,
        private logService: LogService,
        private pdfService: PdfService,
        private plRaterService: PLRaterService,
        private uploadService: UploadService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
      this.getCompany();
      this.getForms();
      this.getUser();
      this.getPdfs();
    }

    openFormSettings(form: Form) {
      this.formService.getById(form.id)
      .subscribe(returnedForm => {
        this.selectedForm = returnedForm;
        this.isFormSettings = true;
      }, error => {
        console.log(error);
      });
    }

    getPdfs() {
      this.pdfService.getByList()
          .subscribe(pdf => {
              this.pdfs = pdf['obj'];
          }, error => {
              this.logService.console(error, true);
          });
    }


    addTag(event: any) {
      if (!this.selectedForm.tags || this.selectedForm.tags.length < 1) {
          this.selectedForm.tags = [];
          this.selectedForm.tags.push(event);
      } else {
          if (this.selectedForm.tags.indexOf(event) < 0) {
              this.selectedForm.tags.push(event);
          }
      }
    }

    addAgent(agent: any) {
      if (!this.selectedForm.roundRobinAgents || this.selectedForm.roundRobinAgents.length < 1) {
          this.selectedForm.roundRobinAgents = [];
          this.selectedForm.roundRobinAgents.push(agent);
      } else {
          if (this.selectedForm.roundRobinAgents.indexOf(agent) < 0) {
              this.selectedForm.roundRobinAgents.push(agent);
          }
      }
    }

    getInfusionsoftTags() {
      if (this.company.hasInfusionsoftIntegration) {
        this.integrationService.getInfusionsoftTags(this.company.id)
        .subscribe(tags => {
          this.infusionsoftTags = tags;
        }, error => {
          this.logService.console(error);
        });
      }
    }

    hasIntegration(vendor: string) {
      let hasInt = false;
      if ((this.selectedForm && this.selectedForm.integrations) && (this.selectedForm.integrations.length > 0
        && this.selectedForm.integrations.includes(vendor))) {
          hasInt = true;
      } else if (this.company.integrations && this.company.integrations[vendor]) {
        hasInt = true;
      }
      return hasInt;
    }

    async downloadForm() {
      const fileName = this.selectedForm.title + '.json';
      const newForm: Form = this.createCopy(this.selectedForm);

      delete newForm.id;
      delete newForm.companyFormId;
      delete newForm.customHtml;

      if (newForm.pages) {
        for (let i = 0; i < newForm.pages.length; i++) {
          const page: Page = newForm.pages[i];
          delete page.id;
          delete page.companyPageId;
          delete page.formPageId;
          if (page.conditions) {
            page.conditions.forEach(cond => {
              delete cond.id;
              delete cond.pageConditionId;
            });
          }
          if (page.questions) {
            for (let j = 0; j < page.questions.length; j++) {
              const question: Question = page.questions[j];
              delete question.id;
              delete question.companyQuestionId;
              delete question.pageQuestionId;
              delete question.formQuestionId;
              if (question.questionConditions) {
                question.questionConditions.forEach(cond => {
                  delete cond.id;
                  delete cond.questionConditionId;
                });
              }
              if (question.answers) {
                for (let k = 0; k < question.answers.length; k++) {
                  const answer: Answer = question.answers[k];
                  delete answer.id;
                  delete answer.companyAnswerId;
                  delete answer.questionAnswerId;
                  delete answer.pageAnswerId;
                  delete answer.formAnswerId;
                  delete answer.question;
                  if (answer.answerConditions) {
                    answer.answerConditions.forEach(cond => {
                      delete cond.id;
                      delete cond.answerConditionId;
                    });
                  }
                }
              }
            }
          }
        }
      }

      let file = JSON.stringify(newForm);
      file = this.replaceAll(file, this.company.brandColor, '!{}');
      this.fileService.downloadFile(fileName, file, 'application/json');
    }

    replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    copyScript(form: Form) {
      const formType = form.isSimpleForm ? 'simple' : 'form';
      let val = `
      <script type="text/javascript" src="https://api.xilo.io/api/assets/v1"></script>
      <script type="text/javascript">
        x1lib.init([${this.company.companyId}, "${formType}", ${form.id}, null]);
        ${form.customHtml ? form.customHtml : ''}
      </script>
      `;
      if (form.isV2Form) {
        val = `
        <!-- XILO SCRIPT -->
        <script type="text/javascript" src="https://api.xilo.io/api/assets/forms"></script>
        <script type="text/javascript">
          x2lib.init([${this.company.companyId}, ${form.id}]);
          ${form.customHtml ? form.customHtml : ''}
        </script>
        <!-- END XILO SCRIPT -->
        `;
      }

      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.logService.success(`${formType ? formType.toUpperCase() : ''} Script Copied`);
    }

    copyLink(form: Form, type: string) {
      const formType = form.isSimpleForm ? 'simple' : 'form';
      const val = this.returnFormUrl(form, type);
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.logService.success(`${formType ? formType.toUpperCase() : ''} Link Copied`);
    }

    remove(tag: string): void {
        const index = this.selectedForm.tags.indexOf(tag);

        if (index >= 0) {
            this.selectedForm.tags.splice(index, 1);
        }
    }

    removeAgent(agent: string): void {
        const index = this.selectedForm.roundRobinAgents.indexOf(agent);

        if (index >= 0) {
            this.selectedForm.roundRobinAgents.splice(index, 1);
        }
    }

    returnAgent(agent: string) {
      const index = this.company.agents.findIndex((agentC) => +agentC.id === +agent);

      if (index >= 0) {
          return `${this.company.agents[index].firstName} ${this.company.agents[index].lastName}`;
      } else {
        return `Agent ${agent}`;
      }
    }

    addForm() {
        this.loading = true;
        const newPages: Page[] = [
          {
            title: 'Start',
            position: 0,
            isDriver: false,
            isVehicle: false,
            isHome: false,
            isOwner: false,
            routePath: 'start',
            isStartPage: true,
            isDiscountsPage: false,
            isResultsPage: false,
            companyPageId: this.company.id,
            questions: [{
              headerText: '',
              subHeaderText: '',
              position: 0,
              isRequired: true,
              companyQuestionId: this.company.id,
              answers: [{
                isInput: true,
                width: '45',
                placeholderText: '',
                isRequired: true,
                position: 0,
                companyAnswerId: this.company.id
              }]
            }]
          },
          {
            title: 'Page',
            position: 1,
            isDriver: false,
            isVehicle: false,
            isHome: false,
            isOwner: false,
            isStartPage: false,
            routePath: 'page-1',
            isDiscountsPage: false,
            isResultsPage: false,
            companyPageId: this.company.id,
            questions: [{
              headerText: '',
              subHeaderText: '',
              position: 0,
              isRequired: true,
              companyQuestionId: this.company.id,
              answers: [{
                isInput: true,
                width: '45',
                placeholderText: '',
                isRequired: true,
                position: 0,
                companyAnswerId: this.company.id
              },
              ]
            }]
          }
        ];
        this.newForm.companyFormId = this.company.id;
        this.newForm.pages = newPages;
        this.formService.post(this.newForm)
          .subscribe(form => {
            this.forms.push(form['obj']);
            this.resetEditing();
            this.logService.success('New Form Created Successfully');
            this.loading = false;
          }, error => {
            this.logService.console(error, true);
            this.loading = false;
          });
    }

    clearStates() {
        if (confirm('Are you sure you want to clear all states? You\'ll need to add at least one state for the form to works')) {
          this.updateFormStates({value: []});
        }
    }

    addAllStates() {
      if (confirm('Are you sure you want to add all states?')) {
          this.updateFormStates({value: this.states});
      }
    }

    deleteForm(i: number) {
        if (confirm('Are you sure you want to delete this form?')) {
          this.loading = true;
          this.formService.delete(this.forms[i])
            .subscribe(data => {
              this.forms.splice(i, 1);
              this.resetEditing();
              this.logService.success('Form Deleted Successfully');
              this.loading = false;
            }, error => {
              this.logService.console(error, true);
              this.loading = false;
            });
        }
    }

    createCopy(orig) {
        return JSON.parse(JSON.stringify(orig));
    }

    duplicateForm(form: Form, isTemplate: boolean) {
        if (isTemplate === true || confirm('Are you sure you want to copy this form?')) {
          this.loading = true;
          this.formService.getById(form.id)
          .subscribe(async(rForm) => {
            form = rForm;
            const clonedForm = await this.cleanObject(this.createCopy(form));
            delete clonedForm.id;

            const pagesLg = clonedForm.pages.length;
            for (let pI = 0; pI < pagesLg; pI++) {
              const page = clonedForm.pages[pI];
              delete page.id;
              delete page.formPageId;

              const questionsLg = page.questions.length;
              for (let qj = 0; qj < questionsLg; qj++) {
                const question = page.questions[qj];
                delete question.id;
                delete question.formQuestionId;
                delete question.pageQuestionId;

                const answersLg = question.answers.length;
                for (let ak = 0; ak < answersLg; ak++) {
                  const answer = question.answers[ak];
                  delete answer.id;
                  delete answer.questionAnswerId;
                  delete answer.formAnswerId;
                  delete answer.pageAnswerId;
                  delete answer.question;
                  if (answer.integrations) {
                    answer.integrations = answer.integrations.map(int => {
                      delete int.id;
                      delete int.answerIntegrationId;
                      delete int.formIntegrationId
                      return int;
                    });
                  }
                  const answerConditionsLg = answer.answerConditions ? answer.answerConditions.length : 0;
                  for (let ac = 0; ac < answerConditionsLg; ac++) {
                    const answerCondition = answer.answerConditions[ac];
                    delete answerCondition.id;
                    delete answerCondition.pageConditionId;
                    delete answerCondition.answerConditionId;
                  }
                }

                const questionConditionsLg = question.questionConditions ? question.questionConditions.length : 0;
                for (let qc = 0; qc < questionConditionsLg; qc++) {
                  const questionCondition = question.questionConditions[qc];
                  delete questionCondition.id;
                  delete questionCondition.pageConditionId;
                  delete questionCondition.questionConditionId;
                }
              }

              const conditionsLg = page.conditions ? page.conditions.length : 0;
              for (let pc = 0; pc < conditionsLg; pc++) {
                const pageCondition = page.conditions[pc];
                delete pageCondition.id;
                delete pageCondition.pageConditionId;
              }
            }
            this.formService.duplicate(clonedForm)
            .subscribe(async(newForm) => {
              this.forms.push(newForm['obj']);
              await this.updateFormComponents(newForm['obj']);
              this.addingForm = false;
              this.resetEditing();
              this.logService.success('Form Copied Successfully');
              this.getForms();
              this.loading = false;
            }, error => {
              this.logService.console(error, true);
              this.loading = false;
            });
          }, error => {
            this.logService.console(error, false);
          });


        }
    }

    duplicateFormAsV2(form: Form, isTemplate: boolean) {
        if (isTemplate === true || confirm('Are you sure you want to duplicate this form?')) {
          this.loading = true;
          this.companyService.patch({hasCronTrigger: true})
          .subscribe(data => {});
          this.formService.getById(form.id)
          .subscribe(async(rForm) => {
            
            form = rForm;
            const clonedForm = await this.cleanObject(this.createCopy(form));
            delete clonedForm.id;
            
            clonedForm.isV2Form = true;
            
            // New templ code
            function UUID() {
              return Math.floor(Math.random() * Math.floor(1000000));
            }
            const newFormTemplate = { 
              title: clonedForm.title, 
              components: [{
                type: 'form', 
                fieldGroup: []
              }],
              metadata: {},
              companyFormTemplateId: this.company.id
            };

            const sectionGroups = newFormTemplate.components[0].fieldGroup;
            const pagesLg = clonedForm.pages.length;
            for (let pI = 0; pI < pagesLg; pI++) {
              
              
              const page = clonedForm.pages[pI];

              // new template code
              const multipleList = ['drivers', 'vehicles', 'incidents'];
              function isAddMultiple(value: string) {
                return multipleList.includes(value.toLowerCase());
              }

              if (isAddMultiple(page.title)) { 
                sectionGroups.push({
                  key: UUID(),
                  type: 'repeat',
                  templateOptions: {
                    label: page.title,
                  },
                  fieldArray: {
                    type: 'section',
                    templateOptions: {
                      onAdd: (field, $event) => 'add();console.log(\'HIT\')',
                    },
                    fieldGroup: []
                  }
                });
              } else {
                sectionGroups.push({
                  key: UUID(),
                  type: 'section',
                  templateOptions: {
                    label: page.title,
                    onClick: (field, $event) => 'console.log(field)'
                  },
                  fieldGroup: []
                });
              }

              delete page.id;
              delete page.formPageId;

              const questionGroup = isAddMultiple(page.title) ? 
                sectionGroups[pI].fieldArray.fieldGroup : 
                sectionGroups[pI].fieldGroup;
              const questionsLg = page.questions.length;
              for (let qj = 0; qj < questionsLg; qj++) {
                const question = page.questions[qj];
                delete question.id;
                delete question.formQuestionId;
                delete question.pageQuestionId;

                // new template code
                questionGroup.push({
                  key: UUID(),
                  type: 'questionGroup',
                  wrappers: ['panel'],
                  templateOptions: {
                    label: question.headerText,
                    description: question.subheaderText
                  },
                  fieldGroup: []
                });

                const buttons = question.answers.filter(ans => ans.isButton);

                if (buttons && buttons.length && buttons.length > 1) {
                  for (let i=0;i<buttons.length;i++) {
                    if (i === 0) {
                      const index = question.answers.findIndex(ans => ans.id === buttons[i].id);
                      if (index > -1) {
                        const button = buttons[i];
                        button.isButton = false;
                        button.isSelect =  true;
                        button.placeholderText = 'Select Answer';
                        button.options = [button.propertyValue, buttons[1].propertyValue];
                        question.answers[index] = button;
                      }
                    } else {
                      const index = question.answers.findIndex(ans => ans.id === buttons[i].id);
                      if (index > -1) {
                        question.answers.splice(i, 1);
                      }
                    }
                  }
                }

                const cards = question.answers.filter(ans => ans.isCard);

                if (cards && cards.length && cards.length === 2) {
                  for (let i=0;i<cards.length;i++) {
                    if (i === 0) {
                      const index = question.answers.findIndex(ans => ans.id === cards[i].id);
                      if (index > -1) {
                        const card = cards[i];
                        card.isCard = false;
                        card.isMultipleSelect =  true;
                        card.hasLabeledSelectOptions =  true;
                        card.placeholderText = 'Select Answer';
                        card.labeledSelectOptions = [
                          { display: card.headerText, value: card.propertyValue },
                          { display: cards[1].headerText, value: cards[1].propertyValue },
                        ];
                        question.answers[index] = card;
                      }
                    } else {
                      const index = question.answers.findIndex(ans => ans.id === cards[i].id);
                      if (index > -1) {
                        question.answers.splice(i, 1);
                      }
                    }
                  }
                }

                const questionField = questionGroup[qj].fieldGroup;
                const answersLg = question.answers.length;
                for (let ak = (answersLg - 1); ak >= 0; ak--) {
                  const addMultipleList = [
                    {objectName: 'vehicles', prop: 'isAddVehicle'}, {objectName: 'drivers', prop: 'isAddDriver'},
                    {objectName: 'locations', prop: 'isAddLocation'},{objectName: 'homes', prop: 'isAddHome'},
                    {objectName: 'insuranceCoverages', prop: 'isAddInsuranceCoverages'}, {objectName: 'incidents', prop: 'isAddIncident'},
                    {objectName: 'recreationalVehicles', prop: 'isAddRecreationalVehicle'}, {objectName: 'policies', prop: 'isAddPolicy'}
                  ];
                  const answer = question.answers[ak];
                  if (answer.isSpacer) {
                    question.answers.splice(ak, 1);
                    ak -= 1;
                  } else if (addMultipleList.some(obj => answer[obj.prop])) {
                    const addMultipleIndex = addMultipleList.findIndex(obj => answer[obj.prop]);
                    if (addMultipleIndex > -1) {
                      // answer[addMultipleList[addMultipleIndex].prop] = false;
                      answer.objectName = addMultipleList[addMultipleIndex].objectName;
                      answer.propertyKey = 'addMultiple';
                    }
                  } else if (answer.isInput) {
                    const lowerCasePlaceholder = answer.placeholderText ? answer.placeholderText.toLowerCase() : null;
                    if (lowerCasePlaceholder && lowerCasePlaceholder.includes('phone')) {
                      answer.isPhone = true;
                      answer.isInput = false;
                    }
                  } else if (answer.isConditional || answer.isConditionParent) {
                    answer.isConditional = false;
                    answer.isConditionParent = false;
                    if (!answer.answerConditions || !answer.answerConditions.length || (answer.answerConditions.length === 0)) {
                      const newCondition = { object: answer.objectName, key: answer.conditionKey, value: answer.conditionValue, operator: '=' }
                      answer['answerConditions'] = [newCondition];
                    }
                  } else if (answer.isHiddenInput) {
                    answer.isInput = false;
                    answer.isSelect = false;
                  }
                  delete answer.id;
                  delete answer.questionAnswerId;
                  delete answer.formAnswerId;
                  delete answer.pageAnswerId;
                  delete answer.question;
                  delete answer.integrations;
                  // if (answer.integrations) {
                  //   answer.integrations = answer.integrations.map(int => {
                  //     delete int.id;
                  //     delete int.answerIntegrationId;
                  //     return int;
                  //   });
                  // }

                  // new template code

                  const type = answer.isSelect ? 'select' : 'input' ;

                  const answerTemplateOptions = { label: answer.placeholderText, placeholder: answer.placeholderText };
                  if (answer.isSelect) {
                    answerTemplateOptions['options'] = [
                      answer.options.map(opt => {
                        if (opt.value) {
                          return opt;
                        } else {
                          return { label: opt, value: opt }
                        }
                      })
                    ]
                  }

                  questionField.push({
                    key: UUID(),
                    type: type,
                    templateOptions: answerTemplateOptions
                  });

                  const answerConditionsLg = answer.answerConditions ? answer.answerConditions.length : 0;
                  for (let ac = 0; ac < answerConditionsLg; ac++) {
                    const answerCondition = answer.answerConditions[ac];
                    delete answerCondition.id;
                    delete answerCondition.pageConditionId;
                    delete answerCondition.answerConditionId;
                  }
                }

                const questionConditionsLg = question.questionConditions ? question.questionConditions.length : 0;
                for (let qc = 0; qc < questionConditionsLg; qc++) {
                  const questionCondition = question.questionConditions[qc];
                  delete questionCondition.id;
                  delete questionCondition.pageConditionId;
                  delete questionCondition.questionConditionId;
                }
              }

              const conditionsLg = page.conditions ? page.conditions.length : 0;
              for (let pc = 0; pc < conditionsLg; pc++) {
                const pageCondition = page.conditions[pc];
                delete pageCondition.id;
                delete pageCondition.pageConditionId;
              }
            }
            this.formService.duplicate(clonedForm)
            .subscribe(async(newForm) => {
              this.forms.push(newForm['obj']);
              console.log(JSON.stringify(newFormTemplate));
              newFormTemplate.metadata['formId'] = newForm['obj'].id;
              this.formViewService.create(newFormTemplate)
              .subscribe(res => {
                console.log(res);
              }, error => {
                this.logService.console(error);
              })
              await this.updateFormComponents(newForm['obj']);
              this.addingForm = false;
              this.resetEditing();
              this.logService.success('Form Copied As V2 Successfully');
              this.getForms();
              this.loading = false;
            }, error => {
              this.logService.console(error, true);
              this.loading = false;
            });
          }, error => {
            this.logService.console(error, false);
          });


        }
    }

    duplicateFormAsSimple(form: Form, isTemplate: boolean) {
        if (isTemplate === true || confirm('Are you sure you want to duplicate this form?')) {
          this.loading = true;
          this.formService.getById(form.id)
          .subscribe(async(rForm) => {
            form = rForm;
            const clonedForm = await this.cleanObject(this.createCopy(form));
            delete clonedForm.id;

            clonedForm.title = `Simple ${clonedForm.title}`;
            clonedForm.isSimpleForm = true;
            clonedForm.isEnabled = false;
            clonedForm.resultsIsEnabled = false;
            clonedForm.discountsIsEnabled = false;

            const pagesLg = clonedForm.pages.length;
            for (let pI = 0; pI < pagesLg; pI++) {
              const page = clonedForm.pages[pI];
              delete page.id;
              delete page.formPageId;

              const questionsLg = page.questions.length;
              for (let qj = 0; qj < questionsLg; qj++) {
                const question = page.questions[qj];
                delete question.id;
                delete question.formQuestionId;
                delete question.pageQuestionId;


                const buttons = question.answers.filter(ans => ans.isButton);

                if (buttons && buttons.length && buttons.length > 1) {
                  for (let i=0;i<buttons.length;i++) {
                    if (i === 0) {
                      const index = question.answers.findIndex(ans => ans.id === buttons[i].id);
                      if (index > -1) {
                        const button = buttons[i];
                        button.isButton = false;
                        button.isSelect =  true;
                        button.placeholderText = `Select ${button.propertyKey}`;
                        function returnValue(value) {
                          if (value === true || value === 'true') {
                            return 'Yes'
                          } else if (value === false || value === 'false') {
                            return 'No'
                          } else {
                            return value;
                          }
                        }
                        button.options = [returnValue(button.propertyValue), returnValue(buttons[1].propertyValue)];
                        question.answers[index] = button;
                      }
                    } else {
                      const index = question.answers.findIndex(ans => ans.id === buttons[i].id);
                      if (index > -1) {
                        question.answers.splice(i, 1);
                      }
                    }
                  }
                }

                const cards = question.answers.filter(ans => ans.isCard);

                if (cards && cards.length && cards.length === 2) {
                  for (let i=0;i<cards.length;i++) {
                    if (i === 0) {
                      const index = question.answers.findIndex(ans => ans.id === cards[i].id);
                      if (index > -1) {
                        const card = cards[i];
                        card.isCard = false;
                        card.isMultipleSelect =  true;
                        card.isSelect =  true;
                        card.placeholderText = `Select ${card.propertyKey}`;
                        card.options = [ card.propertyValue, cards[1].propertyValue ];
                        question.answers[index] = card;
                      }
                    } else {
                      const index = question.answers.findIndex(ans => ans.id === cards[i].id);
                      if (index > -1) {
                        question.answers.splice(i, 1);
                      }
                    }
                  }
                }

                const answersLg = question.answers.length;
                for (let ak = (answersLg - 1); ak >= 0; ak--) {
                  const addMultipleList = [
                    {objectName: 'vehicles', prop: 'isAddVehicle'}, {objectName: 'drivers', prop: 'isAddDriver'},
                    {objectName: 'locations', prop: 'isAddLocation'},{objectName: 'homes', prop: 'isAddHome'},
                    {objectName: 'insuranceCoverages', prop: 'isAddInsuranceCoverages'}, {objectName: 'incidents', prop: 'isAddIncident'},
                    {objectName: 'recreationalVehicles', prop: 'isAddRecreationalVehicle'}, {objectName: 'policies', prop: 'isAddPolicy'}
                  ];
                  const answer = question.answers[ak];
                  if (ak === 0 && qj === 0) {
                    if (!answer.isText) {
                      const newAnswer = { isText: true, placeholderText: page.title, width: 90, companyAnswerId: answer.companyAnswerId };
                      question.answers.unshift(newAnswer);
                    }
                  }
                  if (answer.isSpacer) {
                    question.answers.splice(ak, 1);
                    ak -= 1;
                  } else if (answer.isInput) {
                    const lowerCasePlaceholder = answer.placeholderText ? answer.placeholderText.toLowerCase() : null;
                    if (lowerCasePlaceholder && lowerCasePlaceholder.includes('phone')) {
                      answer.validationType = 'number';
                    } else if (lowerCasePlaceholder && lowerCasePlaceholder.includes('email')) {
                      answer.validationType = 'email';
                    }
                  } else if (answer.isSelect) {
                    for (let opt of answer.options) {
                      if (opt === true || opt === 'true') {
                        opt = 'Yes';
                      } else if (opt === false || opt === 'false') {
                        opt = 'No';
                      }
                    }
                  } else if (answer.isConditional || answer.isConditionParent) {
                    answer.isConditional = false;
                    answer.isConditionParent = false;
                    if (!answer.answerConditions || !answer.answerConditions.length || (answer.answerConditions.length === 0)) {
                      const newCondition = { object: answer.objectName, key: answer.conditionKey, value: answer.conditionValue, operator: '=' }
                      answer['answerConditions'] = [newCondition];
                    }
                  }

                  if (addMultipleList.some(obj => answer[obj.prop]) || answer.isText ||
                      answer.isSpacer || answer.isTextarea || answer.isSecureDocumentUpload) {
                    answer.width = '90';
                  } else {
                    answer.width = '45';
                  }

                  answer.style = 'standard';

                  delete answer.id;
                  delete answer.questionAnswerId;
                  delete answer.formAnswerId;
                  delete answer.pageAnswerId;
                  delete answer.question;
                  if (answer.integrations) {
                    answer.integrations = answer.integrations.map(int => {
                      delete int.id;
                      delete int.answerIntegrationId;
                      delete int.formIntegrationId;
                      return int;
                    });
                  }
                  const answerConditionsLg = answer.answerConditions ? answer.answerConditions.length : 0;
                  for (let ac = 0; ac < answerConditionsLg; ac++) {
                    const answerCondition = answer.answerConditions[ac];
                    delete answerCondition.id;
                    delete answerCondition.pageConditionId;
                    delete answerCondition.answerConditionId;
                  }

                  if (ak === 0) {
                    for (let ai = (question.answers.length-1); ai >= 0; ai--) {
                      const ans = question.answers[ai];
                      if (ans.isButton) {
                        const selectAnswerIndex = question.answers.findIndex(a =>
                            (a.propertyKey === ans.propertyKey && ans.objectName === a.objectName));
                        if (selectAnswerIndex > -1) {
                          const newAnsOpt = ans.propertyValue === 'true' || ans.propertyValue === true ? 'Yes' :
                                      ans.propertyValue === 'false' || ans.propertyValue === false ? 'No' : ans.propertyValue;
                          question.answers[selectAnswerIndex].options.push(newAnsOpt);
                        }
                        question.answers.splice(ai, 1);
                        ai -= 1;
                      }
                    }
                  }
                }

                const questionConditionsLg = question.questionConditions ? question.questionConditions.length : 0;
                for (let qc = 0; qc < questionConditionsLg; qc++) {
                  const questionCondition = question.questionConditions[qc];
                  delete questionCondition.id;
                  delete questionCondition.pageConditionId;
                  delete questionCondition.questionConditionId;
                }
              }

              const conditionsLg = page.conditions ? page.conditions.length : 0;
              for (let pc = 0; pc < conditionsLg; pc++) {
                const pageCondition = page.conditions[pc];
                delete pageCondition.id;
                delete pageCondition.pageConditionId;
              }
            }
            this.formService.duplicate(clonedForm)
            .subscribe(async(newForm) => {
              this.forms.push(newForm['obj']);
              await this.updateFormComponents(newForm['obj']);
              this.addingForm = false;
              this.resetEditing();
              this.logService.success('Form Copied As Simple Successfully');
              this.getForms();
              this.loading = false;
            }, error => {
              this.logService.console(error, true);
              this.loading = false;
            });
          }, error => {
            this.logService.console(error, false);
          });


        }
    }

    async updateFormComponents(form: Form) {
      try {
        this.loading = true;
        for (let i = 0; i < form.pages.length; i++) {
          const page = form.pages[i];
          page.position = i;
          if (i === 0) {
            page.isStartPage = true;
          } else {
            page.isStartPage = false;
          }
          page.companyPageId = form.companyFormId;
          page.formPageId = form.id;
          if (!page.title) {
            page.title = 'New Page';
          }
          page.routePath = page.title ? page.title.toLowerCase().replace(' ', '-') : null;
          for (let j = 0; j < page.questions.length; j++) {
            const question = page.questions[j];
            question.position = j;
            question.companyQuestionId = form.companyFormId;
            question.pageQuestionId = +page.id;
            question.formQuestionId = form.id;
            for (let k = 0; k < question.answers.length; k++) {
              const answer = question.answers[k];
              answer.position = k;
              answer.companyAnswerId = form.companyFormId;
              answer.pageAnswerId = +page.id;
              answer.questionAnswerId = +question.id;
              answer.formAnswerId = form.id;
            }
          }
        }
        const data = {
          form: form,
        };
        const results = await this.formService.bulkUpdate(data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.logService.console(error, true);
      }
    }

    getCompany() {
      this.company = new Company(null);
      this.companyService.get()
      .subscribe(company => {
          this.company = company['obj'];
          this.companyRetrieved = true;
          this.getInfusionsoftTags();
      }, error => {
          this.logService.console(error, true);
      });
    }

    getUser() {
      this.userService.get()
          .subscribe(user => {
              this.user = user['obj'];
          }, error => {
          });
    }

    getForms() {
      this.loading = true;
      this.formService.getByCompany(true)
      .subscribe(forms => {
          this.forms = forms['obj'];
          this.formsRetrieved = true;
          this.loading = false;
      }, error => {
          this.logService.console(error, true);
          this.loading = false;
      });
    }

    async openMassEditComponent(form: Form) {
      this.router.navigate([`/profile/builder/form/${form.id}`]);
    }

    openFormsDialog() {
      this.loading = true;
        this.formService.getAllTemplates()
          .subscribe(forms => {
            const dialogRef = this.dialog.open(DialogTemplatePicker, {
              width: '30rem',
              data: {templates: forms['obj']}
            });
            this.loading = false;
            dialogRef.afterClosed().subscribe(results => {
              if (results) {
                if (typeof results === 'object' && results.isCsv) {
                  this.loading = true;
                  this.formService.createFormByCSV(results.csv)
                  .subscribe(data => {
                    this.addingForm = false;
                    this.getForms();
                  }, error => {
                    this.logService.console(error, true);
                    this.loading = false;
                  });
                } else {
                  this.duplicateForm(results, true);
                }
              }
            });
          }, error => {
            this.logService.console(error, true);
            this.loading = false;
          });
    }

    resetEditing() {
        this.addingForm = false;
        this.isFormSettings = false;
        this.editingForm = false;
        this.selectedForm = null;
        this.newForm = new Form();
    }

    returnFormUrl(form: Form, type: string) {
        let url = '';
        if (environment.production) {
          url += form.isV2Form ? 'https://insurance.xilo.io/' : 'https://app.xilo.io/client-app/';
        } else {
          url += 'http://localhost:4200/' + (!form.isV2Form ? 'client-app/' : '');
        }
        if (form.isSimpleForm) {
          url += `simple/form?companyId=${this.company.companyId}`;
        } else {
          url += `form/${type}?companyId=${this.company.companyId}`;
        }
        if (type === 'mobile') {
          url += '&question=0';
        }
        if (this.user && this.user.username) {
          url += `&agent=${this.user.username}`;
        }
        url += `&formId=${form.id}`;
        return url;
    }

    routeToPages(id) {
      this.router.navigate(['profile/forms/pages', id]);
    }

    openDialog() {
      const dialogRef = this.dialog.open(DialogImagePicker, {
          width: '30rem',
          data: {
              brandColor: this.company.brandColor
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.selectedForm.icon = result;
          }
      });
    }

    openValidatorDialog(vendor: string, type: string, method?: string) {
      const dialogRef = this.dialog.open(IntegrationValidatorDialogComponent, {
          width: '30rem',
          data: {
            type: type,
            vendor: vendor,
            reportType: 'form',
            method: method,
            form: this.selectedForm,
            company: this.company
          }
      });

      dialogRef.afterClosed().subscribe(report => {
          if (report) {
            const formName = this.selectedForm.title.replace(' ', '-');
            const fileName = `${formName.toLowerCase()}-report.txt`;
            this.fileService.downloadFile(fileName, report, 'application/text');
          }
      });
  }

  setDefaults(vendor: string, type: string) {
    let setV2 = false;
    if (vendor === 'EZLYNX') {
      setV2 = true;
      this.ezlynxService.setDefaultsToForm(this.selectedForm.id, type)
      .subscribe(data => {
        this.logService.success('Defaults set succesfully');
      }, error => {
        this.logService.console(error, true);
      });
    } else if (vendor === 'PLRATER') {
      setV2 = true;
      this.plRaterService.setDefaultsToForm(this.selectedForm.id, type)
      .subscribe(data => {
        this.logService.success('Defaults set succesfully');
      }, error => {
        this.logService.console(error, true);
      });
    } else if (vendor === 'HAWKSOFT') {
      setV2 = true;
      this.hawksoftService.setDefaultsToForm(this.selectedForm.id, type)
      .subscribe(data => {
        this.logService.success('Defaults set succesfully');
      }, error => {
        this.logService.console(error, true);
      });
    }
    if (setV2 === true) {
      this.company.integrations = this.company.integrations ? 
        {...this.company.integrations, HAWKSOFT: true } : { HAWKSOFT: true };
      this.companyService.patch({id: this.company.id, hasV2Integrations: true, integrations: this.company.integrations})
      .subscribe(data => {
      }, error => {
        this.logService.console(error, false);
      });
    }
  }

  removeIntegrations () {
    this.integrationService.removeIntegrations(this.selectedForm.id)
    .subscribe(data => {
      this.logService.success(data['title'])
    }, error => {
      this.logService.console(error, false);
    });
  }

    updateForm() {
        this.loading = true;
        this.formService.patch(this.selectedForm)
          .subscribe(updatedForm => {
            this.logService.success('Form Updated Successfully');
            this.resetEditing();
            this.loading = false;
          }, error => {
            this.logService.console(error, true);
            this.loading = false;
          });
    }

    updateAgent(id: any) {
        this.loading = true;
        // tslint:disable-next-line: no-shadowed-variable
        const agentIndex = this.company.agents.findIndex(agent => +id === +agent.id);
        const agent = this.company.agents[agentIndex];
        agent.agentFormId = this.selectedForm.id;
        this.agentService.patch(agent)
          .subscribe(updatedForm => {
            this.loading = false;
          }, error => {
            this.logService.console(error, true);
            this.loading = false;
          });
    }

    updateFormStates(event) {
        this.loading = true;
        this.selectedForm.states = event.value;
        this.formService.patch(this.selectedForm)
        .subscribe(updatedForm => {
          this.loading = false;
          this.logService.success('States Updated Successfully');
        }, error => {
          this.logService.console(error, true);
          this.loading = false;
    });
    }

    postImage(files: File[], type: string, name: string) {
      this.loading = true;
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const disableButton = `disableUpload${capitalizedName}`
      this[disableButton] = true;
      this.uploadService.postImage(this.myFormData)
          .subscribe(file => {
              this.loading = false;
              this.selectedForm[name] = 'https://s3-us-west-2.amazonaws.com/rent-z/' + file['obj'].file;
              this.userFileUploaded = true;
              this[disableButton] = false;
              if (name === 'logo') this.userFiles = null;
              if (name === 'banner') this.bannerFile = null;
              if (name === 'thankyouPageLogo') this.thankyouPageFile = null;
          }, error => {
              this.loading = false;
              this[disableButton] = false;
              this.logService.console(error, true);
          });
  }

  removeImage(name: string) {
    this.selectedForm[name] = null;
  }

  async openTemlatesPickerDialog() {
    const dialogRef = this.dialog.open(AnswerPickerDialog, {
      width: '60rem',
      data: { type: 'Form' }
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result) {
          this.duplicateForm(result, true);
      }
    });
  }

  async cleanObject(obj: any) {
    const newObj = this.createCopy(obj);
    delete newObj.id;
    newObj.companyFormId = this.company.id;
    if (newObj.pages) {
      newObj.pages = newObj.pages.map(p => {
        delete p.id;
        p.companyPageId = this.company.id;
        if (p.questions) {
          p.questions = p.questions.map(q => {
            delete q.id;
            q.companyQuestionId = this.company.id;
            if (q.answers) {
              q.answers = q.answers.map(a => {
                delete a.id;
                a.companyAnswerId = this.company.id;
                if (a.answerConditions) {
                  a.answerConditions = a.answerConditions.map(cond => {
                    delete cond.id;
                    delete cond.answerConditionId;
                    cond.companyConditionId = this.company.id;
                    return cond;
                  });
                }
                if (a.integrations) {
                  a.integrations = a.integrations.map(integration => {
                    delete integration.id;
                    delete integration.formIntegrationId;
                    delete integration.answerIntegrationId;
                    return integration;
                  });
                }
                return a;
              });
            }
            if (q.questionConditions) {
              q.questionConditions = q.questionConditions.map(cond => {
                delete cond.id;
                delete cond.questionConditionId;
                cond.companyConditionId = this.company.id;
                return cond;
              });
            }
            return q;
          });
        }
        if (p.conditions) {
          p.conditions = p.conditions.map(cond => {
            delete cond.id;
            delete cond.pageConditionId;
            cond.companyConditionId = this.company.id;
            return cond;
          });
        }
        return p;
      });
    }
    return newObj;
  }


}
