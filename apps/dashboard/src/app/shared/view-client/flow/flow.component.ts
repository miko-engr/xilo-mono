import {Component, OnInit} from '@angular/core';
import {LogService} from '../../../services/log.service';
import {Flow} from '../../../models/flow.model';
import {FlowService} from '../../../services/flow.service';
import {ClientService} from '../../../services/client.service';
import {Router} from "@angular/router";
import {Client} from "../../../models/client.model";

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['../view-client.component.css', '../../../profile/automation/automation.component.css']
})
export class FlowComponent implements OnInit {
  availableFlows: {
    title: string,
    obj: Array<Flow>,
  };

  currentFlow: {
    title: string,
    obj: Flow,
  };
  clientId: string;
  loading: boolean = true;

  constructor(private router: Router,
              private logService: LogService,
              private flowService: FlowService,
              private clientService: ClientService) {
  }

  ngOnInit() {
    this.getRoute();
  }

  getClientFlows(id: string) {
    const client = new Client(id);
    this.clientService.getClientFlows(client)
        .subscribe(flow => {
            this.availableFlows = flow['availableFlow'];
            this.currentFlow = flow['currentFlow'];
            this.loading = false;
        }, error => {
          this.logService.console(error, true);
        })
  }

  getRoute() {
    let url = this.router.url;
    let urlArray = url.split('/');
    let urlDirect = urlArray[1];
    if (urlDirect === 'profile') {
      this.clientId = urlArray[4];
      this.getClientFlows(this.clientId);
    }
  }

  addToFlow(flowId) {
    if (confirm('Are you sure you want to add this flow?')) {
      const body = {
        flowId: flowId,
        clientId: this.clientId
      };

      this.clientService.addToFlow(body)
        .subscribe(res => {
          this.loading = true;
          this.logService.success(res['title']);
          this.getClientFlows(this.clientId);
        }, error => {
          this.logService.console(error, true);
        })
    }
  }

  removeFromFlow() {
    if (confirm('Are you sure you want to remove this flow?')) {
      this.clientService.removeFromFlow(this.clientId)
        .subscribe(res => {
          this.loading = true;
          this.logService.success(res['title']);
          this.getClientFlows(this.clientId);
        }, error => {
          this.logService.console(error, true);
        })
    }
  }

}
