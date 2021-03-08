/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertControllerService } from '../../../services/alert.service';
import { ApiService } from '../../../services/api.service';
import { InfusionsoftService } from '../../../services/infusionsoft.service';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LogService } from '../../../services/log.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VendorDialog } from '../../../shared/dialogs/vendor/vendor.component';
import { VendorService } from '../../../services/vendor.service';
import { PipedriveService } from '../../../services/pipedrive.service';
import { IntegrationService } from '../../../services/integration.service';
import { AllServicesModalComponent } from './all-services-modal/all-services-modal.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-api',
    templateUrl: './api.component.html',
    styleUrls: ['../business.component.css']
})
export class ApiComponent implements OnInit, OnDestroy {
    integrationtype = 'Integrated APIs';
    private subscription = new Subscription();
    dialogRef: MatDialogRef<AllServicesModalComponent, any>;
    dialogOpen: Boolean = false;
    editInputs = true;
    company = new Company(null);
    tempcompany: any;
    apiList: any[] = [];
    integrationsList: any[] = [];
    serviceList: any[] = [];
    loading = false;
    user = new User(null);
    agencyName: string;
    userRetrieved = false;
    googleAuthUrl;
    outlookAuthUrl;
    infusionsoftAuthUrl = null;
    isUnsaved: Boolean = false;
    vendor = { carrier: null, vendorName: null, state: null, username: null, password: null, accessToken: null };

    constructor(
        private alertService: AlertControllerService,
        private apiService: ApiService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private integrationService: IntegrationService,
        private logService: LogService,
        private pipedriveService: PipedriveService,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private vendorService: VendorService,
        private infusionsoftService: InfusionsoftService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
          
        this.subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
              this.router.navigated = false;
            }
        });
     }

    ngOnInit() {
        this.getCompany();
        this.integrateAPI();
        if (this.router.url.includes('infusionsoft')) {
            this.authorize();
        }
        if (this.router.url.includes('google')) {
            this.authorizeGoogle();
        }
        this.getAuthUrl();
        this.getGoogleAuthUrl();
        this.updateVendorData();
        this.getOutlookAuthUrl()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    openDialog(vendor: string) {
        const dialogRef = this.dialog.open(VendorDialog, {
            width: 'auto',
            data: { vendorName: vendor }
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            await this.upsertVendor(result);
        });
    }

    updateVendorData() {
        this.vendorService.updateVender.subscribe(res => {
            this.upsertVendor(res);
        })
    }

    async upsertVendor(vendor: any) {
        this.loading = true;

        if (typeof vendor !== 'undefined' && vendor.completed) {
            this.vendor = vendor;
            if (this.vendor.vendorName === 'RATER') {
                this.vendor.vendorName = this.vendor.carrier.toUpperCase() || '';
            } else {
                this.vendor.vendorName = this.vendor.vendorName.toUpperCase() || '';
            }
            this.vendorService.upsertVendor(vendor)
                .subscribe(async (data: any) => {
                    this.loading = false;
                    this.logService.success('Credentials Added Successfully');
                    this.vendor = { carrier: null, vendorName: null, username: null, state: null, password: null, accessToken: null };

                    if (data.status === 'create' && vendor.vendorName === 'TURBORATER') {
                        this.company.turboraterIntegrationId = data.newVendorID;
                    }
                    if (vendor.vendorName === 'QUOTERUSH' && data.status === 'create') {
                        this.company.quoteRushIntegrationId = data.newVendorID;
                    }
                    if (vendor.vendorName === 'CABRILLO' && data.status === 'create') {
                        this.company.cabrilloIntegrationId = data.newVendorID;
                    }
                }, error => {
                    this.loading = false;
                    this.logService.console(error, true);
                });
        }
        this.loading = false; // when vendor is undefined

    }

    async updateAMSDetails() {
        this.loading = true;
        try {
            const details = await this.integrationService.updateAMSDetails();
            this.logService.success('AMS Details Updated');
            this.loading = false;
        } catch (error) {
            this.logService.console(error, false);
            this.loading = false;
        }
    }

    authorizeGoogle() {
        this.route.queryParams.subscribe(params => {
            if (params.code) {
                this.apiService.authorizeGoogle(params.code)
                    .subscribe(data => {
                        this.alertService.success('Google Authorization Successful', true);
                        this.router.navigate([], { queryParams: { code: null } });
                    }, (error) => {
                        this.alertService.error('Google Authorization Error');
                    });
            }

            if (params.error) {
                this.alertService.error('Google Authorization Denied', true);
                this.router.navigate([], { queryParams: { error: null } });
            }
        });
    }

    getGoogleAuthUrl() {
        this.apiService.getGoogleAuthUrl()
            .subscribe(data => {
                this.googleAuthUrl = data;
            }, error => {
                this.alertService.error('Error with the Google authentication url');
            });
    }

    getOutlookAuthUrl() {
        this.apiService.getOutlookAuthUrl()
            .subscribe(data => {
                this.outlookAuthUrl = data;
            }, error => {
                this.alertService.error('Error with the outlook authentication url');
            });
    }

    authorize() {
        this.route.queryParams.subscribe(params => {
            if (params.code) {
                this.infusionsoftService.authorizeInfusionsoft(params.code)
                    .subscribe(data => {
                        this.logService.success('Infusionsoft authorization successful');
                        this.router.navigate([], { queryParams: { code: null } });
                    }, (error) => {
                        this.logService.console('Infusionsoft Authorization Error', true);
                    });
            }

            if (params.error) {
                this.logService.console('Infusionsoft Authorization Denied', true);
                this.router.navigate([], { queryParams: { error: null } });
            }
        });
    }

    getAuthUrl() {
        this.infusionsoftService.getAuthUrl()
            .subscribe(data => {
                this.infusionsoftAuthUrl = data['uri'];
            }, error => {
                this.alertService.error('Error with the infusionsoft authentication url');
            });
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
                        this.setApiData(company);
                        this.userRetrieved = true;
                    }, error => {
                        this.loading = false;

                        if (error) {
                            localStorage.clear();
                            this.router.navigate(['/auth/login']);
                        }
                        this.alertService.serverError(error.error.errorType, error.error.data);
                    });
            });
    }

    setApiData(company) {
        this.company = company['obj'];
        this.agencyName = (this.company.name !== null) ? this.company.name.replace(/\s+/g, '-') : '';
        this.prepareApiIntegration();
    }

    // Allows the company to edit inputs by clicking edit button
    onEditInputs() {
        this.editInputs = !this.editInputs;
    }

    styleGroups() {
        if (this.editInputs === true) {
            return { 'margin-bottom': '37px' };
        }
    }

    resetInputs() {
        this.isUnsaved = false;
        // this.editInputs = false;
        const data = JSON.parse(JSON.stringify(this.tempcompany));
        this.setApiData(data);
    }

    returnGoogleUrl() {
        if (this.googleAuthUrl && this.googleAuthUrl.url) {
            return this.googleAuthUrl.url;
        } else {
            return '#';
        }
    }

    updateCompany(updatePipedrive: boolean) {
        this.loading = true;
        if (this.company.hasEzlynxIntegration ||
                this.company.hasHawksoftIntegration ||
                this.company.hasCommercialEzlynxIntegration ||
                this.company.hasPLRater) {
            this.company.hasV2Integrations = true;
        }
        this.companyService.patch(this.company)
            .subscribe(updatedCompany => {
                this.loading = false;
                // this.onEditInputs();
                if (updatePipedrive && this.company.pipedriveToken) {
                    this.updatePipedrive();
                }
                // this.editInputs = false;
                const data = {
                    obj: this.company,
                };
                this.tempcompany = JSON.parse(JSON.stringify(data));
                this.resetInputs();
                this.alertService.success('Profile Updated Successfully');
            }, error => {
                this.loading = false;
                this.alertService.serverError(error.error.errorType, error.error.data);
            });
    }

    async updatePipedrive() {
        if (this.company.pipedrivePipeline) {
            const data = await this.pipedriveService.getPipedrivePipelines(this.company.pipedriveToken);
        }
        if (this.company.pipedriveStage) {
            const data = await this.pipedriveService.getPipedriveStages(this.company.pipedriveToken);
        }
    }

    isUnsavedData() {
        this.isUnsaved = true;
    }

    openAllServices() {
        this.dialogOpen = true;
        this.dialogRef = this.dialog.open(AllServicesModalComponent, {
            width: '60rem',
            panelClass: 'dialog',
            data: this.apiList,
        });
        this.dialogRef.afterClosed().subscribe((results) => {
            this.dialogOpen = false;
        });
    }

    async prepareApiIntegration() {
        const data: any[] = [];
        for (const key in this.company) {
            if (key === 'hasGoogleIntegration') {
                this.getGoogleAuthUrl();
                const isAuthorized = !this.company.googleApiAccessToken ? false : true;
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    url: this.googleAuthUrl.url,
                    isAuthorized,
                    name: 'Gmail API',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                }
                data.push(tempdata);
            }
            if (key === 'hasOutlookIntegration') {
                const isAuthorized = !this.company.outlookAccessToken ? false : true;
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    isAuthorized,
                    name: 'Outlook API',
                    url: this.outlookAuthUrl,
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                }
                data.push(tempdata);
            }
            if (key === 'hasEzlynxIntegration') {
                const tempdata = {
                    logo:  'https://xilo.s3-us-west-2.amazonaws.com/ezlynx.png',
                    name: 'EZLynx Rater',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: 'EZLynx provides innovative insurance software that helps streamline your agency’s workflow',
                    settings: {
                        label : 'EZLynx Credentials',
                        vendorName : 'EZLYNX',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.ezlynxIntegrationId || '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasCommercialEzlynxIntegration') {
                const tempdata = {
                    logo:  'https://xilo.s3-us-west-2.amazonaws.com/ezlynx.png',
                    name: 'EZLynx Sales Center',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: 'EZLynx provides innovative insurance software that helps streamline your agency’s workflow',
                    settings: {
                        label : 'EZLynx Sales Center Credentials',
                        vendorName : 'COMMERCIAL_EZLYNX',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.commercialEzlynxIntegrationId || '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasAMS360Integration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'AMS360',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'AMS360 Credentials',
                        vendorName : 'AMS360',
                        fields: [
                            {
                                label : 'Agency',
                                value : '',
                            },
                            {
                                label : 'Username',
                                value : this.company.hasNowCertsIntegration || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasXanatekIntegration') {
                const tempdata = {
                    logo:  'https://i.ibb.co/PMGJHRK/Xanatek-logo-Aug2016-Color-e1521753029921.jpg',
                    name: 'Xanatek',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                };
                data.push(tempdata);
            }
            if (key === 'hasHawksoftIntegration') {
                // const tempdata = {
                //     logo:  'https://xilo-s3.s3-us-west-2.amazonaws.com/hawksoft.png',
                //     name: 'Hawksoft',
                //     key: key,
                //     values: this.company[key],
                //     type: 'Agency System',
                //     description: 'Since 1995, HawkSoft is a leader in management systems for agencies that want effective workflows and a delightful experience for staff and policyholders',
                //     settings: {
                //         label : 'Connect Hawksoft to a Form',
                //         vendorName : 'EZLYNX',
                //         fields: [
                //             {
                //                 label : 'Username',
                //                 value : this.company.ezlynxIntegrationId || '',
                //             }
                //         ],
                //     }
                // };
                const tempdata = {
                    logo:  'https://xilo-s3.s3-us-west-2.amazonaws.com/hawksoft.png',
                    name: 'Hawksoft',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                };
                data.push(tempdata);
            }
            if (key === 'hasBetterAgency') {
                const tempdata = {
                    logo:  '../../../assets/better.png',
                    name: 'Better Agency',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: 'Hassle Free. Fully Automate Your Agency',
                };
                data.push(tempdata);
            }
            if (key === 'pipedriveIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Pipedrive',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings : {
                        pipedriveUrl: this.company.pipedriveUrl,
                        pipedriveToken: this.company.pipedriveToken,
                        pipedrivePipeline: this.company.pipedrivePipeline,
                        pipedriveStage: this.company.pipedriveStage,
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasAgencyMatrixIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Agency Matrix',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasApplied') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Applied Rater',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasAppliedEpic') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Applied Epic',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasPLRater') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'PL Rater',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Token',
                        vendorName : 'PLRATER',
                        fields: [
                            {
                                label : 'Api Key',
                                value : '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasAgencySoftwareIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Agency Software',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasMyEvo') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'EVO',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasPartnerXE') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Partner XE',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasQQIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'QQ Credentials',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Credentials',
                        vendorName : 'QQ',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.qqIntegrationId || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasTurboraterIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Turborater',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Turborater Credentials',
                        vendorName : 'TURBORATER',
                        fields: [
                            {
                                label : 'Account Number',
                                value : this.company.turboraterIntegrationId || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasQuoteRushIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Quote Rush',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Quote Rush Credentials',
                        vendorName : 'QUOTERUSH',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.quoteRushIntegrationId || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasCabrilloIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Cabrillo',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Cabrillo Credentials',
                        vendorName : 'CABRILLO',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.quoteRushIntegrationId || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasAppulateIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Appulate',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Appulate Credentials',
                        vendorName : 'APPULATE',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.hasAppulateIntegration || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasNowCertsIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'NowCerts',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'NowCerts Credentials',
                        vendorName : 'NOWCERTS',
                        fields: [
                            {
                                label : 'Username',
                                value : this.company.hasNowCertsIntegration || '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasWealthboxIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Wealthbox',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Wealthbox Credentials',
                        vendorName : 'WEALTHBOX',
                        fields: [
                            {
                                label : 'Token',
                                value : this.company.hasAMS360Integration || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasRicochet') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Ricochet',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Ricochet Credentials',
                        vendorName : 'RICOCHET',
                        fields: [
                            {
                                label : 'Token',
                                value : this.company.hasRicochet || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasCarrierIntegrations') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Custom Rates',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : 'Add Custom Rates',
                        vendorName : 'RATER',
                        fields: [
                            {
                                label : 'State (2-letters)',
                                value : '',
                            },
                            {
                                label : 'Carrier',
                                value : '',
                            },
                            {
                                label : 'Username',
                                value : '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasZapier') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Zapier',
                    key: key,
                    values: this.company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label : '',
                        vendorName: 'ZAPIER',
                        fields: []
                    }
                };
                data.push(tempdata);
            }

            // marketing
            if (key === 'facebookApiKey') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Facebook',
                    key: key,
                    values: this.company[key],
                    type: 'marketing',
                    description: '',
                    settings: {
                        label : 'Api Key',
                        vendorName: 'FACEBOOK',
                        fields: [
                            {
                                label : 'Api Key',
                                value : '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasGoogleEvents') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Google Events',
                    key: key,
                    values: this.company[key],
                    type: 'marketing',
                    description: '',
                    settings: {
                        label : 'Google Analytics Id',
                        vendorName: 'GOOGLEEVENTS',
                        value : this.company.googleAnalyticsId || '',
                        fields: [
                            {
                                label : 'Analytics Id',
                                value : this.company.googleAnalyticsId || '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasGoogleConversions') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Google Conversions',
                    key: key,
                    values: this.company[key],
                    type: 'marketing',
                    description: '',
                    settings: {
                        label : 'Authorize Google',
                        vendorName: 'GOOGLECONVERSIONS',
                        fields: [
                            {
                                label : 'Authorize Google',
                                value : '',
                                action: 'click',
                            },
                            {
                                label : 'Adwords Customer ID',
                                value : '',
                            },
                            {
                                label : 'Analytics View Id',
                                value : '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            // salesforce
            if (key === 'hasSalesforce') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Salesforce',
                    key: key,
                    values: this.company[key],
                    type: 'Salesforce',
                    description: '',
                    settings: {
                        label : 'Salesforce Credentials',
                        value : this.company.salesforceIntegrationId || '',
                        vendorName : 'SF',
                        fields: [
                            {
                                label : 'Username',
                                value : '',
                            },
                            {
                                label : 'Password',
                                value : '',
                            },
                            {
                                label : 'Token',
                                value : '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }

            if (key === 'hubspotIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Hubspot',
                    key: key,
                    values: this.company[key],
                    type: 'Hubspot',
                    vendorName: 'HUBSPOT',
                    description: '',
                    settings: {
                        label : 'HubSpot API Key',
                        fields: [
                            {
                                label : 'HubSpot API Key',
                                value : this.company.hubspotApiKey,
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
           
            if (key === 'hasInfusionsoftIntegration') {
                let tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'Infusionsoft',
                    key: key,
                    values: this.company[key],
                    type: 'Infusionsoft',
                    vendorName: null,
                    description: '',
                    isAuthorized: this.company.hasInfusionsoftIntegration && this.company.infusionsoftApiAccessToken !== null,
                    isValidToken: false,
                    url: this.infusionsoftAuthUrl,
                    settings: {
                        label : 'Authorize Infusionsoft',
                        fields: [
                            {
                                label : 'Authorize Infusionsoft',
                                value : '',
                                isButton: true,
                                action: 'click'
                            },
                        ]
                    }
                };

                await this.infusionsoftService.validateToken(this.company.id).subscribe((result: any) => {
                    tempdata.isValidToken = result.status;  
                })
                data.push(tempdata);
            }

            if (key === 'hasUSDotIntegration') {
                const tempdata = {
                    logo:  '../../../assets/logo.png',
                    name: 'USDOT',
                    key: key,
                    values: this.company[key],
                    type: 'USDOT',
                    description: '',
                    settings: {
                        vendorName: 'USDOT'
                    }

                };
                data.push(tempdata);
            }
        }
        this.apiList = data;
        this.integrationsList = this.apiList.filter(item => (item.values || item.values === 'true'));
        this.serviceList = this.apiList.filter(item => item.values === false);
        this.integrationsList.sort((a,b) => a.name.localeCompare(b.name));
        this.serviceList.sort((a,b) => a.name.localeCompare(b.name));
        if (this.dialogOpen) {
            this.dialogRef.close();
            this.dialogRef.componentInstance.data = this.serviceList;
        }
    }

    integrateAPI() {
        const subscription = this.companyService.integrate.subscribe(res => {
            this.company[res.key] = res.values;
            if (res.name === 'Pipedrive' && (res.values === true || res.values === 'true')) {
                for (const key in res.settings) {
                    this.company[key] = res.settings[key];
                }
            }
            this.updateCompany(res.name === 'Pipedrive');
        });
        this.subscription.add(subscription);
    }

}
