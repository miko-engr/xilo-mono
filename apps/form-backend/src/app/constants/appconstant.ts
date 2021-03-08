const nodeEnv = process.env.NODE_ENV;
const ROOT_PATH = process.cwd();

let dashboardUrl;
let xiloCompanyId;
let xiloAuthUrl;
let outlookRedirectURI = null;

let allowedOriginsList = [
  'https://app.xilo.io',
  'https://dashboard.xilo.io',
  'https://xilo-cron.herokuapp.com',
  'https://insurance.xilo.io',
];

if (nodeEnv === 'local') {
  dashboardUrl = 'http://localhost:4100';
  xiloCompanyId = '5';
  xiloAuthUrl = 'http://localhost:4000';
  outlookRedirectURI = 'http://localhost:4100/profile/business/api/outlook';
  allowedOriginsList = [
    'http://localhost:4200',
    'http://localhost:4100',
    'http://localhost:8080',
    'http://localhost:4300'
  ]
}

if (nodeEnv === 'production') {
  dashboardUrl = 'https://dashboard.xilo.io';
  xiloCompanyId = '5';
  xiloAuthUrl = 'https://xilo-auth.herokuapp.com';
  outlookRedirectURI = 'https://dashboard.xilo.io/profile/business/api/outlook';
}

if (nodeEnv === 'development') {
  dashboardUrl = 'https://xilo-dev-dashboard.herokuapp.com';
  xiloCompanyId = '3';
  xiloAuthUrl = 'https://xilo-dev-auth.herokuapp.com';
  outlookRedirectURI =
    'https://xilo-dev-dashboard.herokuapp.com/profile/business/api/outlook';
  allowedOriginsList = [
    'https://xilo-dev-forms.herokuapp.com',
    'https://xilo-dev-dashboard.herokuapp.com',
    'https://xilo-dev-cron.herokuapp.com',
  ]
}

if (nodeEnv === 'staging') {
  dashboardUrl = 'https://xilo-staging-dashboard.herokuapp.com';
  xiloCompanyId = '1';
  xiloAuthUrl = 'https://xilo-staging-auth.herokuapp.com/';
  outlookRedirectURI =
    'https://xilo-staging-dashboard.herokuapp.com/profile/business/api/outlook';
  allowedOriginsList = [
    'https://xilo-staging-forms.herokuapp.com',
    'https://xilo-staging-forms-v2.herokuapp.com',
    'https://xilo-staging-dashboard.herokuapp.com',
    'https://xilo-staging-cron.herokuapp.com',
    'http://localhost:4200',
  ]
}

export const allowedOrigins = allowedOriginsList;

export const mediums = {
  SEARCH: 'SEARCH',
  INTERNAL: 'INTERNAL',
  UNKNOWN: 'UNKNOWN',
  EMAIL: 'EMAIL',
};

export const ipGeoAPI =
  'https://api.ipgeolocation.io/ipgeo?apiKey=828e03cd47324c3a9825aae3985a3b61';

export const searchDomain = [
  'google',
  'yahoo',
  'bing',
  'ask',
  'duckduckgo',
  'lycos',
];

export const infusionSoft = {
  infusionSoftRedirectURI: dashboardUrl + '/profile/business/api',
  apiUrl: 'https://api.infusionsoft.com/crm/rest',
  infusionsoftClientId:
    process.env.INFUSIONSOFTCLIENTID || '54bujc766wfq485u84ymmeu3',
  infusionsoftClientSecret:
    process.env.INFUSIONSOFTCLIENTSECRET || 'QjjsABGZTS',
};

export const awsCredential = {
  accessKeyId: 'AKIAVCIO2QK67Q2PAAEE',
  secretAccessKey: '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',
  region: 'us-west-2',
  s3BaseURL: 'https://rent-z.s3.us-west-2.amazonaws.com/',
};

export const vendorsNames = {
  VENDOR_QQ: 'QQ',
  VENDOR_SALSEFORCE: 'SF',
  VENDOR_PROGRESSIVE_RATER: 'PROGRESSIVE',
  VENDOR_CSE_RATER: 'CSECA',
  VENDOR_NATIONAL_GENERAL_AL_RATER: 'NATIONALGENERAL',
  SAFECO_AL_RATER: 'SAFECO',
  VENDOR_EZLYNX: 'EZLYNX',
  VENDOR_RICOCHET: 'RICOCHET',
  ALL_STATE_RATER: 'ALLSTATE',
  TRAVELER_RATER: 'TRAVELER',
  ERIE_RATER: 'ERIE',
  VENDOR_QUOTERUSH: 'QUOTERUSH',
  VENDOR_CABRILLO: 'CABRILLO',
  VENDOR_TURBO_RATER: 'TURBORATER',
  VENDOR_NOWCERTS: 'NOWCERTS',
  VENDOR_APPULATE: 'APPULATE',
  VENDOR_STATEAUTO: 'STATEAUTO',
  VENDOR_AMS360: 'AMS360',
  VENDOR_COMMERCIAL_EZLYNX: 'COMMERCIAL_EZLYNX',
  VENDOR_WEALTHBOX: 'WEALTHBOX',
};

export const xiloAuthurl = xiloAuthUrl;

export const encryption = {
  key: `+UxJJpox@]vE7eC!"Gb!'iC#'n.@0%jcAhZ~N_5F#-][&{~jADZA5f_QmXjsAgsaB%~7uuBp!3#4@'JpZ;108-#0V}P^^Hffmm8fzV7lMr98_KkGKV%<hwx1;wA`,
};

export const al3Parser = {
  xiloParserAccessToken: '',
  xiloParserendpoint: '',
  XILO_PARSER_ACCESS_TOKEN: process.env.XILO_PARSER_ACCESS_TOKEN,
  XILO_PARSER_ENDPOINT: process.env.XILO_PARSER_ENDPOINT,
};

export const stripe = {
  stripeTestKey: 'sk_test_vrpeLvfEHKaSt4K5M4FnyrHI',
  stripePTestKey: 'pk_test_8BZV1HDVmH7VBumHF1NwswJv',
  stripeKey: process.env.STRIPE_KEY,
  stripePKey: process.env.STRIPE_P_KEY,
  stripeSecretKey: process.env.stripeSecretKey,
  xiloParserEndpoint: process.env.xiloParserEndpoint,
};

export const XILO_COMPANY_ID = xiloCompanyId;

export const DASHBOARD_URL = dashboardUrl;

export const zillow = {
  zswid: 'X1-ZWz17ge35qaxaj_7aoby',
};

export const DOCUSIGN = {
  templateId: '5b1fd55b-f583-4b22-b62d-207fe9cdf7d8',
  accountId: '109465160',
  basePath: 'https://www.docusign.net/restapi',
  basePathFortoken: 'https://account.docusign.com',
  integratorKey: '000926df-0aeb-4443-b5c5-1da441267ebf',
  clientSecret: 'cb52b5b8-2377-4f23-a198-9b207cfe6dd1',
  clientId: '000926df-0aeb-4443-b5c5-1da441267ebf',
};

export const sendGrid = {
  FROM_EMAIL: 'customer-success@xilo.io',
  SENDGRID_API_KEY:
    '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'
};

export const nodeMailer = {
  EMAIL: 'customer-success@xilo.io',
  PAW: 'tothetop!123@',
};

export const emailTemplate = {
  ERROR_LOG: `${ROOT_PATH}/apps/form-backend/src/app/constants/templates/emailLogging.html`,
  INVITATION_MAIL: `${ROOT_PATH}/apps/form-backend/src/app/constants/templates/sendInvitationMail.html`,
};

export const GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URL: null,
  GOOGLE_DEV_TOKEN: process.env.GOOGLE_DEV_TOKEN,
};

export const ezLynx = {
  USERNAME: 'wxi_uploadPROD',
  PASSWORD: 'Cojoanin93',
  USERNAME_DEV: 'xi_uploadUAT',
  GET_AUTO_YEARS_ACTION: 'http://www.ezlynx.com/getAutoYears',
  GET_AUTO_MODELS_ACTION: 'http://www.ezlynx.com/getAutoModels',
  GET_AUTO_SUB_MODELS_ACTION: 'http://www.ezlynx.com/getAutoSubModels',
  GET_AUTO_MAKES_ACTION: 'http://www.ezlynx.com/getAutoMakes',
  GET_VIN_ACTION: 'http://www.ezlynx.com/VINValidate',
  GET_VEHICLES_PATH_DEV:
    'https://uat.webcetera.com/EzLynxWebService/EZLynxVin.asmx',
  GET_VEHICLES_PATH:
    'https://services.ezlynx.com/EzLynxWebService/EZLynxVin.asmx',
};

export const CONFIG = {
  nodeEnv: process.env.NODE_ENV,
  apiUrl: process.env.APIURL,
  infusionsoftClientId:
    process.env.INFUSIONSOFTCLIENTID || '54bujc766wfq485u84ymmeu3',
  infusionsoftClientSecret:
    process.env.INFUSIONSOFTCLIENTSECRET || 'QjjsABGZTS',
};

export const vapidKeys = {
  publicKey: 'BKMmPypsmpRWfpNEqlHYOUU0XzNwJ5AwExSY5fF_xjCDTEQ8',
  privateKey: 'aeL4qRfnLMEulPLoTSaqswwhHCFRMxGMGFpXqJJfLCs',
};

export const courierEventids = {
  NEWLEAD: 'QPSGG60K5PMNHPQVFFZ98V0CCXV6',
  ASSIGNEDLEAD: '12FYAWS8K9MP5SPZ2H7BTK3QY77Z',
  FINISHEDFORM: 'BNZN7C8HNYM3GAHSVRWVRCYY48CJ',
};

export const OUTLOOK = {
  CLIENT_ID: process.env.OUTLOOK_CLIENT_ID,
  CLIENT_SECRET: process.env.OUTLOOK_CLIENT_SECRET,
  REDIRECT_URL: outlookRedirectURI,
};

export const twilioConfig = {
  ACCT_SID: 'ACbcc09cc4d230d0dea44c997ddf288f99',
  AUTH_TOKEN: 'fa57001cbd1edcf927e3425b1a427090',
  DEFAULT_FROM_NO: '+16193042302',
}

export const keen = {
  PROJECT_ID: '5c04243fc9e77c0001255923',
  READ_KEY:
    '9048C861326C10564919E9C0C4FD0B19805A21DBBD636F760520792F6838998E30947A7D743FF0605DC602658AE04A376A69517AFE592ADC773009E21A89EE2655271D472AF132B48436C658A78ED16C4330E5584818194D856E7E055F0D3434',
};


export const redisUrl = 'redis://rediscloud:MW6Mz09aDAF7BVBtqvvR6bBuFXW4oFGI@redis-15962.c14.us-east-1-3.ec2.cloud.redislabs.com:15962';
