import {Component, OnInit} from '@angular/core';
import { Company } from '../../../../models/company.model';
import { LogService } from '../../../../services/log.service';
import { Flow } from '../../../../models/flow.model';
import { Template } from '../../../../models/template.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../../../../services/flow.service';
import { TemplateService } from '../../../../services/template.service';
import { AlertControllerService } from '../../../../services/alert.service';
import {CdkDragDrop, moveItemInArray , transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-automation-flows-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../automation.component.css']
})
export class AutomationFlowsEditComponent implements OnInit {
  company: Company = new Company(null);

  // flow$: Observable<Flow[]>;
  // flow : Flow[] = [];
  flow: Flow = new Flow(null);
  params: Params = Object.assign({}, this.route.snapshot.params);
  templates: Template[] = [];

  listing = false;
  editflow = false;
  selectedSequence : any={};
  timeDelays = [{isTimeDelay: true, isEmail: false, isText: false, position: 0,
    secondsDelay: 0, minutesDelay: 0, hoursDelay: 0, daysDelay: 0}];
  taskTemplates  = [{body: '', companyTemplateId: 2, isEmail: false, isText: false, isTask: true, position: 0, subject: null, title: ''}];
  emailTemplates = [{body: '', companyTemplateId: 2, isEmail: true, isText: false, position: 0, subject: null, title: ''}];
  textTemplates = [{body: '', companyTemplateId: 2, isEmail: false, isText: true, position: 0, subject: null, title: ''}];
  loading = false;
  // templates$: Observable<Template[]>;
  isNewClientFlow = true;

  constructor(
    private logService: LogService,
    private flowService: FlowService,
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertControllerService
  ) { }

  ngOnInit() {
    if (!this.params.id) {
      this.logService.console('Please add the flow id');
      this.router.navigate(['/profile/automation/flows']);
    } else {
      this.loading = true;
      this.flowService.get(this.params.id)
        .subscribe(flow => {
          this.loading = false;
          this.flow = flow['obj'];
          this.getNewLeadFlow(this.flow);
        }, error => {
          this.loading = false;
          this.logService.console(error, true);
        });
      this.getTemplates();
      this.setSequences();
    }
  }

  getTemplates() {
    this.templateService.getAllTemplate('all')
      .subscribe(template => {
        this.templates = template['obj'];
      }, error => {
        this.logService.console(error, true);
      });
  }

  getNewLeadFlow(flow) {
    this.flowService.getNewLeadFlow()
      .subscribe(leadFlow => {
        this.isNewClientFlow = leadFlow['obj'] ? leadFlow['obj'].isNewClientFlow : false;
        this.isNewClientFlow = this.isNewClientFlow ? !(flow.id === leadFlow['obj'].id) : this.isNewClientFlow;
      }, error => {
        if (error.status == '404') {
          this.isNewClientFlow = false;
        } else {
          this.logService.console(error, true);
        }
      });
  }

  truncString(string: string) {
    const maxLength = 50;
    const str = (string && string !== '' && string.length && string.length > maxLength) ? string.substr(0, maxLength) + '...' : string;
    // let str = string.length > maxLength ? string.substr(0, maxLength) + '...' : string;
    return str;
  }

  changeStatus(selectedIndex: number) {
    if (this.listing === true) {
      this.listing = false;
    } else {
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
    this.selectedSequence = this.flow.sequence[selectedIndex];
    /*if(this.selectedSequence.isTimeDelay == true){
      let daysDelay = parseInt(this.selectedSequence.daysDelay);
      let hoursDelay = parseInt(this.selectedSequence.hoursDelay);
      let minutesDelay = parseInt(this.selectedSequence.minutesDelay);
      let secondsDelay = parseInt(this.selectedSequence.secondsDelay);

    }*/
    if (this.flow.sequence[selectedIndex].isTimeDelay) {
      const correctTimeDelay: any = {};
      correctTimeDelay.secondsDelay = this.flow.sequence[selectedIndex].secondsDelay % 60;
      correctTimeDelay.minutesDelay = ( this.flow.sequence[selectedIndex].minutesDelay + this.flow.sequence[selectedIndex].secondsDelay / 60 | 0 ) % 60;
      correctTimeDelay.hoursDelay = ( this.flow.sequence[selectedIndex].hoursDelay + (this.flow.sequence[selectedIndex].minutesDelay / 60 | 0) + (this.flow.sequence[selectedIndex].secondsDelay / (60 * 60) | 0)) % 24;
      correctTimeDelay.daysDelay = this.flow.sequence[selectedIndex].daysDelay + (this.flow.sequence[selectedIndex].hoursDelay / 24 | 0) + (this.flow.sequence[selectedIndex].minutesDelay / (60 * 24) | 0) + (this.flow.sequence[selectedIndex].secondsDelay / (60 * 60 * 24) | 0);
      this.flow.sequence[selectedIndex] = {...this.flow.sequence[selectedIndex], ...correctTimeDelay };
    }
  }

  deleteOneFlow(selectedIndex: number) {
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
    if (!this.flow.sequence || this.flow.sequence === null) {
      this.flow.sequence = [];
    }
    const item = (event.previousContainer.data && event.previousContainer.data[0]) ?  event.previousContainer.data[0]['isTimeDelay'] : false;
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      // this.flow.sequence[event.currentIndex] = this.flow.sequence[event.currentIndex];
      this.flow.sequence.forEach((sequence, i) => {
        sequence.position = i;
      });
      this.timeDelays = [{isTimeDelay: true, isEmail: false, isText: false, position: 0,
        secondsDelay: 0, minutesDelay: 0, hoursDelay: 0, daysDelay: 0}];
     this.taskTemplates  = [{body: '', companyTemplateId: 2, isEmail: false, isText: false, isTask: true, position: 0, subject: null, title: ''}];
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

  setSequences() {
    this.flow.sequence = [];
  }

  updateFlow() {
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
      this.loading = true;
      const delayTimeIndexes = this.flow.sequence.reduce((arr, e, i) => {
        if (e.isTimeDelay) { arr.push(i); }
        return arr;
      }, []);
      for (let i = 0; i < delayTimeIndexes.length; i++) {
        this.flowSave(delayTimeIndexes[i]);
      }
      this.flowService.patch(this.flow)
        .subscribe(updatedFlow => {
          this.loading = false;
          this.router.navigate(['/profile/automation/flows']);
          this.alertService.success('Flow Updated Successfully');
        }, error => {
          this.loading = false;
          this.alertService.success(error);
        });
    }
  }

 /* deleteFlow(){
    if (confirm('Are you sure you want to delete this flow?')) {
      this.flowService.delete(this.flow)
        .subscribe(data => {
          this.router.navigate(['/profile/automation/flows']);
          this.alertService.success('Flow Deleted Successfully.');
        }, error => {
          this.alertService.success(error);
        });
    }
  }*/

  calculateDelay(flow, i) {
    const subFlow = flow.slice(0, 1 + i);
    const filter = subFlow.filter((item) => item.isTimeDelay);
    const delay = filter.reduce((accumulator, currentValue) =>
      accumulator + currentValue.daysDelay * 24 * 3600 * 1000 + currentValue.hoursDelay * 3600 * 1000 + currentValue.minutesDelay * 60 * 1000 + currentValue.secondsDelay * 1000, 24 * 3600 * 1000);
    return delay / (24 * 3600 * 1000) | 0;
  }

}
