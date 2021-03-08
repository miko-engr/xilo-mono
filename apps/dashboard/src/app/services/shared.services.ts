import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { Company } from '../models/company.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class SharedService {
    client = new Client(null, null, null, null, null, null, 
                        null, null, null, null, null, null, 
                        null, null, null, null, null, null,
                        null, null, null, null, null, null,
                        null, null, null, null, null, null, 
                        null, null, null, null, null, null, 
                        null);
    clientRetrieved = false;
    company = new Company(null);
    companyRetrieved = false;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    /*
    *
    * Commercial Form Getters & Setters
    * 
    */  
    
    getClient() {
        return this.client;
    }

    setClient(client: Client) {
        this.client = client;
    }

    getClientRetrieved() {
        return this.clientRetrieved;
    }

    setClientRetrieved(isRetrieved: boolean) {
        this.clientRetrieved = isRetrieved;
    }
    
    getCompany() {
        return this.company;
    }

    setCompany(company: Company) {
        this.company = company;
    }

    getCompanyRetrieved() {
        return this.companyRetrieved;
    }

    setCompanyRetrieved(companyRetrieved: boolean) {
        this.companyRetrieved = companyRetrieved;
    }

    getLoading() {
        return this.loading;
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    // End 

    routeTo(url: string) {
        this.route.queryParams
            .subscribe(queries => {
                if (queries) {
                    this.router.navigate([url], {
                        queryParams:
                            queries
                        });
                }
            }, error => {
                
            })
    }

}