import {Component, OnInit} from '@angular/core';
import {CompanyService} from '../../../services/company.service';
import {LogService} from '../../../services/log.service';
import {Company} from '../../../models/company.model';
import {Coverage} from '../../../models/coverage.model';
import {Parameter} from '../../../models/parameter.model';
import {ParameterService} from '../../../services/parameter.service';
import {AlertControllerService} from '../../../services/alert.service';
import {Form} from '../../../models/form.model';
import {FormService} from '../../../services/form.service';
import {moveItemInArray, CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {DialogTemplatePicker} from '../../../shared/dialogs/template-picker-dialog/template-picker-dialog.component';
import {DialogImagePicker} from '../../../shared/dialogs/image-picker-dialog/image-picker-dialog.component';
import {Answer} from '../../../models/answer.model';
import {DynamicRaterService} from '../../../services/dynamic-rater.service';
import {DynamicRater} from '../../../models/dynamic-rater.model';
import {environment} from '../../../../environments/environment';
import {DynamicRate} from '../../../models/dynamic-rate.model';
import {Page} from '../../../models/page.model';
import {Question} from '../../../models/question.model';
import {DynamicRateCondition} from '../../../models/dynamic-rate-condition.model';
import {DynamicRateConditionService} from '../../../services/dynamic-rate-condition.service';
import {DynamicRateService} from '../../../services/dynamic-rate.service';
import {DynamicCoverage} from '../../../models/dynamic-coverage.model';
import {DynamicCoverageSpec} from '../../../models/dynamic-coverage-spec.model';
import {DynamicCoverageService} from '../../../services/dynamic-coverage.service';


@Component({
  selector: 'app-content-rater',
  templateUrl: './rater.component.html',
  styleUrls: ['./rater.component.css']
})
export class ContentRaterComponent implements OnInit {

  answers: Answer[] = [];
  answersRetrieved = false;
  company = new Company(null);
  companyRetrieved = false;
  formsRetrieved = false;
  loading = false;

  raters: DynamicRater[] = [];

  ratersRetrieved = false;

  coverages: Coverage[] = [];

  forms: Form[] = [];
  raterForms: Form[] = [];
  formRates: DynamicRate[] = [];
  formRate = new DynamicRater(null, null, null, null, null);

  parameters: Parameter[] = [];

  edit = [];

  isRater = true;
  isForm = false;
  isDynamicRate = false;
  isCoverage = false;
  isParameter = false;

  addingRater = false;
  addingForm = false;
  addingCondition = false;
  addingSpec = false;
  addingCoverage = false;

  hasAutoRater = false;
  hasHomeRater = false;

  showDetails = true;


  editingRater = false;
  editingCoverage = false;
  editingSpec = false;
  editingParameter = false;

  newRater = new DynamicRater(null, null, null, null);
  newForm = new Form(null, null, null, null);
  newFormRate = new DynamicRate(null, null, null, null);
  newCondition = new DynamicRateCondition(null, null, null, null);
  newCoverage = new DynamicCoverage(null, null, null, null, null, [], null, null, null);
  newSpec = new DynamicCoverageSpec(null, null, null);

  editingCoveragePosition = false;

  selectedIndex = 0;
  selectedRater = new DynamicRater(null, null, null, null);
  selectedCoverage = new DynamicCoverage(null, null, null, null, null, null, null, null, null);
  selectedSpec = new DynamicCoverageSpec(null, null, null);
  selectedParameter = new Parameter(null, null, false, false, null, null, null);
  selectedForm = new Form(null);
  selectedPage = new Page(null);
  selectedQuestion = new Question(null);
  selectedOption = null;
  selectedOptionIndex = null;

  raterIndex = 0;
  conditionIndex = null;
  formRaterIndex = 0;
  coverageIndex = 0;
  specIndex = 0;
  parameterIndex = 0;

  pageTitle = 'settings';

  states = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];

  constructor(
    private alertService: AlertControllerService,
    private companyService: CompanyService,
    public dialog: MatDialog,
    private conditionService: DynamicRateConditionService,
    private raterService: DynamicRaterService,
    private dynamicRateService: DynamicRateService,
    private logService: LogService,
    private dynamicCoverageService: DynamicCoverageService,
    private formService: FormService,
    private parameterService: ParameterService
  ) {
  }

  ngOnInit() {
    this.getCompany();
    this.getRaters();
    this.getForms();
  }

  addCondition(condition: DynamicRateCondition, question: Question) {
    condition.companyDynamicRateConditionId = this.company.id;
    condition.questionDynamicRateConditionId = +question.id;
    this.conditionService.post(condition)
      .subscribe(updatedCondition => {
        question.conditions.push(updatedCondition['obj']);
        this.alertService.success('New Condition Added Successfully');
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  deleteCondition(condition: DynamicRateCondition, question: Question, i) {
    if (confirm('Are you sure you want to delete this condition?')) {
      this.conditionService.delete(condition)
        .subscribe(data => {
          question.conditions.splice(i, 1);
          this.alertService.success('Condition Deleted Successfully');
          this.onResetEditing();
        }, error => {
          this.logService.console(error, true);
        });
    }
  }

  addForm(form: Form) {
    const rater = this.raters[this.raterIndex];
    const formRate = new DynamicRate(null);
    formRate.companyDynamicRateId = this.company.id;
    formRate.formDynamicRateId = form.id;
    form.dynamicRaterFormId = rater.id;
    form.hasDRates = true;
    this.dynamicRateService.post(formRate)
      .subscribe(newRate => {
        this.formRates.push(newRate['obj']);
        this.formService.patch(form)
          .subscribe(updatedForm => {
            const newCov = new DynamicCoverage(null);
            newCov.title = 'Average Coverage';
            newCov.position = 0;
            newCov.premiumIncrease = 0;
            newCov.companyDynamicCoverageId = this.company.id;
            newCov.dynamicRateDynamicCoverageId = newRate['obj'].id;
            this.dynamicCoverageService.post(newCov)
              .subscribe(newCoverage => {
                form.dynamicRates = [];
                form.dynamicRates.push(newRate['obj']);
                form.dynamicRates[0].dynamicCoverages = [];
                form.dynamicRates[0].dynamicCoverages.push(newCoverage['obj']);
                this.raterForms.push(form);
                this.getForms();
                this.alertService.success('New Form Added Successfully');
                this.onResetEditing();
              }, error => {
                this.logService.console(error, true);
              });
          }, error => {
            this.logService.console(error, true);
          });
      }, error => {
        this.logService.console(error, true);
      });
  }

  addRater(rater: DynamicRater) {
    rater.companyDynamicRaterId = this.company.id;
    this.raterService.post(rater)
      .subscribe(newRater => {
        this.raters.push(newRater['obj']);
        this.alertService.success('New Rater Created Successfully');
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  addSpec(spec: DynamicCoverageSpec, i) {
    this.formRate.dynamicCoverages[i].specs.push(this.createCopy(spec));
    this.onResetEditing();
    this.alertService.success('Added Successfully. Please Save Coverage');
  }

  saveSpec(spec: DynamicCoverageSpec, i, j) {
    this.formRate.dynamicCoverages[i].specs[j] = this.createCopy(spec);
    this.onResetEditing();
    this.alertService.success('Saved Successfully. Please Save Coverage');
  }

  removeSpec(spec: DynamicCoverageSpec, i, j) {
    if (confirm('Are you sure you want to remove this?')) {
      this.formRate.dynamicCoverages[i].specs.splice(j, 1);
      this.onResetEditing();
      this.alertService.success('Removed Successfully. Please Save Coverage');
    }
  }

  addDefaultRaters() {
    this.raterService.postByDefault()
      .subscribe(raters => {
        window.location.reload();
      }, error => {
      });
  }

  deleteCoverage(i) {
    if (confirm('Are you sure you want to delete this coverage?')) {
      this.dynamicCoverageService.delete(this.formRate.dynamicCoverages[i])
        .subscribe(data => {
          this.formRate.dynamicCoverages.splice(i, 1);
          this.alertService.success('Coverage Deleted Successfully');
        }, error => {
          this.logService.console(error, true);
        });
    }
  }

  removeForm(form: Form, i) {
    if (confirm('Are you sure you want to remove this Form from this Rater?')) {
      form.dynamicRaterFormId = null;
      if (form.dynamicRates && form.dynamicRates[0]) {
        this.dynamicRateService.delete(form.dynamicRates[0])
          .subscribe(data => {
            this.formService.patch(form)
              .subscribe(updatedForm => {
                this.raterForms.splice(i, 1);
                this.alertService.success('Form Removed Successfully');
                this.onResetEditing();
              }, error => {
                this.logService.console(error, true);
              });
          }, error => {
            this.logService.console(error, true);
          });
      } else {
        this.formService.patch(form)
          .subscribe(updatedForm => {
            this.raterForms.splice(i, 1);
            this.alertService.success('Form Removed Successfully');
            this.onResetEditing();
          }, error => {
            this.logService.console(error, true);
          });
      }
    }
  }

  deleteRater(i: number) {
    if (confirm('Are you sure you want to delete this rater?')) {
      this.raterService.delete(this.raters[i])
        .subscribe(data => {
          this.raters.splice(i, 1);
        }, error => {
          this.logService.console(error, true);
        });
    }
  }

  deleteParameter(i: number) {
    if (confirm('Are you sure you want to delete this parameter?')) {
      this.parameterService.delete(this.parameters[i])
        .subscribe(data => {
          this.parameters.splice(i, 1);
        }, error => {
          this.logService.console(error, true);
        });
    }
  }

  dropItCoverages(event: CdkDragDrop<string[]>, i?: number) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.formRate.dynamicCoverages, event.previousIndex, event.currentIndex);
      this.updateCoverages();
    }
  }

  getRaters() {
    this.raterService.getByCompany()
      .subscribe(raters => {
        this.raters = raters['obj'];
        this.ratersRetrieved = true;
      }, error => {
        this.logService.console(error, true);
      });
  }

  getForms() {
    this.formService.getByCompany(true)
      .subscribe(forms => {
        this.forms = forms['obj'];
        this.formsRetrieved = true;
      }, error => {
        this.logService.console(error, true);
      });

  }

  stringTruncate(str: string, length: number) {
    let dots = str.length > length ? '...' : '';
    return str.substring(0, length) + dots;
  }

  onChangeAddView(view: string) {
    if (view === 'rater') {
      this.addingRater = true;
    } else if (view === 'form') {
      this.addingForm = true;
    } else if (view === 'rates') {

    }
  }

  onChangeEditView(view: string, selectedIndex: number) {
    this.selectedIndex = selectedIndex !== null ? selectedIndex : this.selectedIndex;
    if (view === 'rater') {
      this.editingRater = true;
      if (selectedIndex !== null) {
        this.selectedRater = this.raters[selectedIndex];
      }
    } else if (view === 'coverage') {
      this.editingCoverage = true;
      if (selectedIndex !== null) {
        this.selectedCoverage = this.coverages[selectedIndex];
      }
    } else if (view === 'parameter') {
      this.editingParameter = true;
      if (selectedIndex !== null) {
        this.selectedParameter = this.parameters[selectedIndex];
      }
    }
  }

  onChangeCoverageView(action: string, coverageIndex?, specIndex?) {
    if (action === 'editingSpec') {
      this.addingSpec = false;
      this.coverageIndex = coverageIndex;
      this.specIndex = specIndex;
      this.editingSpec = true;
    } else if (action === 'addingSpecOnCoverage') {
      this.editingSpec = false;
      this.editingCoverage = false;
      this.addingCoverage = false;
      this.coverageIndex = coverageIndex;
      this.addingSpec = true;
    } else if (action === 'addingSpecOnNewCoverage') {
      this.editingSpec = false;
      this.editingCoverage = false;
      this.selectedCoverage = this.formRate.dynamicCoverages[coverageIndex];
      this.coverageIndex = coverageIndex;
      this.addingSpec = true;
    } else if (action === 'addingCoverage') {
      this.addingCoverage = true;
      this.editingSpec = false;
      this.addingSpec = false;
      this.editingCoverage = false;
    } else if (action === 'editingCoverage') {
      this.addingCoverage = false;
      this.editingSpec = false;
      this.addingSpec = false;
      this.coverageIndex = coverageIndex;
      this.editingCoverage = true;
    }
  }

  onChangeView(newView: string, i?: number) {
    if (newView === 'form') {
      if (i !== null) {
        this.raterIndex = i;
        this.raterForms = this.raters[this.raterIndex].forms;
      }
      this.isForm = true;
      this.isRater = false;
      this.isDynamicRate = false;
    } else if (newView === 'parameter') {
      if (i !== null) {
        this.raterIndex = i;
        this.parameters = this.raters[this.raterIndex].parameters;
      }
      this.isParameter = true;
      this.isRater = false;
      this.isCoverage = false;
      this.isDynamicRate = false;
    } else if (newView === 'rater') {
      this.selectedForm = new Form(null);
      this.isRater = true;
      this.isParameter = false;
      this.isCoverage = false;
      this.isDynamicRate = false;
      this.isForm = false;
    } else if (newView === 'dynamicRate') {
      if (i !== null) {
        this.formRaterIndex = i;
        this.selectedForm = this.raterForms[this.formRaterIndex];
        this.formRate = this.raterForms[this.formRaterIndex].dynamicRates[0];
        this.formRate.dynamicCoverages.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      }
      this.isForm = false;
      this.isRater = false;
      this.isDynamicRate = true;
    }
  }

  onChangePageView(pageTitle: string, page: Page) {
    this.pageTitle = pageTitle.toLowerCase();
    this.selectedPage = page;
  }

  onResetEditing() {
    this.editingRater = false;
    this.editingCoverage = false;
    this.editingParameter = false;
    this.selectedRater = new DynamicRater(null, null, null, null);
    this.selectedCoverage = new Coverage(null, null, false, false, null, null, null, null, null, false, false, false, false, 0);
    this.selectedParameter = new Parameter(null, null, false, false, null, null, null);
    this.addingRater = false;
    this.addingForm = false;
    this.newRater = new DynamicRater(null, null, null, null);
    this.newCondition = new DynamicRateCondition(null, null, null, null, null, null, null);
    this.addingCondition = false;
    this.conditionIndex = null;
    this.coverageIndex = null;
    this.specIndex = null;
    this.addingSpec = false;
    this.addingCoverage = false;
    this.editingSpec = false;
    this.editingCoverage = false;
  }

//   openDialog() {
//     this.raterService.get()
//       .subscribe(raters => {
//         const dialogRef = this.dialog.open(DialogTemplatePicker, {
//           width: '30rem',
//           data: {templates: raters['obj']}
//         });

//         dialogRef.afterClosed().subscribe(result => {
//           this.createRaterByTemplate(result);
//         });
//       });
//   }

  openImageDialog(action: string, index?: any) {
    const dialogRef = this.dialog.open(DialogImagePicker, {
      width: '30rem',
      data: {question: (action === 'editing') ? this.selectedCoverage : this.newCoverage, brandColor: this.company.brandColor}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result != 'undefined' && result !== null) {
        if (action === 'editing') {
          this.formRate.dynamicCoverages[index].image = result;
        } else {
          this.newCoverage.image = result;
        }
      }
    });
  }

  reorderCoverages() {
    this.coverages.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
  }

  createRater() {
    this.selectedRater.companyDynamicRaterId = this.company.id;
    this.raterService.post(this.selectedRater)
      .subscribe(newRater => {
        this.raters.push(newRater['obj']);
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  createRaterByTemplate(rater: DynamicRater) {
    rater.companyDynamicRaterId = +this.company.id;
    this.raterService.postByTemplate(rater)
      .subscribe(newRater => {
        this.raters.push(newRater['obj']);
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  updateRater(rater: DynamicRater) {
    this.raterService.patch(rater)
      .subscribe(updatedRater => {
        this.onResetEditing();
        this.alertService.success('Rater Updated Succesfully');
      }, error => {
        this.logService.console(error, true);
      });
  }

  createCoverage() {
    this.newCoverage.position = this.coverages.length || 0;
    this.newCoverage.companyDynamicCoverageId = this.company.id;
    this.newCoverage.dynamicRateDynamicCoverageId = +this.formRate.id;
    this.dynamicCoverageService.post(this.newCoverage)
      .subscribe(newCoverage => {
        this.formRate.dynamicCoverages.push(newCoverage['obj']);
        this.addingCoverage = false;
        newCoverage = new DynamicCoverage(null, null, null, null, null, [], null, null, null);
        this.updateCoverages();
      }, error => {
        this.logService.console(error, true);
      });
  }

  createCopy(orig) {
    return JSON.parse(JSON.stringify(orig));
  }

  returnFormUrl(form: Form) {
    return `${environment.production === true ? 'https://app.xilo.io/' :
      'http://localhost:4200/'}client-app/${form.isAuto ? 'auto' :
      form.isHome ? 'home' : 'f'}/start?companyId=${this.company.companyId +
    ((!form.isAuto && !form.isHome) ? ('&title=' + form.title) : '')}`;
  }

  onDuplicateRater(rater: DynamicRater) {
    if (confirm('Are you sure you want to copy this rater?')) {
      delete rater.id;
      rater.companyDynamicRaterId = this.company.id;
      for (let d = 0; d < rater.dynamicCoverages.length; d++) {
        delete rater.dynamicCoverages[d].id;
        rater.dynamicCoverages[d].companyDynamicCoverageId = this.company.id;
        for (let i = 0; i < rater.parameters.length; i++) {
          delete rater.parameters[i].id;
          rater.parameters[i].companyParameterId = this.company.id;
        }
        if (!rater.dynamicCoverages[d + 1]) {
          this.raterService.duplicate(rater)
            .subscribe(newRater => {
              this.raters.push(newRater['obj']);
            }, error => {
              this.logService.console(error, true);
            });
        }
      }
    }
  }

  updateCoverages() {
    this.formRate.dynamicCoverages.forEach((coverage, i) => {
      coverage.position = i;
      this.dynamicCoverageService.patch(coverage)
        .subscribe(updatedCoverage => {
          this.onResetEditing();
          this.editingCoveragePosition = false;
        }, error => {
          this.logService.console(error, true);
        });
    });
  }

  updateCoverage(coverage: DynamicCoverage, ) {
    this.dynamicCoverageService.patch(coverage)
      .subscribe(updatedCoverage => {
        this.alertService.success('Coverage Saved Successfully');
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  createParameter() {
    this.selectedParameter.companyParameterId = this.company.id;
    this.selectedParameter.raterParameterId = +this.raters[this.raterIndex].id;
    this.parameterService.post(this.selectedParameter)
      .subscribe(newParameter => {
        this.parameters.push(newParameter['obj']);
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  updateParameter(parameter: Parameter) {
    this.parameterService.patch(parameter)
      .subscribe(updatedParameter => {
        this.onResetEditing();
      }, error => {
        this.logService.console(error, true);
      });
  }

  updateDynamicRateCondition(condition: DynamicRateCondition) {
    this.conditionService.patch(condition)
      .subscribe(updatedCondition => {
        this.alertService.success('Condition Updated Successfully');
      }, error => {
        this.logService.console(error, true);
      });
  }

  updateDynamicRate(dRate: DynamicRate) {
    this.dynamicRateService.patch(dRate)
      .subscribe(updatedRate => {
        this.alertService.success('Rate Updated Successfully');
      }, error => {
        this.logService.console(error, true);
      });
  }

  returnIsValidAnswer(answer: Answer) {
    if (answer.isProgressButton === true || answer.isPrevNextButtons === true
      || answer.hasCustomHtml === true || answer.isAddDriver === true ||
      answer.isAddVehicle === true || answer.isConditional === true) {
      return false;
    } else {
      return true;
    }
  }

  getCompany() {
    this.company = new Company(null);
    this.companyService.get()
      .subscribe(company => {
        this.company = company['obj'];
        this.companyRetrieved = true;
      }, error => {
        this.logService.console(error, true);
      });
  }

  setAnswers(form) {
    this.selectedForm = form;
    form.pages.forEach((page, i) => {
      page.questions.forEach(question => {
        question.answers.forEach((answer) => {
          if (this.returnIsValidAnswer(answer)) {
            this.answers.push(answer);
          }
        });
      });
      if (!form.pages[i + 1]) {
        this.answersRetrieved = true;
      }
    });
  }

  stylePageButton(pageTitle: string) {
    if (pageTitle.toLowerCase() === this.pageTitle.toLowerCase()) {
      return {background: '#7c7fff', color: '#fff'};
    } else {
      return {background: '#ccc', color: '#000'};
    }
  }

}
