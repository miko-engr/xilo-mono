// tslint:disable
import { Company } from '../models/company.model';

export class Apis {
    apiList: any[] = [];
    constructor() {
        this.apiList = this.prepareApisList();
    }

    prepareApisList(company = new Company(null)) {
        const data: any[] = [];
        for (const key in company) {
            if (key === 'hasEzlynxIntegration') {
                const tempdata = {
                    logo: 'https://xilo.s3-us-west-2.amazonaws.com/ezlynx.png',
                    name: 'EZLynx Rater',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: 'EZLynx provides innovative insurance software that helps streamline your agency’s workflow',
                    settings: {
                        label: 'EZLynx Credentials',
                        vendorName: 'EZLYNX',
                        fields: [
                            {
                                label: 'Username',
                                value: company.ezlynxIntegrationId || '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasCommercialEzlynxIntegration') {
                const tempdata = {
                    logo: 'https://xilo.s3-us-west-2.amazonaws.com/ezlynx.png',
                    name: 'EZLynx Sales Center',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: 'EZLynx provides innovative insurance software that helps streamline your agency’s workflow',
                    settings: {
                        label: 'EZLynx Sales Center Credentials',
                        vendorName: 'COMMERCIAL_EZLYNX',
                        fields: [
                            {
                                label: 'Username',
                                value: company.commercialEzlynxIntegrationId || '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasAMS360Integration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'AMS360',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'AMS360 Credentials',
                        vendorName: 'AMS360',
                        fields: [
                            {
                                label: 'Agency',
                                value: '',
                            },
                            {
                                label: 'Username',
                                value: company.hasNowCertsIntegration || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasHawksoftIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Hawksoft',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                };
                data.push(tempdata);
            }
            if (key === 'pipedriveIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Pipedrive',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        pipedriveUrl: company.pipedriveUrl,
                        pipedriveToken: company.pipedriveToken,
                        pipedrivePipeline: company.pipedrivePipeline,
                        pipedriveStage: company.pipedriveStage,
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasAgencyMatrixIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Agency Matrix',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasApplied') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Applied Rater',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasAppliedEpic') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Applied Epic',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasAgencySoftwareIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Agency Software',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasMyEvo') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'EVO',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasPartnerXE') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Partner XE',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',

                };
                data.push(tempdata);
            }
            if (key === 'hasQQIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'QQ Credentials',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Credentials',
                        vendorName: 'QQ',
                        fields: [
                            {
                                label: 'Username',
                                value: company.qqIntegrationId || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            }
                        ],
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasTurboraterIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Turborater',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Turborater Credentials',
                        vendorName: 'TURBORATER',
                        fields: [
                            {
                                label: 'Account Number',
                                value: company.turboraterIntegrationId || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasQuoteRushIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Quote Rush',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Quote Rush Credentials',
                        vendorName: 'QUOTERUSH',
                        fields: [
                            {
                                label: 'Username',
                                value: company.quoteRushIntegrationId || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasCabrilloIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Cabrillo',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Cabrillo Credentials',
                        vendorName: 'CABRILLO',
                        fields: [
                            {
                                label: 'Username',
                                value: company.quoteRushIntegrationId || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasAppulateIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Appulate',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Appulate Credentials',
                        vendorName: 'APPULATE',
                        fields: [
                            {
                                label: 'Username',
                                value: company.hasAppulateIntegration || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasNowCertsIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'NowCerts',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'NowCerts Credentials',
                        vendorName: 'NOWCERTS',
                        fields: [
                            {
                                label: 'Username',
                                value: company.hasNowCertsIntegration || '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasWealthboxIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Wealthbox',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Wealthbox Credentials',
                        vendorName: 'WEALTHBOX',
                        fields: [
                            {
                                label: 'Token',
                                value: company.hasAMS360Integration || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasRicochet') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Ricochet',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Ricochet Credentials',
                        vendorName: 'RICOCHET',
                        fields: [
                            {
                                label: 'Token',
                                value: company.hasRicochet || '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }
            if (key === 'hasCarrierIntegrations') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Custom Rates',
                    key: key,
                    values: company[key],
                    type: 'Agency System',
                    description: '',
                    settings: {
                        label: 'Add Custom Rates',
                        vendorName: 'RATER',
                        fields: [
                            {
                                label: 'State (2-letters)',
                                value: '',
                            },
                            {
                                label: 'Carrier',
                                value: '',
                            },
                            {
                                label: 'Username',
                                value: '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                        ],
                    }

                };
                data.push(tempdata);
            }

            // marketing
            if (key === 'facebookApiKey') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Facebook',
                    key: key,
                    values: company[key] ? true : false,
                    type: 'marketing',
                    description: '',
                    settings: {
                        label: 'Api Key',
                        vendorName: 'FACEBOOK',
                        fields: [
                            {
                                label: 'Api Key',
                                value: '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasGoogleEvents') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Google Events',
                    key: key,
                    values: company[key],
                    type: 'marketing',
                    description: '',
                    settings: {
                        label: 'Google Analytics Id',
                        vendorName: 'GOOGLEEVENTS',
                        value: company.googleAnalyticsId || '',
                        fields: [
                            {
                                label: 'Analytics Id',
                                value: company.googleAnalyticsId || '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            if (key === 'hasGoogleConversions') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Google Conversions',
                    key: key,
                    values: company[key],
                    type: 'marketing',
                    description: '',
                    settings: {
                        label: 'Authorize Google',
                        vendorName: 'GOOGLECONVERSIONS',
                        fields: [
                            {
                                label: 'Authorize Google',
                                value: '',
                                action: 'click',
                            },
                            {
                                label: 'Adwords Customer ID',
                                value: '',
                            },
                            {
                                label: 'Analytics View Id',
                                value: '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }
            // salesforce
            if (key === 'hasSalesforce') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Salesforce',
                    key: key,
                    values: company[key],
                    type: 'Salesforce',
                    description: '',
                    settings: {
                        label: 'Salesforce Credentials',
                        value: company.salesforceIntegrationId || '',
                        vendorName: 'SF',
                        fields: [
                            {
                                label: 'Username',
                                value: '',
                            },
                            {
                                label: 'Password',
                                value: '',
                            },
                            {
                                label: 'Token',
                                value: '',
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }

            if (key === 'hubspotIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Hubspot',
                    key: key,
                    values: company[key],
                    type: 'Hubspot',
                    vendorName: 'HUBSPOT',
                    description: '',
                    settings: {
                        label: 'HubSpot API Key',
                        fields: [
                            {
                                label: 'HubSpot API Key',
                                value: company.hubspotApiKey,
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }

            if (key === 'hasInfusionsoftIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'Infusionsoft',
                    key: key,
                    values: company[key],
                    type: 'Infusionsoft',
                    vendorName: 'INFUSIONSOFT',
                    description: '',
                    settings: {
                        label: 'Authorize Infusionsoft',
                        fields: [
                            {
                                label: 'Authorize Infusionsoft',
                                value: '',
                                action: 'click'
                            },
                        ]
                    }
                };
                data.push(tempdata);
            }

            if (key === 'hasUSDotIntegration') {
                const tempdata = {
                    logo: 'assets/logo.png',
                    name: 'USDOT',
                    key: key,
                    values: company[key],
                    type: 'USDOT',
                    description: '',
                    settings: {
                        vendorName: 'USDOT'
                    }
                };
                data.push(tempdata);
            }
        }
        return data;
    }
}