import { Component, OnInit } from '@angular/core';

import {CompanyService} from "../../services/company.service";
import {Carrier} from "../../models/carrier.model";
import {CarrierService} from "../../services/carrier.service";
import {UploadService} from "../../services/upload.service";
import {AlertControllerService} from "../../services/alert.service";
import { Company } from '../../models/company.model';

@Component({
    selector: 'app-carrier',
    templateUrl: './carrier.component.html',
    styleUrls: ['../business/business.component.css', './carrier.component.css']
})
export class CarrierComponent implements OnInit {
    // Carrier Variables
    carrier = new Carrier(null, null, null, null, null, null);
    company = new Company(null);
    affiliateIndex = null;
    editAffiliate = false;
    editAffiliateHotLink = false;
    editAffiliateName = false;
    editAffiliateSlogan = false;
    disableSaveAffiliate = false;
    disableUpdateAffiliate = false;
    disableUploadAffiliateLogo = false;
    loading = false;
    userRetrieved = false;

    // File upload
    affiliateFileUploaded = false;
    affiliateFiles;
    myFormData: FormData;

    // validations
    url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    //popup
    show = false;

    constructor(
        private carrierService: CarrierService,
        private alertService: AlertControllerService,
        private uploadService: UploadService,
        private companyService: CompanyService 
    ) { }

    ngOnInit() {
        this.getCompany();
    }

    checkValidation() {
        if (!this.url.test(this.carrier.hotLink)){
            this.alertService.warn('Full URL required. Please include all [https:// or http://][www.][url][.com]');
            this.loading = false;
            this.disableSaveAffiliate = false;
            return false;
        } else if (typeof this.carrier.name !== null && this.carrier.slogan
            !== null && this.carrier.hotLink !== null) {
                return true;
            } else {
                this.loading = false;
                this.alertService.warn('Please fill in all fields');
                this.disableSaveAffiliate = false;
                return false;
            }
    }

    createAffiliate() {
        this.loading = true;
        this.disableSaveAffiliate = true;
        if (this.checkValidation()) {
            this.carrier.companyCarrierId = +localStorage.getItem('userId');
            this.carrierService.post(this.carrier)
                .subscribe(carrier => {
                    this.company.carriers[(Object.keys(this.company.carriers).length)] = carrier['obj'];
                    this.loading = false;
                    this.resetInputs();
                    this.disableSaveAffiliate = false;
                    this.alertService.success('Carrier Added Successfully. Refresh to see the new carrier');
                }, error => {
                    this.loading = false;
                    
                    this.disableSaveAffiliate = false;
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
        }
    }

    editInput(input){
        if (input === 'affiliateHotLink') {
            this.editAffiliateHotLink = true;
        } else if (input === 'affiliateName') {
            this.editAffiliateName = true;
        } else if (input === 'affiliateSlogan') {
            this.editAffiliateSlogan = true;
        }
    }

    getCompany() {
        this.loading = true;
        this.companyService.get()
            .subscribe(company => {
                this.loading = false;
                this.company = company['obj'];
                this.userRetrieved = true;
            }, error =>  {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
                
            });
    }

    onChangeAffiliate(i) {
        if (i !== null) {
            this.editAffiliate = true;
            this.carrier = this.company.carriers[i];
            this.affiliateIndex = i;
        } else {
            this.carrier = new Carrier(null);
        }
    }

    postImage(files: File[], type: string) {
        this.loading = true;
        this.disableUploadAffiliateLogo = true;
        this.uploadService.postImage(this.myFormData)
            .subscribe(file => {
                this.loading = false;
                this.carrier.logo = 'https://s3-us-west-2.amazonaws.com/rent-z/' + file['obj'].file;
                this.affiliateFileUploaded = true;
                this.disableUploadAffiliateLogo = false;
                this.alertService.success('Logo Updated Successfully');
            }, error => {
                this.loading = false;
                this.disableUploadAffiliateLogo = false;
                
                this.alertService.serverError(error.error.errorType, error.error.data);
            })
    }

    toggleInfo() {
        this.show = !this.show;
    }

    updateAffiliate(call) {
        this.loading = true;
        this.disableUpdateAffiliate = true;
        if (call === 'update') {
            if (this.carrier.name !== null && this.carrier.slogan
                !== null && this.carrier.hotLink !== null) {
                this.carrierService.patch(this.carrier)
                    .subscribe(updatedAffiliate => {
                        this.company.carriers[(Object.keys(this.company.carriers).length)] = updatedAffiliate['obj'];
                        this.getCompany();
                        this.loading = false;
                        this.carrier = new Carrier(null, null, null, null, null, null);
                        this.resetInputs();
                        this.disableUpdateAffiliate = false;
                        this.alertService.success('Carrier Added Successfully');
                    }, error => {
                        this.loading = false;
                        this.disableUpdateAffiliate = false;
                        
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
            } else {
                this.loading = false;
                this.alertService.warn('Please fill in all fields');
                this.disableUpdateAffiliate = false;
            }
        } else if (call === 'remove') {
            if (this.affiliateIndex !== null) {
                this.carrierService.delete(this.carrier)
                    .subscribe(message => {
                        this.company.carriers.splice(this.affiliateIndex, 1);
                        this.carrier = new Carrier(null, null, null, null, null, null);
                        this.loading = false;
                        this.resetInputs();
                        this.disableUpdateAffiliate = false;
                        this.alertService.success('Carrier removed successfully');
                    }, error => {
                        this.loading = false;
                        this.disableUpdateAffiliate = false;
                        
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
            } else {
                this.loading = false;
                this.alertService.warn('Please fill in all fields');
                this.disableUpdateAffiliate = false;
            }
        }
    }

    resetInputs() {
        this.carrier.hotLink = null;
        this.carrier.name = null;
        this.carrier.slogan = null;
        this.affiliateFileUploaded = false;
        this.affiliateIndex = null;
        this.editAffiliateHotLink = false;
        this.editAffiliateName = false;
        this.editAffiliateSlogan = false;
        this.editAffiliate = false;
        this.getCompany();
    }

}
