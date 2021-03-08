import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { LogService } from '../../../services/log.service';
import { escapeRegExp } from '@angular/compiler/src/util';


@Component({
  selector: 'app-client-validations',
  templateUrl: './validations.component.html',
  styleUrls: ['../view-client.component.css']
})
export class ClientValidationComponent implements OnInit {
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    params: Params = Object.assign({}, this.route.snapshot.params);
    client: Client;

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private logService: LogService,
        private router: Router,
    ) { }

    ngOnInit() {
        const url = this.router.url;
        const urlArray = url.split('/');
        const id = urlArray[4];
        if (this.queryParams.token && this.queryParams.token === 'ezlynxvalidation123') {
            this.getClient(id);
        } else {
            return this.router.navigate(['/auth/login']);
        }
    }

    getClient(id: string) {
        const client = new Client(id);
        this.clientService.getClientByParams(client, 'drivers')
        .subscribe(rClient => {
            this.client = rClient;
        }, error => {
            this.logService.console(error, false);
        });
    }

    parseXml(xml: string) {
        return xml.replace(new RegExp(escapeRegExp('\\'), 'g'), '');
    }


}
