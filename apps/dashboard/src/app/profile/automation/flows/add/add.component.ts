import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../models/company.model';
import { LogService } from '../../../../services/log.service';
import { Flow } from '../../../../models/flow.model';
import { Template } from '../../../../models/template.model';
import { Router } from '@angular/router';
import { FlowService } from '../../../../services/flow.service';
import { TemplateService } from '../../../../services/template.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { AlertControllerService } from '../../../../services/alert.service';

@Component({
  selector: 'app-automation-flows-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../automation.component.css']
})
export class AutomationFlowsAddComponent implements OnInit {
  company: Company = new Company(null);
  flow: Flow = new Flow(null);

  listing = false;
  editflow = false;
  selectedSequence: any[];

  templates: Template[] = [];
  timeDelays = [{
    isTimeDelay: true, isEmail: false, isText: false,
    position: 0, secondsDelay: 0, minutesDelay: 0, hoursDelay: 0, daysDelay: 0
  }];
  taskTemplates = [{ body: '', companyTemplateId: null, isTask: true, isEmail: false, isText: false,
  position: 0, subject: null, title: '' }];
  emailTemplates = [{ body: '', companyTemplateId: null, isEmail: true, isText: false, position: 0, subject: null, title: '' }];
  textTemplates = [{ body: '', companyTemplateId: null, isEmail: false, isText: true, position: 0, subject: null, title: '' }];
  tasks = [{ body: '', companyTemplateId: null, isEmail: false, isText: true, position: 0, subject: null, title: '' }];
  loading = false;
  isNewClientFlow = true;

  constructor(
    private companyService: CompanyService,
    private logService: LogService,
    private flowService: FlowService,
    private templateService: TemplateService,
    private router: Router,
    private alertService: AlertControllerService
  ) { }

  ngOnInit() {
    this.getTemplates();
    this.getCompany();
    this.setSequences();
    this.getNewLeadFlow();
  }

  getCompany() {
    this.companyService.get()
      .subscribe(company => {
        this.company = company['obj'];
      }, error => {
        this.logService.console(error, true);
      });
  }

  getTemplates() {
    this.templateService.getAllTemplate('all')
      .subscribe(template => {
        this.templates = template['obj'];
      }, error => {
        this.logService.console(error, true);
      });
  }

  getNewLeadFlow() {
    this.flowService.getNewLeadFlow()
      .subscribe(leadFlow => {
        this.isNewClientFlow = leadFlow['obj'] ? leadFlow['obj'].isNewClientFlow : false;
      }, error => {
        if (error.status == '404') {
          this.isNewClientFlow = false;
        } else {
          this.logService.console(error, true);
        }
      });
  }


  addFlow() {

    if (!this.flow.title) {
      return this.alertService.error('Please mention a title.');
    }
    const sequenceList = this.flow.sequence.filter(el => {
      const isTaskValidate = el.isTask && (!el.priority || !el.type || !el.description);
      const isTextValidate = el.isText && (!el.body);
      const isEmailValidate = el.isEmail && (!el.title || !el.body);
      const isTimeDelayValidate = el.isTimeDelay && (el.secondsDelay < 0 || el.minutesDelay < 0 || el.hoursDelay < 0 || el.daysDelay < 0);

      if (isTaskValidate) {
        this.alertService.error('Task template data required');
        return false;
      } else if (isTextValidate) {
        this.alertService.error('Text template data required');
        return false;
      } else if (isEmailValidate) {
        this.alertService.error('Email template data required');
        return false;
      } else if (isTimeDelayValidate) {
        this.alertService.error('Time delay value must be greater then 0');
        return false;
      }
      return true;
    });

    if (this.flow.sequence.length === sequenceList.length) {
          this.flow.companyFlowId = this.company.id;
          const delayTimeIndexes = this.flow.sequence.reduce((arr, e, i) => {
            if (e.isTimeDelay) { arr.push(i); }
            return arr;
          }, []);
          for (let i = 0; i < delayTimeIndexes.length; i++) {
            this.flowSave(delayTimeIndexes[i]);
          }
          this.loading = true;
            this.flowService.post(this.flow)
              .subscribe(addedFlow => {
                this.loading = false;
                this.router.navigate(['/profile/automation/flows']);
                this.alertService.success('Flow Added Successfully.');
              }, error => {
                this.loading = false;
                if(error?.error?.errorType !== 6) this.alertService.error('error');
              });
    }
  }

  createCopy(orig) {
    return JSON.parse(JSON.stringify(orig));
  }

  changeStatus(selectedIndex: number) {
    if (this.listing === true) {
      this.listing = false;
    } else {
      this.editflow = false;
      this.selectedSequence = this.flow.sequence[selectedIndex];
      this.listing = true;
    }
  }

  editFlow (selectedIndex: number) {
    if (this.editflow === true) {
      this.editflow = false;
      this.listing = false;
    } else {
      this.selectedSequence = this.flow.sequence[selectedIndex];
      this.editflow = true;
      this.listing = false;
    }
  }

  flowSave(selectedIndex: number) {
    this.editflow = false;

    if (this.flow.sequence[selectedIndex].isTimeDelay) {
      const correctTimeDelay: any = {};
      correctTimeDelay.secondsDelay = this.flow.sequence[selectedIndex].secondsDelay % 60;
      correctTimeDelay.minutesDelay = ( this.flow.sequence[selectedIndex].minutesDelay + this.flow.sequence[selectedIndex].secondsDelay / 60 | 0 ) % 60;
      correctTimeDelay.hoursDelay = ( this.flow.sequence[selectedIndex].hoursDelay + (this.flow.sequence[selectedIndex].minutesDelay / 60 | 0) + (this.flow.sequence[selectedIndex].secondsDelay / (60 * 60) | 0)) % 24;
      correctTimeDelay.daysDelay = this.flow.sequence[selectedIndex].daysDelay + (this.flow.sequence[selectedIndex].hoursDelay / 24 | 0) + (this.flow.sequence[selectedIndex].minutesDelay / (60 * 24) | 0) + (this.flow.sequence[selectedIndex].secondsDelay / (60 * 60 * 24) | 0);
      this.flow.sequence[selectedIndex] = {...this.flow.sequence[selectedIndex], ...correctTimeDelay };
    }
  }

  deleteFlow(selectedIndex: number) {
    this.listing = false;
    this.editflow = false;
    if (confirm('Are you sure you want to delete this item?')) {
      this.flow.sequence.splice(selectedIndex, 1);
      this.flow.sequence.forEach((sequence, i) => {
        sequence.position = i;
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const item = (event.previousContainer.data && event.previousContainer.data[0]) ?  event.previousContainer.data[0]['isTimeDelay'] : false;
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.flow.sequence[event.currentIndex] = this.flow.sequence[event.currentIndex];
      this.flow.sequence.forEach((sequence, i) => {
        sequence.position = i;
        if (!sequence.type) {  sequence.type = ''; }
        if (!sequence.priority) {  sequence.priority = ''; }
      });
      this.timeDelays = [{isTimeDelay: true, isEmail: false, isText: false, position: 0,
        secondsDelay: 0, minutesDelay: 0, hoursDelay: 0, daysDelay: 0}];
      this.taskTemplates = [{ body: '', companyTemplateId: 2, isTask:true, isEmail: false, isText: false, position: 0, subject: null, title: ''}];
      this.emailTemplates = [{body: '', companyTemplateId: 2, isEmail: true, isText: false, position: 0, subject: null, title: ''}];
      this.textTemplates = [{body: '', companyTemplateId: 2, isEmail: false, isText: true, position: 0, subject: null, title: ''}];
      this.resetList();
    } else if (event.previousIndex !== event.currentIndex) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.flow.sequence.forEach((sequence, i) => {
          sequence.position = i;
        });
      }
    }
  }

  resetList() {
    this.getTemplates();
  }

  truncString(string: string) {
    const maxLength = 50;
    const str = (string && string !== '' && string.length && string.length > maxLength) ? string.substr(0, maxLength) + '...' : string;
    // let str = string.length > maxLength ? string.substr(0, maxLength) + '...' : string;
    return str;
  }

  setSequences() {
    this.flow.sequence = [];
  }

  calculateDelay(flow, i) {
    const subFlow = flow.slice(0, 1 + i);
    const filter = subFlow.filter((item) => item.isTimeDelay);
    const delay = filter.reduce((accumulator, currentValue) => accumulator + currentValue.daysDelay * 24 * 3600 * 1000 + currentValue.hoursDelay * 3600 * 1000 + currentValue.minutesDelay * 60 * 1000 + currentValue.secondsDelay * 1000, 24 * 3600 * 1000);
    return delay / (24 * 3600 * 1000) | 0;
  }

}
