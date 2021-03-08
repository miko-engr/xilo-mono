import { VendorSchemaService } from './vendorSchema.service';


describe('VendorSchemaService', () => {

  let service: VendorSchemaService;

  beforeEach(() => {
    service = new VendorSchemaService();
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  // describe('methods', () => {
  //
  //   describe('convertSchemaToFields()', () => {
  //
  //     // xit('should parse JSON schema and create a fields object', () => {
  //     //   const result = service.convertSchemaToFields({
  //     //     properties: {
  //     //       EZAUTO: {
  //     //         '$ref': '#/definitions/EZAUTOType'
  //     //       }
  //     //     },
  //     //     definitions: {
  //     //       'EZAUTO': {},
  //     //       'NameType': {
  //     //         'type': 'object',
  //     //         'additionalProperties': true,
  //     //         'properties': {
  //     //           // "Prefix": {
  //     //           //   "$ref": "#/definitions/NamePrefixType"
  //     //           // },
  //     //           'FirstName': {
  //     //             '$ref': '#/definitions/ProperName'
  //     //           }
  //     //           // "MiddleName": {
  //     //           //   "$ref": "#/definitions/MiddleInitial"
  //     //           // },
  //     //           // "LastName": {
  //     //           //   "$ref": "#/definitions/ProperName"
  //     //           // },
  //     //           // "Suffix": {
  //     //           //   "$ref": "#/definitions/NameSuffixType"
  //     //           // }
  //     //         },
  //     //         'required': [
  //     //           'FirstName'
  //     //           // "LastName"
  //     //         ]
  //     //       },
  //     //       EZAUTOType: {
  //     //         'type': 'object',
  //     //         'additionalProperties': true,
  //     //         'properties': {
  //     //           'Applicant': {
  //     //             'type': 'array',
  //     //             'maxItems': 2,
  //     //             'minItems': 1,
  //     //             'items': {
  //     //               '$ref': '#/definitions/ApplicantType'
  //     //             }
  //     //           }
  //     //         }
  //     //       },
  //     //       'ApplicantType': {
  //     //         'type': 'object',
  //     //         'additionalProperties': true,
  //     //         'properties': {
  //     //           'ApplicantType': {
  //     //             '$ref': '#/definitions/ApplicantTypeType'
  //     //           },
  //     //           'PersonalInfo': {
  //     //             '$ref': '#/definitions/PersonalInfoType'
  //     //           }
  //     //         }
  //     //       },
  //     //       'ApplicantTypeType': {
  //     //         'type': 'string',
  //     //         'enum': [
  //     //           'Applicant',
  //     //           'CoApplicant'
  //     //         ]
  //     //       },
  //     //       'PersonalInfoType': {
  //     //         'type': 'object',
  //     //         'additionalProperties': true,
  //     //         'properties': {
  //     //           'Name': {
  //     //             '$ref': '#/definitions/NameType'
  //     //           }
  //     //         }
  //     //       },
  //     //       // "NamePrefixType": {
  //     //       //   "type": "string",
  //     //       //   "enum": [
  //     //       //     "MR",
  //     //       //     "MRS",
  //     //       //     "MS",
  //     //       //     "DR"
  //     //       //   ]
  //     //       // },
  //     //       // "NameSuffixType": {
  //     //       //   "type": "string",
  //     //       //   "enum": [
  //     //       //     "JR",
  //     //       //     "SR",
  //     //       //     "I",
  //     //       //     "II",
  //     //       //     "III"
  //     //       //   ]
  //     //       // },
  //     //       'ProperName': {
  //     //         'type': 'string',
  //     //         'maxLength': 64,
  //     //         'minLength': 1,
  //     //         'pattern': '^[A-Za-z]{1}[\\-\' A-Za-z]*$'
  //     //       }
  //     //       // "MiddleInitial": {
  //     //       //   "type": "string",
  //     //       //   "pattern": "^[A-Za-z]?$"
  //     //       // },
  //     //     }
  //     //   });
  //     //   expect(result).toEqual([{
  //     //     ApplicantType: {
  //     //       rootPropertyKey: 'Applicant',
  //     //       enum: ['Applicant', 'CoApplicant'],
  //     //       type: 'string'
  //     //     }
  //     //   }, {
  //     //     FirstName: {
  //     //       type: 'string',
  //     //       maxLength: 64,
  //     //       minLength: 1,
  //     //       pattern: '^[A-Za-z]{1}[\\-\' A-Za-z]*$',
  //     //       rootPropertyKey: 'Applicant'
  //     //     }
  //     //   }]);
  //     // });
  //
  //   });
  //
  // });

});
