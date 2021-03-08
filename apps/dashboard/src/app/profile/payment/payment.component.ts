import { Component, OnInit } from '@angular/core';

import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {AlertControllerService} from "../../services/alert.service";
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    loading = false;
    company = new Company(null);
    user = new User(null);
    userRetrieved = false;

    constructor(
        private alertService: AlertControllerService,
        private companyService: CompanyService,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.loading = true;
        this.userService.get()
            .subscribe(user => {
                this.loading = false;
                this.user = user['obj'];
                this.userRetrieved = true;
            }, error => {
                this.loading = false;
                
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }


}
