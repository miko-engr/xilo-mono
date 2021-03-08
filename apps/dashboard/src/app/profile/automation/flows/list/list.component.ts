import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../../../../models/company.model';
import { LogService } from '../../../../services/log.service';
import { Flow } from '../../../../models/flow.model';
import { FlowService } from '../../../../services/flow.service';

@Component({
    selector: 'app-automation-flows-list',
    templateUrl: './list.component.html',
    styleUrls: ['../../automation.component.css']
})
export class AutomationFlowsListComponent implements OnInit {
    company: Company = new Company(null);

    flows: Flow[];
    flows$: Observable<Flow[]>

    constructor(
        private logService: LogService,
        private flowService: FlowService
    ) { }

    ngOnInit() {
      this.getAllFlows();
    }

    getAllFlows() {
      this.flowService.get()
        .subscribe(flows => {
          this.flows = flows['obj'];
        }, error => {
          this.logService.console(error, true);
        });
    }

    search(searchData) {
        this.flowService.findSearch(searchData)
            .subscribe(flow => {
                this.flows = flow['obj'];
            }, error => {
                this.logService.console(error, true);
            });
    }

    deleteFlow(flow: Flow) {
        if (confirm('Are you sure you want to delete this flow?')) {
            this.flowService.delete(flow)
                .subscribe(data => {
                    this.logService.success('Flow Deleted Successfully');
                    this.getAllFlows();
                }, error => {
                    this.logService.console(error, true);
                });
        }
    }

}
