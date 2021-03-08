import { Component, OnInit, HostListener } from '@angular/core';
import {CarrierService} from "../../services/carrier.service";
import {UploadService} from "../../services/upload.service";
import {AlertControllerService} from "../../services/alert.service";
import { Router } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';


@Component({
    selector: 'app-business',
    templateUrl: './business.component.html',
    styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
    // Business variables
    isMobile:Boolean = false;
    apiTabActive = false;
    brandingTabActive = false;
    companyTabActive = true;
    company = new Company(null);
    editBrandColor = false;
    editInputs = false;
    emailTabActive = false;
    estimationTabActive = false;
    disableSaveUser = false;
    disableUploadLogo = false;
    loading = false;
    userRetrieved = false;
    totalScoreWarning = false;

    // File upload
    myFormData: FormData;
    user = new User(null);
    userFileUploaded = false;
    userFiles;

    agencyName: string;

    constructor(
        private carrierService: CarrierService,
        private companyService: CompanyService,
        private alertService: AlertControllerService,
        private apiService: ApiService,
        private router: Router,
        private uploadService: UploadService,
        private userService: UserService
    ) {
        this.isModbileDevice(window.screen.width);
    }

    ngOnInit() {
        this.getCompany();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const len = event.target.innerWidth;
        this.isModbileDevice(len);
    }

    isModbileDevice(len) {
        if (len && len < 600) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
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
                        this.company = company['obj'];
                        this.agencyName = (this.company.name !== null) ? this.company.name.replace(/\s+/g, '-') : '';
                        this.userRetrieved = true;
                    }, error =>  {
                        this.loading = false;
                        
                        if (error) {
                            localStorage.clear();
                            this.router.navigate(['/auth/login']);
                        }
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
            })
    }

    // Allows the company to edit inputs by clicking edit button
    onEditInputs() {
        this.editInputs = !this.editInputs;
    }

    postImage(files: File[], type: string) {
        this.loading = true;
        this.disableUploadLogo = true;
        this.uploadService.postImage(this.myFormData)
            .subscribe(file => {
                this.loading = false;
                this.company.logo = 'https://s3-us-west-2.amazonaws.com/rent-z/' + file['obj'].file;
                this.userFileUploaded = true;
                this.disableUploadLogo = false;
                this.userFiles = null;
                this.updateCompany();
            }, error => {
                this.loading = false;
                this.disableUploadLogo = false;
                
                this.alertService.serverError(error.error.errorType, error.error.data);
            })
    }

    resetInputs() {
        this.editInputs = false;
        this.editBrandColor = false;
    }

    updateCompany() {
        this.loading = true;
        this.disableSaveUser = true;
            this.companyService.patch(this.company)
                .subscribe(updatedCompany => {
                    this.company = updatedCompany['obj'];
                    this.loading = false;
                    this.onEditInputs();
                    this.disableSaveUser = false;
                    this.editBrandColor = false;
                    this.editInputs = false;
                    this.alertService.success('Profile Updated Successfully');
                }, error => {
                    this.loading = false;
                    
                    this.disableSaveUser = false;
                    this.alertService.serverError(error.error.errorType, error.error.data);
                });
    }

    styleGroups() {
        if (this.editInputs === true) {
            return {'margin-bottom': '37px'};
        }
    }

    // Styles the tabs with a border bottom
    styleTabs(style: boolean) {
        if (style === true) {
            return {'border-bottom': '4px solid #7c7fff', 'color': '#000'};
        }
    }

}
