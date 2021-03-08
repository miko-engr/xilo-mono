export const commercial = [
    {
      "parentGroup": "Client",
      "element": "Business Type",
      "referenceId": "gen_bBusinessType",
      "Possible Values": "Char",
      "Notes": "C = Corporation; D = Individual/Sole Proprietor; F = Family Trust; J = Joint Venture; L = LLC; N = Not For Profit; P = Partnership; S = Subchapter S"
    },
    {
      "parentGroup": "Client",
      "element": "Customer Type",
      "referenceId": "gen_sCustType",
      "Possible Values": "String",
      "Notes": "Possible values are: Commercial; Life; Donotmarket; Personal; Crosssell"
    },
    {
      "parentGroup": "Client",
      "element": "Business Name",
      "referenceId": "gen_sBusinessName",
      "Possible Values": "(Max Length = 60 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "DBA Name",
      "referenceId": "gen_sDBAName",
      "Possible Values": "(Max Length = 60 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Last Name",
      "referenceId": "gen_sLastName",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "First Name",
      "referenceId": "gen_sFirstName",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Middle Name",
      "referenceId": "gen_cInitial",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Address",
      "referenceId": "gen_sAddress1",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "City",
      "referenceId": "gen_sCity",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "State",
      "referenceId": "gen_sState",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Zip",
      "referenceId": "gen_sZip",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Business FEIN",
      "referenceId": "gen_sFEIN",
      "Possible Values": "(Max length = 9 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Business License Number",
      "referenceId": "gen_sBusinessLicense",
      "Possible Values": "(Max length = 30 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Customer Source",
      "referenceId": "gen_sClientSource",
      "Possible Values": "(Max length = 14 characters)",
      "Notes": "examples: Phone Book, Newspaper, Radio"
    },
    {
      "parentGroup": "Client",
      "element": "Free form notes on client",
      "referenceId": "gen_sClientNotes",
      "Possible Values": "(Max length = 30,000 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "NAICS number",
      "referenceId": "gen_sNAICS",
      "Possible Values": "(Max length = 6 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Business Website",
      "referenceId": "gen_sWebsite",
      "Possible Values": "(Max length = 128 characters)",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Home Phone",
      "referenceId": "gen_sPhone",
      "Possible Values": "(###)###-####",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Work Phone",
      "referenceId": "gen_sWorkPhone",
      "Possible Values": "(###)###-####x####",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Fax",
      "referenceId": "gen_sFax",
      "Possible Values": "(###)###-####x####",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Pager",
      "referenceId": "gen_sPager",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Cell Phone",
      "referenceId": "gen_sCellPhone",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Msg Phone",
      "referenceId": "gen_sMsgPhone",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Email Address",
      "referenceId": "gen_sEmail",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Client",
      "element": "Office",
      "referenceId": "gen_lClientOffice",
      "Possible Values": "(number)",
      "Notes": "Number refers to the Agency # found in Multi-Company Setup"
    },
    {
      "parentGroup": "Client",
      "element": "Client Misc Data (Left Side)",
      "referenceId": "gen_sClientMiscData[x]",
      "Possible Values": "(Max length = 40 characters)",
      "Notes": "x is a range from 0 to 6"
    },
    {
      "parentGroup": "Client",
      "element": "Client Misc Data Prompt (Left Side)",
      "referenceId": "gen_sClientMiscPrompt[x]",
      "Possible Values": "(Max length = 20 characters)",
      "Notes": "x is a range from 0 to 6 (Only used if Client Misc Info Screen Setup is set to User Defined for that item)"
    },
    {
      "parentGroup": "Client",
      "element": "Client Misc Data (Right Side)",
      "referenceId": "gen_sClientMiscRData[x]",
      "Possible Values": "(Max length = 18 characters)",
      "Notes": "x is a range from 0 to 6"
    },
    {
      "parentGroup": "Client",
      "element": "Client Misc Data Prompt (Right Side)",
      "referenceId": "gen_sClientMiscRPrompt[x]",
      "Possible Values": "(Max length = 10 characters)",
      "Notes": "x is a range from 0 to 6 (Only used if Client Misc Info Screen Setup is set to User Defined for that item)"
    },
    {
      "parentGroup": "Client",
      "element": "Client Status",
      "referenceId": "gen_nClientStatus",
      "Possible Values": "New Client, Existing Client, Prospect, Cancelled",
      "Notes": "gen_nClientStatus and gen_sStatus should be used exclusively"
    },
    {
      "parentGroup": "Client",
      "element": "Agency ID",
      "referenceId": "gen_sAgencyID",
      "Possible Values": "AlphaNumeric (Max length = 20 characters)",
      "Notes": "This is used by the agency to identify a client with a unique Identifier"
    },
    {
      "parentGroup": "Policy",
      "element": "CMS Policy Type",
      "referenceId": "gen_sCMSPolicyType",
      "Possible Values": "ENHANCED",
      "Notes": "Possible values NONE, AUTO, HOME, ENHANCED"
    },
    {
      "parentGroup": "Policy",
      "element": "Policy Type",
      "referenceId": "gen_sPolicyType",
      "Possible Values": "Free Form Field",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Package Type",
      "referenceId": "gen_sACORDTypeCode",
      "Possible Values": "PPKGE, CPKGE, BOP, APKGE",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "LOB Code",
      "referenceId": "gen_sLOBCode",
      "Possible Values": "(Any ACORD Standard LOB Codes)",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Company Name",
      "referenceId": "gen_sCompany",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Date of Policy Inception",
      "referenceId": "gen_tProductionDate",
      "Possible Values": "(date)",
      "Notes": "mm/dd/yyyy, mm-dd-yyyy, or (today)"
    },
    {
      "parentGroup": "Policy",
      "element": "Expiration Date",
      "referenceId": "gen_tExpirationDate",
      "Possible Values": "(date)",
      "Notes": "mm/dd/yyyy, mm-dd-yyyy, or (today)"
    },
    {
      "parentGroup": "Policy",
      "element": "Effective Date",
      "referenceId": "gen_tEffectiveDate",
      "Possible Values": "(date)",
      "Notes": "mm/dd/yyyy, mm-dd-yyyy, or (today)"
    },
    {
      "parentGroup": "Policy",
      "element": "Source",
      "referenceId": "gen_sLeadSource",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Total Policy Premium",
      "referenceId": "gen_dTotal",
      "Possible Values": "(number)",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Term",
      "referenceId": "gen_nTerm",
      "Possible Values": "1, 3, 6, 12",
      "Notes": "Term in months"
    },
    {
      "parentGroup": "Policy",
      "element": "Policy Status",
      "referenceId": "gen_sStatus",
      "Possible Values": "New, Renewal, Canc Pend, Canc-IReq, Canc-NPay, Canc-U/W, Canc-NSF, Canceled, DFile, Rewrite, Prospect, Active, Reinstate, NonRenew, Purge, Void, Agent, Quote, Refused, Replaced",
      "Notes": "gen_nClientStatus and gen_sStatus should be used exclusively"
    },
    {
      "parentGroup": "Policy",
      "element": "Notes",
      "referenceId": "gen_sFSCNotes",
      "Possible Values": "",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Agent",
      "referenceId": "gen_sProducer",
      "Possible Values": "(3 letter identifier)",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Coverage element",
      "referenceId": "gen_Coverage[x]",
      "Possible Values": "where x=a number starting at 0",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Coverage Limits",
      "referenceId": "gen_CoverageLimits[x]",
      "Possible Values": "where x=a number starting at 0",
      "Notes": ""
    },
    {
      "parentGroup": "Policy",
      "element": "Coverage Deductibles",
      "referenceId": "gen_CoverageDeds[x]",
      "Possible Values": "where x=a number starting at 0",
      "Notes": ""
    }
]