import { Component, OnInit } from '@angular/core';
import {AlertControllerService} from '../../../services/alert.service';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../business.component.css', './stripe-button.css']
})
export class CompanyComponent implements OnInit {
      editInputs = true;
      isUnsaved: Boolean = false;
      company = new Company(null);
      tempcompany : any;
      development = !environment.production;
      loading = false;
      user = new User(null);
      agencyName: string;
      userRetrieved = false;
      production = environment.production;
      isCustomer = localStorage.getItem('isCustomer');
      options = {
        componentRestrictions: { country: 'AU' }
      }

  constructor(
      private companyService: CompanyService,
      private userService: UserService,
      private alertService: AlertControllerService,
      private router: Router
  ) { }

  ngOnInit() {
    this.getCompany();
  }

  onAutoCompleteLocation(selectedData: any) {
        const data = selectedData;
        const indexArray = data['address_components'].map(item => {
            return item.types[0];
        });

        const streetNumber = data['address_components'][indexArray.indexOf('street_number')] ? 
                                data['address_components'][indexArray.indexOf('street_number')].long_name : null;
        const streetName = data['address_components'][indexArray.indexOf('route')] ? 
                            data['address_components'][indexArray.indexOf('route')].long_name : null;
        const streetAddress = (streetNumber && streetName) ? `${streetNumber} ${streetName}` : null;
        const city = data['address_components'][indexArray.indexOf('locality')] ? 
                        data['address_components'][indexArray.indexOf('locality')].long_name : null;
        const county = data['address_components'][indexArray.indexOf('administrative_area_level_2')] ? 
                            data['address_components'][indexArray.indexOf('administrative_area_level_2')].long_name : null;
        const state = data['address_components'][indexArray.indexOf('administrative_area_level_1')] ? 
                        data['address_components'][indexArray.indexOf('administrative_area_level_1')].short_name : null;
        const zipCode = data['address_components'][indexArray.indexOf('postal_code')] ? 
                            data['address_components'][indexArray.indexOf('postal_code')].long_name : null;

        const fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${zipCode}`;

        this.company.streetNumber = streetNumber;
        this.company.streetName = streetName;
        this.company.streetAddress = streetAddress;
        this.company.city = city;
        this.company.state = state;
        this.company.zipCode = zipCode;

        this.company.fullAddress = fullAddress;
        this.isUnsaved = true;
    }

  getCompany() {
      this.company = new Company(null);
      this.loading = true;
      this.userService.get()
          .subscribe(user => {
              this.user = user['obj'];
              this.companyService.get()
                  .subscribe(company => {
                      this.loading = false;
                      this.tempcompany = JSON.parse(JSON.stringify(company));
                      this.setCompanyData(company);
                      this.userRetrieved = true;
                  }, error =>  {
                      this.loading = false;

                      if (error) {
                          localStorage.clear();
                          this.router.navigate(['/auth/login']);
                      }
                      this.alertService.serverError(error.error.errorType, error.error.data);
                  });
          });
  }

  setCompanyData(company) {
    this.company = company['obj'];
    this.agencyName = (this.company.name !== null) ? this.company.name.replace(/\s+/g, '-') : '';
  }

  // Allows the company to edit inputs by clicking edit button
  onEditInputs() {
      this.editInputs = !this.editInputs;
  }

  styleGroups() {
      if (this.editInputs === true) {
          return {'margin-bottom': '37px'};
      }
  }

  resetInputs() {
      this.isUnsaved = false;
      this.setCompanyData(JSON.parse(JSON.stringify(this.tempcompany)));
    //   this.editInputs = false;
  }

  async updateCompany() {
      this.loading = true;
      await this.updateAddress();
        this.companyService.patch(this.company)
            .subscribe(updatedCompany => {
                this.loading = false;
                // this.editInputs = false;
                const data = {
                    obj: this.company,
                }
                this.tempcompany = JSON.parse(JSON.stringify(data));
                this.resetInputs()
                this.alertService.success('Profile Updated Successfully');
            }, error => {
                this.loading = false;

                this.alertService.serverError(error.error.errorType, error.error.data);
            });
  }

  async updateAddress() {
      if (this.company.streetNumber && this.company.streetName) {
          this.company.streetAddress = `${this.company.streetNumber} ${this.company.streetName}` +
            (this.company.unit ? ` Unit ${this.company.unit},` : '');
          this.company.fullAddress = `${this.company.streetAddress} ${this.company.city}, ${this.company.state}, ${this.company.zipCode}`; ;
      }
      return null;
  }

    updateCompanyPaymentMethod(token: any) {
        if (this.company.hasActiveSubscription == true) {
            this.companyService.patchCustomer(token)
                .subscribe(data => {
                    this.alertService.success('Payment Updated Successfully!');
                }, error => {
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
        } else {
            this.companyService.postCustomer(token)
                .subscribe(data => {
                    this.alertService.success('Payment Added Successfully!');
                }, error => {
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
        }
    }

    openCheckout() {
        if (typeof window['StripeCheckout'] != 'undefined') {
           const handler = window['StripeCheckout'].configure({
                key: environment.stripePKey,
                locale: 'auto',
                token: token => {
                    this.updateCompanyPaymentMethod(token);
                }
            });
            handler.open({
                name: 'Xilo',
                description: 'Xilos Software Service',
                zipCode: true,
                email: this.user.username,
                panelLabel: 'Subscribe'
            });
        }
    }

    isUnsavedData() {
        this.isUnsaved = true;
    }
}
