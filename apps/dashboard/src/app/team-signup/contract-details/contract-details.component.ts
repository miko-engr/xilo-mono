import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContractDetails } from '../models/account-details.model';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-team-signup-contract-details',
    templateUrl: './contract-details.component.html',
    styleUrls: ['../team-signup.component.scss']
})
export class TeamSignupContractDetailsComponent implements OnInit {
    @Output() next: EventEmitter<number> = new EventEmitter();
    @Input() contract: ContractDetails;
    xiloReps: any[] = environment.XILO_REP;

    constructor() {}

    ngOnInit() {}

    makeCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    arrayList(startFrom: number = 0, n: number = 1, inc: number = 1): number[] {
        return [...Array(n).keys()].map(i => startFrom + i * inc);
    }

    onNext() {
        this.next.emit(1);
    }

    onRepChange(event: object) {
        const repName = event['value'];
        this.xiloReps.forEach(
            (oneRep: {
                name: string,
                title: string,
                email: string 
            }) => {
          if (oneRep.name === repName) {
            this.contract.xiloRepTitle = oneRep.title;
            this.contract.xiloRepEmail = oneRep.email;
          }
        });
      }
    
      updateCustomerName() {
        this.contract.customerFullName = 
            `${this.contract.customerFirstName} ${this.contract.customerLastName}`;
      }
}