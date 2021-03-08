export const ezLynxAutoSchemaFormGroups = [
  {
    "key": "Applicant",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "ApplicantType": {
          "$ref": "#/definitions/ApplicantTypeType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Applicant",
              "CoApplicant"
            ]
          },
          "id": "72a1b3a7-2eeb-4869-8800-a6be6d5c4fc7"
        },
        "PersonalInfo": {
          "$ref": "#/definitions/PersonalInfoType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "Name": {
                "$ref": "#/definitions/NameType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "Prefix": {
                      "$ref": "#/definitions/NamePrefixType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "MR",
                          "MRS",
                          "MS",
                          "DR"
                        ]
                      },
                      "id": "16fd5510-2d8b-4945-80ae-c5d9e4018462"
                    },
                    "FirstName": {
                      "$ref": "#/definitions/ProperName",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 64,
                        "minLength": 1,
                        "pattern": "^[A-Za-z]{1}[\\-\" A-Za-z]*$"
                      },
                      "id": "afe91c24-cccc-4e46-859c-9f4727ae6ff7"
                    },
                    "MiddleName": {
                      "$ref": "#/definitions/MiddleInitial",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "^[A-Za-z]?$"
                      },
                      "id": "9bac6406-db14-4790-9b52-f7a8ddd3ed9f"
                    },
                    "LastName": {
                      "$ref": "#/definitions/ProperName",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 64,
                        "minLength": 1,
                        "pattern": "^[A-Za-z]{1}[\\-\" A-Za-z]*$"
                      },
                      "id": "e991a984-0ef9-4638-90cb-0aedeb8838ac"
                    },
                    "Suffix": {
                      "$ref": "#/definitions/NameSuffixType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "JR",
                          "SR",
                          "I",
                          "II",
                          "III"
                        ]
                      },
                      "id": "d62f18f2-48c3-491a-b4d9-cce4f706412a"
                    }
                  },
                  "required": [
                    "FirstName",
                    "LastName"
                  ]
                },
                "id": "bb04b91b-9027-4e54-bdf4-d7ca5c7e14d1"
              },
              "DOB": {
                "$ref": "#/definitions/DateType",
                "typeDefinition": {
                  "type": "string"
                },
                "id": "17b4d3b4-1909-4635-9786-2d5f6869fa6f"
              },
              "SSN": {
                "$ref": "#/definitions/SSNType",
                "typeDefinition": {
                  "type": "string",
                  "pattern": "\\d{9}"
                },
                "id": "86ca2532-921c-40b4-9b81-360f5e623f97"
              },
              "Gender": {
                "$ref": "#/definitions/GenderType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Male",
                    "Female",
                    "X - Not Specified"
                  ]
                },
                "id": "a1d7ad48-0172-423e-920d-665a2a81eebe"
              },
              "MaritalStatus": {
                "$ref": "#/definitions/MaritalStatusType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Single",
                    "Married",
                    "Domestic Partner",
                    "Widowed",
                    "Separated",
                    "Divorced"
                  ]
                },
                "id": "0f7c6b08-6250-479c-b3a5-565b4fc11777"
              },
              "Industry": {
                "type": "string",
                "id": "3375bd2e-0e45-4db9-bf06-863544c11641"
              },
              "Occupation": {
                "type": "string",
                "id": "1c458019-1cf5-4008-b4c6-1d1dc107cb9b"
              },
              "YearsWithEmployer": {
                "type": "integer",
                "id": "158324db-4662-4347-8a39-0f500633a08d",
                "minimum": 0,
                "exclusiveMinimum": false
              },
              "YearsWithPreviousEmployer": {
                "type": "integer",
                "id": "c4a9ae46-9950-4cfc-83e2-77272c119571",
                "minimum": 0,
                "exclusiveMinimum": false
              },
              "Education": {
                "$ref": "#/definitions/EducationType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No High School Diploma",
                    "High School Diploma",
                    "Some College - No Degree",
                    "Vocational/Technical Degree",
                    "Associates Degree",
                    "Bachelors",
                    "Masters",
                    "Phd",
                    "Medical Degree",
                    "Law Degree"
                  ]
                },
                "id": "09cebe12-4a31-4eb8-b953-4d80ab859b16"
              },
              "LicensedToDrive": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "f6399b49-b4c4-426b-befe-033c844d707e"
              },
              "Relation": {
                "$ref": "#/definitions/RelationType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Child",
                    "Domestic Partner",
                    "Employee",
                    "Insured",
                    "Other",
                    "Parent",
                    "Relative",
                    "Spouse"
                  ]
                },
                "id": "5f7292a3-bbf8-4282-9431-96dfa1bfa2c9"
              },
              "MaidenName": {
                "type": "string",
                "id": "3a5ebf16-cb66-496f-816f-3ea578083706"
              },
              "NickName": {
                "type": "string",
                "id": "21a2ac6f-98b3-4f1d-b8ed-a59d8e62edfa"
              }
            },
            "required": [
              "Name"
            ]
          },
          "id": "67574360-b940-464e-bd36-c94b28ede846"
        },
        "Address": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/AddressType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "AddressCode": {
                "$ref": "#/definitions/AddressCodeType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "BillingAddress",
                    "InsuredsAddress",
                    "LegalAddr",
                    "MailingAddress",
                    "PhysicalRisk",
                    "PreviousAddress",
                    "StreetAddress"
                  ]
                },
                "id": "40332690-d135-4d71-9828-72f24c7c79e9"
              },
              "Addr1": {
                "$ref": "#/definitions/DetailAddrType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "StreetName": {
                      "$ref": "#/definitions/C-255",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 255
                      },
                      "id": "c8464136-ece0-4d83-ada2-b241d1dce379"
                    },
                    "StreetNumber": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "7d6fb758-aacb-46e1-aaa2-bf11503f63dd"
                    },
                    "UnitNumber": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "25b07aeb-22d1-49ba-8262-7cc03bc8a9bc"
                    }
                  },
                  "required": [
                    "StreetName",
                    "StreetNumber"
                  ]
                },
                "id": "b567f008-bbe4-4881-a50c-8c9938e8de32"
              },
              "Addr2": {
                "$ref": "#/definitions/C-255",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 255
                },
                "id": "1d31454f-e64d-4b76-bed9-ccea59c5f01a"
              },
              "City": {
                "$ref": "#/definitions/C-50",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 50
                },
                "id": "62c93a4b-2662-4802-bdd4-1afc63ff6104"
              },
              "StateCode": {
                "$ref": "#/definitions/StateCodeType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "AK",
                    "AL",
                    "AR",
                    "AZ",
                    "CA",
                    "CO",
                    "CT",
                    "DC",
                    "DE",
                    "FL",
                    "GA",
                    "HI",
                    "IA",
                    "ID",
                    "IL",
                    "IN",
                    "KS",
                    "KY",
                    "LA",
                    "MA",
                    "MD",
                    "ME",
                    "MI",
                    "MN",
                    "MO",
                    "MS",
                    "MT",
                    "NC",
                    "ND",
                    "NE",
                    "NH",
                    "NJ",
                    "NM",
                    "NV",
                    "NY",
                    "OH",
                    "OK",
                    "OR",
                    "PA",
                    "RI",
                    "SC",
                    "SD",
                    "TN",
                    "TX",
                    "UT",
                    "VA",
                    "VT",
                    "WA",
                    "WI",
                    "WV",
                    "WY"
                  ]
                },
                "id": "082fdddc-3cb6-4dfe-afff-66395228196e"
              },
              "County": {
                "$ref": "#/definitions/C-50",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 50
                },
                "id": "2aded9f7-4c8f-4954-952f-a22930363d01"
              },
              "Zip5": {
                "$ref": "#/definitions/Zip5Type",
                "typeDefinition": {
                  "type": "string",
                  "pattern": "\\d{5}"
                },
                "id": "c523757a-6859-4642-97be-f061d46a9064"
              },
              "Zip4": {
                "$ref": "#/definitions/Zip4Type",
                "typeDefinition": {
                  "type": "string",
                  "pattern": "\\d{4}"
                },
                "id": "dc08c2d9-0393-410a-a590-d986f955222a"
              },
              "Phone": {
                "$ref": "#/definitions/PhoneType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "type": "string",
                      "id": "a6ae7913-de53-46d3-8572-bd5243587ca9"
                    },
                    "PhoneType": {
                      "$ref": "#/definitions/PhoneTypeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Home",
                          "Work",
                          "Mobile"
                        ]
                      },
                      "id": "4177332c-0970-47e6-81b8-cc0b35f3921f"
                    },
                    "PhoneNumberType": {
                      "$ref": "#/definitions/PhoneNumberTypeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Cell",
                          "Fax",
                          "Marine",
                          "Pager",
                          "Phone",
                          "TTY"
                        ]
                      },
                      "id": "7b0ef61e-9614-49b4-992f-7f99fdd13837"
                    },
                    "PhoneNumber": {
                      "$ref": "#/definitions/PhoneNumberType",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "d7fa7fc9-41fd-4ed8-b1fa-4feee76cfeed"
                    },
                    "Extension": {
                      "$ref": "#/definitions/C-10",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 10
                      },
                      "id": "3aa9d971-79fd-4534-a660-c855f5700dbd"
                    }
                  },
                  "required": [
                    "PhoneNumber"
                  ]
                },
                "id": "730928a1-eafd-1142-b37c-2f5a925caf09"
              },
              "Email": {
                "type": "string",
                "id": "c18506f5-cf05-4894-9dda-b1b60952eb72",
                "maxLength": 100,
                "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              },
              "PreferredContactMethod": {
                "$ref": "#/definitions/PreferredContactMethodType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Phone (Home)",
                    "Phone (Work)",
                    "Phone (Mobile)",
                    "Email"
                  ]
                },
                "id": "03091881-dff2-4e92-a1df-6e36925c6958"
              },
              "PreferredContactTime": {
                "$ref": "#/definitions/PreferredContactTimeType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Morning",
                    "Afternoon",
                    "Evening",
                    "Anytime"
                  ]
                },
                "id": "0eb55a8a-fba1-4127-9c67-605019e4947a"
              },
              "Validation": {
                "$ref": "#/definitions/AddressValidationType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "None",
                    "Valid",
                    "Invalid",
                    "NonDeliverable",
                    "MultipleMatches",
                    "Disabled"
                  ]
                },
                "id": "dd4f5b44-a8b9-438f-8a13-537dcb62eefb"
              }
            },
            "required": [
              "AddressCode",
              "Addr1",
              "City",
              "State",
              "Zip5"
            ]
          },
          "id": "eb064408-689a-4073-bf9f-15d5621d5a39"
        }
      },
      "required": [
        "ApplicantType",
        "PersonalInfo"
      ]
    },
    "type": "array",
    "maxItems": 2,
    "minItems": 1,
    "items": {
      "$ref": "#/definitions/ApplicantType"
    },
    "id": "9beaf416-ea5a-4956-a182-a263d48964f3"
  },
  {
    "key": "PriorPolicyInfo",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "PriorCarrier": {
          "$ref": "#/definitions/PriorCarrierType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Other Standard",
              "Other Non-Standard",
              "No Prior Insurance",
              "21st Century",
              "A.Central",
              "AAA",
              "AARP",
              "Acadia",
              "Access General",
              "Ace",
              "Acuity",
              "Adirondack Ins Exchange",
              "Aegis",
              "Affirmative",
              "AIC",
              "AIG",
              "Alfa Alliance",
              "Allied",
              "Allstate",
              "America First",
              "American Commerce",
              "American Family",
              "American Freedom Insurance Company",
              "American National",
              "Amerisure",
              "Amica",
              "Anchor General",
              "Arrowhead",
              "ASI Lloyds",
              "Atlantic Mutual",
              "Austin Mutual",
              "Autoone",
              "Auto-Owners",
              "AutoTex",
              "Badger Mutual",
              "Balboa",
              "Bankers",
              "Beacon National",
              "Bear River Mutual",
              "Brethern Mutual",
              "Bristol West",
              "Buckeye",
              "California Casualty",
              "Cameron Mutual",
              "Capital Insurance Group",
              "Celina",
              "Centennial",
              "Central Mutual of OH",
              "Charter",
              "Chubb",
              "Cincinnati",
              "Citizens",
              "CNA",
              "Colonial Penn",
              "Colorado Casualty",
              "Columbia",
              "Commerce West",
              "Constitutional Casualty",
              "Consumers",
              "Cornerstone",
              "Countrywide",
              "Country Insurance",
              "CSE",
              "Cumberland",
              "Dairyland",
              "Deerbrook",
              "Delta Lloyds Insurance Company",
              "Depositors",
              "Direct",
              "Direct General",
              "Discovery",
              "Donegal",
              "Drive",
              "Electric",
              "EMC",
              "Encompass",
              "Erie",
              "Esurance",
              "Eveready",
              "Explorer",
              "Farm Bureau",
              "Farmers",
              "Federated",
              "Fidelity",
              "Financial Indemnity",
              "Firemans Fund",
              "First Acceptance",
              "First American",
              "First Auto",
              "First Chicago",
              "First Connect",
              "Flagship Insurance",
              "Foremost",
              "Founders",
              "Frankenmuth",
              "Fred Loya",
              "Gateway",
              "Geico",
              "General Casualty",
              "Germantown Mutual",
              "GMAC",
              "Grange",
              "Great American",
              "GRE/Go America",
              "Grinnell",
              "Guide One",
              "Hallmark Insurance Company",
              "Hanover",
              "Harbor",
              "Harleysville",
              "Hartford OMNI",
              "Hartford",
              "Hastings Mutual",
              "Hawkeye Security",
              "HDI",
              "Horace Mann",
              "Houston General",
              "IFA",
              "Imperial Casualty",
              "IMT Ins",
              "Indiana Farmers",
              "Indiana",
              "Infinity",
              "Insuremax",
              "Insurequest",
              "Integon",
              "Integrity",
              "Kemper",
              "Kingsway",
              "Liberty Mutual",
              "Liberty Northwest",
              "MAIF",
              "Main Street America",
              "Mapfre",
              "Markel",
              "Maryland Auto Insurance",
              "Mendakota",
              "Mendota",
              "Merchants Group",
              "Mercury",
              "MetLife",
              "Metropolitan",
              "Mid-Continent",
              "Midwestern Indemnity",
              "Montgomery",
              "Motorists Mutual",
              "MSA",
              "Mt. Washington",
              "Mutual Benefit",
              "Mutual of Enumclaw",
              "National Lloyds Insurance Company",
              "Nationwide",
              "National General",
              "New York Central Mutual",
              "NJ Manufacturers",
              "NJ Skylands",
              "Nodak Mutual",
              "Northstar",
              "NYAIP",
              "Occidental",
              "Ocean Harbor",
              "Ohio Casualty",
              "Omaha P/C",
              "Omni Insurance Co",
              "One Beacon",
              "Oregon Mutual",
              "Palisades",
              "Patriot",
              "Patrons Oxford",
              "Peerless/Montgomery",
              "Pekin",
              "Pemco",
              "Penn National",
              "Phoenix Indemnity",
              "Plymouth Rock",
              "Preferred Mutual",
              "Proformance",
              "Progressive",
              "Prudential",
              "Republic",
              "Response",
              "Rockford Mutual",
              "Royal and Sun Alliance",
              "Safeco",
              "Safe Auto",
              "Safeway",
              "Sagamore",
              "SECURA",
              "Selective",
              "Sentry Ins",
              "Shelter Insurance",
              "Southern County",
              "Southern Mutual",
              "Southern Trust",
              "St. Paul/Travelers",
              "Standard Mutual",
              "Star Casualty",
              "State Auto",
              "State Farm",
              "StillWater",
              "Stonegate",
              "Titan",
              "Topa",
              "Tower",
              "Travelers",
              "TWFG",
              "Unigard",
              "United Automobile",
              "United Fire and Casualty",
              "Unitrin",
              "Universal",
              "USAA",
              "Utica National",
              "Victoria",
              "West Bend",
              "Western National",
              "Western Reserve Group",
              "Westfield",
              "White Mountains",
              "Wilshire",
              "Wilson Mutual",
              "Wisconsin Mutual",
              "Windsor",
              "Wind Haven",
              "Zurich"
            ]
          },
          "id": "e6d8f558-f920-4952-a9e2-69386e43355c"
        },
        "Expiration": {
          "$ref": "#/definitions/DateType",
          "typeDefinition": {
            "type": "string"
          },
          "id": "e959cee5-84b1-49ab-85b1-c318c44c29b1"
        },
        "YearsWithPriorCarrier": {
          "$ref": "#/definitions/DurationType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "Years": {
                "$ref": "#/definitions/DurationYearsType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "More than 15"
                  ]
                },
                "id": "f106b80a-5f18-49ce-8310-c6bb516102a1"
              },
              "Months": {
                "$ref": "#/definitions/DurationMonthsType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11"
                  ]
                },
                "id": "65625195-f667-4901-9631-550389629106"
              }
            },
            "required": [
              "Years"
            ]
          },
          "id": "651c9a2e-af98-4c14-adc9-4a5ece9efb5c"
        },
        "YearsWithContinuousCoverage": {
          "$ref": "#/definitions/DurationType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "Years": {
                "$ref": "#/definitions/DurationYearsType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "More than 15"
                  ]
                },
                "id": "11b84c62-5019-4898-ae63-54f9dd19dae6"
              },
              "Months": {
                "$ref": "#/definitions/DurationMonthsType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11"
                  ]
                },
                "id": "8fd4fdea-5800-4221-ab72-54e4dc9953cb"
              }
            },
            "required": [
              "Years"
            ]
          },
          "id": "7c244669-d062-4135-b5ea-a1c5a705292b"
        },
        "PriorLiabilityLimit": {
          "$ref": "#/definitions/PriorLiabilityLimitType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "State Minimum",
              "10/20",
              "12/25",
              "12.5/25",
              "15/30",
              "20/40",
              "20/50",
              "25/25",
              "25/50",
              "25/60",
              "25/65",
              "30/60",
              "35/80",
              "50/50",
              "50/100",
              "100/100",
              "100/200",
              "100/300",
              "200/400",
              "200/600",
              "250/500",
              "250/1000",
              "300/300",
              "300/500",
              "500/500",
              "500/1000",
              "1000/1000",
              "55CSL",
              "100CSL",
              "115CSL",
              "300CSL",
              "500CSL",
              "1000CSL",
              "None"
            ]
          },
          "id": "a4b18fc3-f71a-493e-bf93-a4f1d49729ae"
        },
        "ReasonForLapse": {
          "$ref": "#/definitions/ReasonForLapseType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Active Military Duty",
              "Driving A Company Car",
              "Driving A Car Owned By A Relative",
              "Has Not Owned Or Operated A Vehicle",
              "Owned Veh Parked/Stored Off Road/Not Driven",
              "Other",
              "Non-Payment"
            ]
          },
          "id": "51b43fd7-cb79-4a0e-a7cc-e70dc81042fc"
        },
        "ReasonNoPrior": {
          "$ref": "#/definitions/ReasonNoPriorType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Active Military Duty",
              "Driving A Company Car",
              "Driving A Car Owned By A Relative",
              "Has Not Owned Or Operated A Vehicle",
              "Owned Veh Parked/Stored Off Road/Not Driven",
              "Other",
              "Non-Payment"
            ]
          },
          "id": "6b3e5b88-421c-4303-9274-e2d9b55a3ab4"
        },
        "PriorPolicyPremium": {
          "type": "integer",
          "id": "a03be5ff-f0d4-4f08-8689-102194b9a29c",
          "minimum": 0,
          "exclusiveMinimum": false
        },
        "PriorPolicyTerm": {
          "$ref": "#/definitions/PolicyTermType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "6 Month",
              "12 Month"
            ]
          },
          "id": "e4590f20-4233-4b52-8b0d-ed2f11c084a3"
        }
      }
    },
    "$ref": "#/definitions/PriorPolicyInfoType",
    "id": "55f21b80-236c-42f1-9d8d-7b78445bc415"
  },
  {
    "key": "PolicyInfo",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "PolicyTerm": {
          "$ref": "#/definitions/PolicyTermType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "6 Month",
              "12 Month"
            ]
          },
          "id": "83e00e25-5f71-4579-9c82-7b3e0c136ae3"
        },
        "Package": {
          "$ref": "#/definitions/BooleanType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Yes",
              "No"
            ]
          },
          "id": "e13cae3e-0413-41c7-947f-61ffe63b91fa"
        },
        "Effective": {
          "$ref": "#/definitions/DateType",
          "typeDefinition": {
            "type": "string"
          },
          "id": "ff09b471-8705-454f-b5ab-7d7fcae4a1fd"
        },
        "CreditCheckAuth": {
          "$ref": "#/definitions/BooleanType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "Yes",
              "No"
            ]
          },
          "id": "c881f1bd-6465-4a01-8fd1-88c251d60a52"
        }
      }
    },
    "$ref": "#/definitions/PolicyInfoType",
    "id": "3f2be06c-67c3-4839-9c8b-dae9fc867edd"
  },
  {
    "key": "ResidenceInfo",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "CurrentAddress": {
          "$ref": "#/definitions/CurrentAddressType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "YearsAtCurrent": {
                "$ref": "#/definitions/DurationType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "Years": {
                      "$ref": "#/definitions/DurationYearsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11",
                          "12",
                          "13",
                          "14",
                          "15",
                          "More than 15"
                        ]
                      },
                      "id": "8ee3f738-a335-4fc9-a992-17632eb017b1"
                    },
                    "Months": {
                      "$ref": "#/definitions/DurationMonthsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11"
                        ]
                      },
                      "id": "bd5e6402-05b9-4b07-8595-29c02a7df174"
                    }
                  },
                  "required": [
                    "Years"
                  ]
                },
                "id": "d788ad17-78f7-4516-ad02-1e452c67b193"
              },
              "Ownership": {
                "$ref": "#/definitions/HomeOwnershipType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Home (owned)",
                    "Condo (owned)",
                    "Apartment",
                    "Rental Home/Condo",
                    "Mobile Home",
                    "Live With Parents",
                    "Other"
                  ]
                },
                "id": "765c82c5-cf5c-4cdd-9b99-d34e1a28dcce"
              }
            }
          },
          "id": "6b35913c-355a-49ad-b4d4-65b545e5ce88"
        },
        "PreviousAddress": {
          "$ref": "#/definitions/PreviousAddressType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "YearsAtPrevious": {
                "$ref": "#/definitions/DurationType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "Years": {
                      "$ref": "#/definitions/DurationYearsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11",
                          "12",
                          "13",
                          "14",
                          "15",
                          "More than 15"
                        ]
                      },
                      "id": "4c739325-9175-419c-bfda-a0055d5db193"
                    },
                    "Months": {
                      "$ref": "#/definitions/DurationMonthsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11"
                        ]
                      },
                      "id": "4b858cd1-4796-4510-9f20-6fc22ba1c0cf"
                    }
                  },
                  "required": [
                    "Years"
                  ]
                },
                "id": "1cd43a33-c72b-45e2-93f7-98e531a0090f"
              },
              "Address": {
                "$ref": "#/definitions/SimpleAddressType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "AddressCode": {
                      "$ref": "#/definitions/AddressCodeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "BillingAddress",
                          "InsuredsAddress",
                          "LegalAddr",
                          "MailingAddress",
                          "PhysicalRisk",
                          "PreviousAddress",
                          "StreetAddress"
                        ]
                      },
                      "id": "a8c849d8-f9f4-4765-9a7e-86daeed4ceb3"
                    },
                    "Addr1": {
                      "$ref": "#/definitions/DetailAddrType",
                      "typeDefinition": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "StreetName": {
                            "$ref": "#/definitions/C-255",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 255
                            },
                            "id": "22b2527b-86d2-43a5-bbad-ee29dad42954"
                          },
                          "StreetNumber": {
                            "$ref": "#/definitions/C-50",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 50
                            },
                            "id": "0ccfaacb-3f2a-4989-bd7d-3f2a92287e94"
                          },
                          "UnitNumber": {
                            "$ref": "#/definitions/C-50",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 50
                            },
                            "id": "7015be30-ca9e-48ee-8eca-68ef66a4a952"
                          }
                        },
                        "required": [
                          "StreetName",
                          "StreetNumber"
                        ]
                      },
                      "id": "a7f81dee-846f-4908-bf25-4d156fe06c61"
                    },
                    "Addr2": {
                      "$ref": "#/definitions/C-255",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 255
                      },
                      "id": "9fe14ed2-3d71-4866-8243-735ddd2c7891"
                    },
                    "City": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "1e680ea0-5c57-42df-9a61-4506366fdf16"
                    },
                    "StateCode": {
                      "$ref": "#/definitions/StateCodeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "AK",
                          "AL",
                          "AR",
                          "AZ",
                          "CA",
                          "CO",
                          "CT",
                          "DC",
                          "DE",
                          "FL",
                          "GA",
                          "HI",
                          "IA",
                          "ID",
                          "IL",
                          "IN",
                          "KS",
                          "KY",
                          "LA",
                          "MA",
                          "MD",
                          "ME",
                          "MI",
                          "MN",
                          "MO",
                          "MS",
                          "MT",
                          "NC",
                          "ND",
                          "NE",
                          "NH",
                          "NJ",
                          "NM",
                          "NV",
                          "NY",
                          "OH",
                          "OK",
                          "OR",
                          "PA",
                          "RI",
                          "SC",
                          "SD",
                          "TN",
                          "TX",
                          "UT",
                          "VA",
                          "VT",
                          "WA",
                          "WI",
                          "WV",
                          "WY"
                        ]
                      },
                      "id": "5046aa35-3763-40f6-846c-0b1581f6129e"
                    },
                    "County": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "c874407c-1c0c-45d3-aa16-82e53421a4ce"
                    },
                    "Zip5": {
                      "$ref": "#/definitions/Zip5Type",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "\\d{5}"
                      },
                      "id": "51898b8d-83c7-4ed4-abff-2ff9168b9ff4"
                    },
                    "Zip4": {
                      "$ref": "#/definitions/Zip4Type",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "\\d{4}"
                      },
                      "id": "eccebb29-cb73-4c7e-b675-a4c06d6a83f9"
                    },
                    "Validation": {
                      "$ref": "#/definitions/AddressValidationType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "Valid",
                          "Invalid",
                          "NonDeliverable",
                          "MultipleMatches",
                          "Disabled"
                        ]
                      },
                      "id": "ab6ce7ef-60ae-443b-b78a-438a67ed47aa"
                    }
                  },
                  "required": [
                    "AddressCode",
                    "Addr1",
                    "City",
                    "State",
                    "Zip5"
                  ]
                },
                "id": "cda0aaa3-2c96-4893-b8b2-887132464503"
              }
            }
          },
          "id": "69af869b-0344-4148-a060-32f5baaf8537"
        },
        "GarageLocation": {
          "$ref": "#/definitions/GarageAddressType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "Address": {
                "$ref": "#/definitions/SimpleAddressType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "AddressCode": {
                      "$ref": "#/definitions/AddressCodeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "BillingAddress",
                          "InsuredsAddress",
                          "LegalAddr",
                          "MailingAddress",
                          "PhysicalRisk",
                          "PreviousAddress",
                          "StreetAddress"
                        ]
                      },
                      "id": "43df9ebe-bc40-4b17-aef4-34b6288aa7c4"
                    },
                    "Addr1": {
                      "$ref": "#/definitions/DetailAddrType",
                      "typeDefinition": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "StreetName": {
                            "$ref": "#/definitions/C-255",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 255
                            },
                            "id": "44f84743-7bc4-4daf-8c54-74942b9940f0"
                          },
                          "StreetNumber": {
                            "$ref": "#/definitions/C-50",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 50
                            },
                            "id": "648f72a6-1785-44a2-938f-7ea557f9744e"
                          },
                          "UnitNumber": {
                            "$ref": "#/definitions/C-50",
                            "typeDefinition": {
                              "type": "string",
                              "maxLength": 50
                            },
                            "id": "82ebbd6b-089c-4b01-8211-61d53baa5f6e"
                          }
                        },
                        "required": [
                          "StreetName",
                          "StreetNumber"
                        ]
                      },
                      "id": "93796800-686a-43f5-8e3a-9209d1284b57"
                    },
                    "Addr2": {
                      "$ref": "#/definitions/C-255",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 255
                      },
                      "id": "704e9a8b-06e1-44c7-afd1-78b7bb9a7328"
                    },
                    "City": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "3b32400d-b474-4e8f-9a16-6c3b217b423f"
                    },
                    "StateCode": {
                      "$ref": "#/definitions/StateCodeType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "AK",
                          "AL",
                          "AR",
                          "AZ",
                          "CA",
                          "CO",
                          "CT",
                          "DC",
                          "DE",
                          "FL",
                          "GA",
                          "HI",
                          "IA",
                          "ID",
                          "IL",
                          "IN",
                          "KS",
                          "KY",
                          "LA",
                          "MA",
                          "MD",
                          "ME",
                          "MI",
                          "MN",
                          "MO",
                          "MS",
                          "MT",
                          "NC",
                          "ND",
                          "NE",
                          "NH",
                          "NJ",
                          "NM",
                          "NV",
                          "NY",
                          "OH",
                          "OK",
                          "OR",
                          "PA",
                          "RI",
                          "SC",
                          "SD",
                          "TN",
                          "TX",
                          "UT",
                          "VA",
                          "VT",
                          "WA",
                          "WI",
                          "WV",
                          "WY"
                        ]
                      },
                      "id": "1547a611-a4d1-455d-bd3f-d3d2968382a2"
                    },
                    "County": {
                      "$ref": "#/definitions/C-50",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 50
                      },
                      "id": "31bb5164-fd02-4e00-9f3a-ab47fb365852"
                    },
                    "Zip5": {
                      "$ref": "#/definitions/Zip5Type",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "\\d{5}"
                      },
                      "id": "d7b2d511-ba03-4203-b847-ffff0ac7ae9a"
                    },
                    "Zip4": {
                      "$ref": "#/definitions/Zip4Type",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "\\d{4}"
                      },
                      "id": "7cca3402-98e7-454d-a9a8-bf460e2a60a8"
                    },
                    "Validation": {
                      "$ref": "#/definitions/AddressValidationType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "Valid",
                          "Invalid",
                          "NonDeliverable",
                          "MultipleMatches",
                          "Disabled"
                        ]
                      },
                      "id": "26c473a7-6f7f-4198-9ab7-edd1fb16fe8f"
                    }
                  },
                  "required": [
                    "AddressCode",
                    "Addr1",
                    "City",
                    "State",
                    "Zip5"
                  ]
                },
                "id": "f409f62b-f685-49ec-8e12-00bf7b9b4d96"
              }
            }
          },
          "id": "f0254782-5a7d-4b2c-8f0a-cf367d1f8b24"
        }
      }
    },
    "$ref": "#/definitions/ResidenceInfoType",
    "id": "065e1821-35cb-4ce5-a0c5-d7630bab600b"
  },
  {
    "key": "Drivers",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Driver": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/DriverTypeType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "id": {
                "type": "integer",
                "id": "4091ef17-6727-47fa-83fe-36330f8527ba",
                "minimum": 0,
                "exclusiveMinimum": true
              },
              "Name": {
                "$ref": "#/definitions/NameType",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "Prefix": {
                      "$ref": "#/definitions/NamePrefixType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "MR",
                          "MRS",
                          "MS",
                          "DR"
                        ]
                      },
                      "id": "bc83fa36-b731-4925-b9cd-e0e323decf67"
                    },
                    "FirstName": {
                      "$ref": "#/definitions/ProperName",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 64,
                        "minLength": 1,
                        "pattern": "^[A-Za-z]{1}[\\-\" A-Za-z]*$"
                      },
                      "id": "8a22d360-3fd7-41d9-ad63-8ba6d4ec7fdf"
                    },
                    "MiddleName": {
                      "$ref": "#/definitions/MiddleInitial",
                      "typeDefinition": {
                        "type": "string",
                        "pattern": "^[A-Za-z]?$"
                      },
                      "id": "3dea5616-9cb3-470a-a699-e60c183e4b8f"
                    },
                    "LastName": {
                      "$ref": "#/definitions/ProperName",
                      "typeDefinition": {
                        "type": "string",
                        "maxLength": 64,
                        "minLength": 1,
                        "pattern": "^[A-Za-z]{1}[\\-\" A-Za-z]*$"
                      },
                      "id": "79455c7f-a36c-4ea5-a2a2-17a5e0186122"
                    },
                    "Suffix": {
                      "$ref": "#/definitions/NameSuffixType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "JR",
                          "SR",
                          "I",
                          "II",
                          "III"
                        ]
                      },
                      "id": "a3d42864-94e2-45cf-a953-3845b85df593"
                    }
                  },
                  "required": [
                    "FirstName",
                    "LastName"
                  ]
                },
                "id": "29098383-7e91-47a3-9eeb-444c7711d1f0"
              },
              "Gender": {
                "$ref": "#/definitions/GenderType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Male",
                    "Female",
                    "X - Not Specified"
                  ]
                },
                "id": "d44e8280-6f00-454f-b39a-b22df0277098"
              },
              "DOB": {
                "$ref": "#/definitions/DateType",
                "typeDefinition": {
                  "type": "string"
                },
                "id": "2832cc8f-213c-47b0-a4cf-d55aa375e515"
              },
              "SSN": {
                "$ref": "#/definitions/SSNType",
                "typeDefinition": {
                  "type": "string",
                  "pattern": "\\d{9}"
                },
                "id": "42aa010e-06fe-43ed-8fd3-d6e253eb065d"
              },
              "DLNumber": {
                "$ref": "#/definitions/C-50",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 50
                },
                "id": "01ae685c-1d28-4cc8-bfd4-e065994cffcc"
              },
              "SDIPPoint": {
                "type": "integer",
                "id": "613ab316-f036-415f-85fe-9cd6b18a381b",
                "minimum": 0,
                "exclusiveMinimum": false
              },
              "DLState": {
                "$ref": "#/definitions/DLStateCodeType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "AK",
                    "AL",
                    "AR",
                    "AZ",
                    "CA",
                    "CO",
                    "CT",
                    "DC",
                    "DE",
                    "FL",
                    "GA",
                    "HI",
                    "IA",
                    "ID",
                    "IL",
                    "IN",
                    "KS",
                    "KY",
                    "LA",
                    "MA",
                    "MD",
                    "ME",
                    "MI",
                    "MN",
                    "MO",
                    "MS",
                    "MT",
                    "NC",
                    "ND",
                    "NE",
                    "NH",
                    "NJ",
                    "NM",
                    "NV",
                    "NY",
                    "OH",
                    "OK",
                    "OR",
                    "PA",
                    "RI",
                    "SC",
                    "SD",
                    "TN",
                    "TX",
                    "UT",
                    "VA",
                    "VT",
                    "WA",
                    "WI",
                    "WV",
                    "WY",
                    "Canada",
                    "Mexico",
                    "International"
                  ]
                },
                "id": "8777766a-8889-4ae9-ac1c-b52207493264"
              },
              "DateLicensed": {
                "$ref": "#/definitions/DateType",
                "typeDefinition": {
                  "type": "string"
                },
                "id": "0bc7d3b3-c8dc-445c-9926-4b31fcc06bfd"
              },
              "DLStatus": {
                "$ref": "#/definitions/DLStatusType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Valid",
                    "Permit",
                    "Expired",
                    "Suspended",
                    "Cancelled",
                    "Not Licensed",
                    "Permanently Revoked"
                  ]
                },
                "id": "77de8e72-719a-46cb-8433-ca611d9d159f"
              },
              "AgeLicensed": {
                "$ref": "#/definitions/int100",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 100,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "2898538b-7dc2-4cf2-afa2-645ecad15b95"
              },
              "AccPrev": {
                "$ref": "#/definitions/DateType",
                "typeDefinition": {
                  "type": "string"
                },
                "id": "22d58818-5861-4673-9590-7bfd40f02c67"
              },
              "MaritalStatus": {
                "$ref": "#/definitions/MaritalStatusType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Single",
                    "Married",
                    "Domestic Partner",
                    "Widowed",
                    "Separated",
                    "Divorced"
                  ]
                },
                "id": "0dba9307-7d50-4b6b-a409-d3dca31a91f6"
              },
              "Relation": {
                "$ref": "#/definitions/RelationType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Child",
                    "Domestic Partner",
                    "Employee",
                    "Insured",
                    "Other",
                    "Parent",
                    "Relative",
                    "Spouse"
                  ]
                },
                "id": "dbfe97b5-37dc-41c8-8735-d38139102e1a"
              },
              "Industry": {
                "type": "string",
                "id": "81d4b944-cf96-4f4e-96be-8952cd5a046e"
              },
              "Occupation": {
                "type": "string",
                "id": "06c9b17f-4304-4388-a049-01307ae47d85"
              },
              "GoodStudent": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "b61b1dea-4309-4699-8bd5-9ff508819ff1"
              },
              "Student100": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "3eb4518f-eecf-45dc-ba77-8a6ff7f8adb0"
              },
              "DriverTraining": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "e95972f9-d249-415c-a0ce-94f3f4596c71"
              },
              "GoodDriver": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "414f7db3-9d25-4b07-b451-ba621630638f"
              },
              "MATDriver": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "a6c0c7ca-fd85-434e-a96a-b8c132504518"
              },
              "PrincipalVehicle": {
                "$ref": "#/definitions/int10",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 10,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "1e58e871-23dc-4cde-8aae-0cadc26c3603"
              },
              "Accident": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/AccidentType"
                },
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "type": "integer",
                      "id": "08e26755-d0de-4e42-b288-512d62d7a01e",
                      "minimum": 0,
                      "exclusiveMinimum": true
                    },
                    "Date": {
                      "$ref": "#/definitions/DateType",
                      "typeDefinition": {
                        "type": "string"
                      },
                      "id": "8e0a6c40-1cce-4640-8d49-5d783ad076aa"
                    },
                    "Description": {
                      "$ref": "#/definitions/AccidentDescType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "At Fault With Injury",
                          "At Fault With No Injury",
                          "Not At Fault"
                        ]
                      },
                      "id": "77e32e64-6cdd-4c2a-9d04-a5c469449dff"
                    },
                    "PD": {
                      "$ref": "#/definitions/int999999",
                      "typeDefinition": {
                        "type": "integer",
                        "maximum": 999999,
                        "minimum": 0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                      },
                      "id": "5cd3bf15-0fd5-4f29-b54d-1fc740bdd0fe"
                    },
                    "BI": {
                      "$ref": "#/definitions/int999999",
                      "typeDefinition": {
                        "type": "integer",
                        "maximum": 999999,
                        "minimum": 0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                      },
                      "id": "6d2438ce-fe5a-4090-897f-ef60516fdb5e"
                    },
                    "Collision": {
                      "$ref": "#/definitions/int999999",
                      "typeDefinition": {
                        "type": "integer",
                        "maximum": 999999,
                        "minimum": 0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                      },
                      "id": "0f493e14-f601-469d-8a26-14159b036864"
                    },
                    "MP": {
                      "$ref": "#/definitions/int999999",
                      "typeDefinition": {
                        "type": "integer",
                        "maximum": 999999,
                        "minimum": 0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                      },
                      "id": "12dbee0d-87e6-4304-82ed-b013c5313f00"
                    },
                    "VehicleInvolved": {
                      "type": "string",
                      "id": "e64f1e79-0bb9-44e2-bb6b-4a69a05f92fa"
                    }
                  }
                },
                "id": "05fd3a79-e8bc-4171-8a94-62b8146b18c7"
              },
              "Violation": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/ViolationType"
                },
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "type": "integer",
                      "id": "4527afae-0483-44ad-9b17-346ef60338b1",
                      "minimum": 0,
                      "exclusiveMinimum": true
                    },
                    "Date": {
                      "$ref": "#/definitions/DateType",
                      "typeDefinition": {
                        "type": "string"
                      },
                      "id": "c33e9d21-4c35-4aca-ad52-a96d7a3f9be6"
                    },
                    "Description": {
                      "$ref": "#/definitions/ViolationDescType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Careless Driving",
                          "Cell Phone",
                          "Child Safety Restraint",
                          "Defective Equipment",
                          "Divided Highways",
                          "Double Lines",
                          "Driving Left of Center",
                          "Driving on Sus. License",
                          "Driving too slow",
                          "Driving without lights",
                          "DUI",
                          "Eluding Police",
                          "Failure to Obey Signal",
                          "Failure to Stop",
                          "Failure to Yield",
                          "Failure To Observe A Safety Zone",
                          "Failure to show documents",
                          "False Reporting",
                          "Felony",
                          "Following too Closely",
                          "Homicide",
                          "Illegal Turn",
                          "Improper Parking",
                          "Improper Passing",
                          "Improper Loads",
                          "Leaving scene of an Accident/Hit and Run",
                          "Motorcycle Violation",
                          "Other Major",
                          "Other Minor",
                          "Open Container",
                          "Operating Vehicle without Permission",
                          "Out of State",
                          "Passing School Bus",
                          "Racing/Drag Racing",
                          "Recreational Vehicle",
                          "Refusal to submit to chemical test",
                          "Speeding 1-5",
                          "Speeding 6-10",
                          "Speeding 11-15",
                          "Speeding 16-20",
                          "Speeding 21+",
                          "Speed over 100mph",
                          "Speeding Violation-Major",
                          "Speeding Violation-Minor",
                          "Seat Belt",
                          "Suspension",
                          "Ticket Violation Not Listed",
                          "Towing",
                          "Transportation of Hazardous Materials",
                          "Unsafe Operation of a Motor Vehicle",
                          "Vehicle Theft",
                          "Wrong Way/Wrong Lane"
                        ]
                      },
                      "id": "bc58fe8c-2e55-42c2-a783-3fe023d924b1"
                    }
                  }
                },
                "id": "26a192ed-7d60-4d53-b8e4-90e412078e6f"
              },
              "CompLoss": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/CompLossType"
                },
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "type": "integer",
                      "id": "d4cd64fa-61c9-43e8-a9b4-5f245ea60cac",
                      "minimum": 0,
                      "exclusiveMinimum": true
                    },
                    "Date": {
                      "$ref": "#/definitions/DateType",
                      "typeDefinition": {
                        "type": "string"
                      },
                      "id": "c9f86c0b-becc-4163-8cf1-d8e2b9954032"
                    },
                    "Description": {
                      "$ref": "#/definitions/CompLossDescType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "FIRE",
                          "HIT ANIMAL",
                          "THEFT",
                          "TOWING",
                          "VANDALISM",
                          "GLASS",
                          "TORNADO/HURRICANE",
                          "FLOOD",
                          "WIND/HAIL",
                          "ALL OTHER"
                        ]
                      },
                      "id": "c6ab0c79-3415-44a5-8ec0-c90d04d982bb"
                    },
                    "Value": {
                      "$ref": "#/definitions/int999999",
                      "typeDefinition": {
                        "type": "integer",
                        "maximum": 999999,
                        "minimum": 0,
                        "exclusiveMinimum": false,
                        "exclusiveMaximum": false
                      },
                      "id": "e1a3383b-d79d-404c-a1d5-79c883b726d8"
                    },
                    "VehicleInvolved": {
                      "type": "string",
                      "id": "3d15a6bb-0f71-435b-916a-f9b27c511c2f"
                    }
                  }
                },
                "id": "7d4e0ee6-035e-4381-896a-a8b465473995"
              },
              "Rated": {
                "$ref": "#/definitions/RatedDriverType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Rated",
                    "Excluded",
                    "Non Rated",
                    "Never Licensed"
                  ]
                },
                "id": "5e8abb2b-c57e-4233-b495-8a3bf28ba761"
              },
              "SR22": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "43e60339-1bee-4a9c-8af5-268c2309d5d5"
              },
              "FR44": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "6ec282a3-4546-44c8-8688-8ed62acc232a"
              },
              "LicenseRevokedSuspended": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "958a31ce-20ae-4675-84cc-55bd4e3c26b3"
              }
            },
            "required": [
              "Name"
            ]
          },
          "id": "33cfd242-c59a-4c13-9063-c7d759ba38b6"
        }
      }
    },
    "$ref": "#/definitions/DriversType",
    "id": "28562383-4748-43b1-9b41-165cfa77bcce"
  },
  {
    "key": "Vehicles",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Vehicle": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleTypeType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "id": {
                "type": "integer",
                "id": "cf086ac7-2676-4e2e-b92a-9ef4625dcb68",
                "minimum": 0,
                "exclusiveMinimum": true
              },
              "UseVinLookup": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "81112656-5145-45e6-9967-50b9350c931c"
              },
              "UseVehicleLookupService": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "dc35b0dd-9016-4eca-94d8-0b41a9a4ae91"
              },
              "Year": {
                "$ref": "#/definitions/YearType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "2019",
                    "2018",
                    "2017",
                    "2016",
                    "2015",
                    "2014",
                    "2013",
                    "2012",
                    "2011",
                    "2010",
                    "2009",
                    "2008",
                    "2007",
                    "2006",
                    "2005",
                    "2004",
                    "2003",
                    "2002",
                    "2001",
                    "2000",
                    "1999",
                    "1998",
                    "1997",
                    "1996",
                    "1995",
                    "1994",
                    "1993",
                    "1992",
                    "1991",
                    "1990",
                    "1989",
                    "1988",
                    "1987",
                    "1986",
                    "1985",
                    "1984",
                    "1983",
                    "1982",
                    "1981",
                    "1980",
                    "1979",
                    "1978",
                    "1977",
                    "1976",
                    "1975",
                    "1974",
                    "1973",
                    "1972",
                    "1971",
                    "1970",
                    "1969",
                    "1968",
                    "1967",
                    "1966"
                  ]
                },
                "id": "21a0efde-7b37-46de-a6cb-7c69e33ea738"
              },
              "Vin": {
                "$ref": "#/definitions/VINType",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 17,
                  "minLength": 3
                },
                "id": "acac518b-ab46-437e-9f60-2cde539d56b4"
              },
              "Make": {
                "$ref": "#/definitions/C-50_NoBlank",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 50,
                  "minLength": 1
                },
                "id": "e678577c-4f49-40d6-b5af-860de71175a1"
              },
              "Model": {
                "$ref": "#/definitions/C-50",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 50
                },
                "id": "8df96591-cba0-4b2b-8a8f-60e6e2d1a05f"
              },
              "Sub-Model": {
                "$ref": "#/definitions/C-255",
                "typeDefinition": {
                  "type": "string",
                  "maxLength": 255
                },
                "id": "36bfc249-3d2f-434b-92cc-98346bad7201"
              },
              "Anti-Theft": {
                "$ref": "#/definitions/AntiTheftType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "None",
                    "Active",
                    "Alarm Only",
                    "Passive",
                    "Vehicle Recovery System",
                    "Both Active and Passive",
                    "VIN# Etching"
                  ]
                },
                "id": "2acb0bd2-5d8b-4a09-a324-509a8c41f61e"
              },
              "PassiveRestraints": {
                "$ref": "#/definitions/PassiveRestraintsType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "None",
                    "Automatic Seatbelts",
                    "Airbag (Drvr Side)",
                    "Auto Stbelts/Drvr Airbag",
                    "Airbag Both Sides",
                    "Auto Stbelts/Airbag Both"
                  ]
                },
                "id": "daa3b74a-f676-4314-ac49-1fd648051f82"
              },
              "AntiLockBrake": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "b4b07361-de9a-429d-ae06-be832640b492"
              },
              "DaytimeRunningLights": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "57584ad1-cd18-4c46-9972-d5c7e579c275"
              },
              "VehicleInspection": {
                "$ref": "#/definitions/VehicleInspectionType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Inspection Completed: No Damage",
                    "Inspection Completed: Damaged",
                    "No Inspection Needed",
                    "No Acknowledgement Form Attached",
                    "Acknowledgement Form Attached",
                    "Bill of Sale For New Vehicle"
                  ]
                },
                "id": "1724152a-4d6a-409f-b2da-58eec5ecaa15"
              }
            },
            "required": [
              "Year",
              "Make",
              "Model",
              "Sub-Model"
            ]
          },
          "id": "74d5f797-1da4-40ef-952a-e3760293f7cc"
        }
      }
    },
    "$ref": "#/definitions/VehiclesType",
    "id": "90eca1b2-dbcd-42fb-af8c-4824d0b55b73"
  },
  {
    "key": "VehiclesUse",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VehicleUse": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleUseType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "id": {
                "type": "integer",
                "id": "a99c6075-9cb1-4bc6-82da-d2b467f15393",
                "minimum": 0,
                "exclusiveMinimum": true
              },
              "Useage": {
                "$ref": "#/definitions/UseageType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Business",
                    "Farming",
                    "Pleasure",
                    "To/From Work",
                    "To/From School"
                  ]
                },
                "id": "a592f284-a3f0-4912-bfe0-6065dca00ef2"
              },
              "OneWayMiles": {
                "$ref": "#/definitions/int999",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 999,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "d3ed3188-31ac-4b84-8d5e-b55e50ca87a9"
              },
              "DaysPerWeek": {
                "$ref": "#/definitions/DaysPerWeekType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "7",
                    "6",
                    "5",
                    "4",
                    "3",
                    "2",
                    "1"
                  ]
                },
                "id": "b41bd042-abc7-49d8-ba0c-618ccee7ca75"
              },
              "WeeksPerMonth": {
                "$ref": "#/definitions/WeeksPerMonthType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "4",
                    "3",
                    "2",
                    "1"
                  ]
                },
                "id": "bac391ae-f2e8-424f-8641-c235e5195056"
              },
              "AnnualMiles": {
                "$ref": "#/definitions/int100000",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 100000,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "cbb703d8-db0d-49ef-a61e-91e0184881bf"
              },
              "Ownership": {
                "$ref": "#/definitions/AutoOwnershipType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Owned",
                    "Leased",
                    "Lien"
                  ]
                },
                "id": "c57ce0c5-89be-4381-b56f-c7cd68866936"
              },
              "Carpool": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "743aee2d-fbee-4534-b4bb-6ef10e5428b1"
              },
              "Odometer": {
                "$ref": "#/definitions/int999999",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 999999,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "f436a107-9176-4202-8bdb-3922b0baf3f5"
              },
              "Performance": {
                "$ref": "#/definitions/PerformanceType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Standard",
                    "Sports",
                    "Intermediate",
                    "High Performance"
                  ]
                },
                "id": "cd4cd0bc-b563-45d3-84e2-455a65ec5079"
              },
              "NewVehicle": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "e0c5cdb0-0530-44a6-9f1f-4f34ea0ed437"
              },
              "AdditionalModificationValue": {
                "$ref": "#/definitions/int100000",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 100000,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "227b2e75-5981-47ad-a1c4-fadb576b939b"
              },
              "AlternateGarage": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "7ce50939-2db3-4471-96a2-52a24f21e444"
              },
              "PrincipalOperator": {
                "$ref": "#/definitions/int10",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 10,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "8f3087e3-0b9a-4245-a72c-b20c0c2ab283"
              },
              "CostNew": {
                "$ref": "#/definitions/int999999",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 999999,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "a6aeecc8-3753-4b9d-b4e5-b8eb5c709caa"
              },
              "UsedForDelivery": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "230b8539-473c-4ea6-9a67-77c96566c739"
              },
              "PriorDamagePresent": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "996fe510-f1f0-429c-8847-00157f117d02"
              },
              "SnowPlow": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "362e1b98-4959-4169-9b82-7f9306d70b40"
              }
            }
          },
          "id": "08700da2-7175-437f-9169-ecdb5227570a"
        }
      }
    },
    "$ref": "#/definitions/VehiclesUseType",
    "id": "efaa5aac-28ca-4d53-959b-382c26df1e93"
  },
  {
    "key": "Coverages",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "GeneralCoverage": {
          "$ref": "#/definitions/GeneralCoverageType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "BI": {
                "$ref": "#/definitions/BIType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "State Minimum",
                    "10/20",
                    "12/25",
                    "12.5/25",
                    "15/30",
                    "20/40",
                    "20/50",
                    "25/25",
                    "25/50",
                    "25/65",
                    "30/60",
                    "50/50",
                    "50/100",
                    "100/100",
                    "100/300",
                    "200/600",
                    "250/500",
                    "300/300",
                    "500/500",
                    "500/1000",
                    "1000/1000",
                    "35 CSL",
                    "50 CSL",
                    "55 CSL",
                    "100 CSL",
                    "115 CSL",
                    "300 CSL",
                    "500 CSL",
                    "1000 CSL"
                  ]
                },
                "id": "28d65756-33d7-484f-bb1e-b7a6f6edc632"
              },
              "PD": {
                "$ref": "#/definitions/PDType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No Coverage",
                    "State Minimum",
                    "5000",
                    "7500",
                    "10000",
                    "15000",
                    "20000",
                    "25000",
                    "35000",
                    "50000",
                    "100000",
                    "250000",
                    "300000",
                    "500000"
                  ]
                },
                "id": "782c4bd2-e224-42bf-87c2-17be848f26f8"
              },
              "MP": {
                "$ref": "#/definitions/MPType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "None",
                    "500",
                    "1000",
                    "2000",
                    "2500",
                    "5000",
                    "10000",
                    "15000",
                    "25000",
                    "50000",
                    "100000"
                  ]
                },
                "id": "1603766c-1d61-48f3-8543-3b04f69ff4db"
              },
              "UM": {
                "$ref": "#/definitions/UMType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Reject",
                    "State Minimum",
                    "10/20",
                    "12/25",
                    "12.5/25",
                    "15/30",
                    "20/40",
                    "20/50",
                    "25/25",
                    "25/50",
                    "25/60",
                    "25/65",
                    "30/60",
                    "35/80",
                    "50/50",
                    "50/100",
                    "100/100",
                    "100/200",
                    "100/300",
                    "200/400",
                    "200/600",
                    "250/500",
                    "250/1000",
                    "300/300",
                    "300/500",
                    "500/500",
                    "500/1000",
                    "1000/1000",
                    "35 CSL",
                    "50 CSL",
                    "55 CSL",
                    "100 CSL",
                    "300 CSL",
                    "500 CSL",
                    "600 CSL",
                    "1000 CSL"
                  ]
                },
                "id": "0ccd3e9f-0ae2-4f9d-8b38-71191e42fdba"
              },
              "UIM": {
                "$ref": "#/definitions/UIMType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Reject",
                    "State Minimum",
                    "10/20",
                    "12/25",
                    "12.5/25",
                    "15/30",
                    "20/40",
                    "20/50",
                    "25/25",
                    "25/50",
                    "25/60",
                    "25/65",
                    "30/60",
                    "35/80",
                    "50/50",
                    "50/100",
                    "100/100",
                    "100/200",
                    "100/300",
                    "200/400",
                    "200/600",
                    "250/500",
                    "250/1000",
                    "300/300",
                    "300/500",
                    "500/500",
                    "500/1000",
                    "1000/1000",
                    "35 CSL",
                    "50 CSL",
                    "55 CSL",
                    "100 CSL",
                    "300 CSL",
                    "500 CSL",
                    "600 CSL",
                    "1000 CSL"
                  ]
                },
                "id": "1f388ee0-a61f-4db5-a627-3ba33aad0b3a"
              },
              "Multipolicy": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "eb24dcf4-c11d-415e-8a19-1f6bc9707e5b"
              },
              "RetirementCommunity": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "be1f5762-7a42-4cdc-bbd1-95c8b813f539"
              },
              "AAADiscount": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "434f014b-edef-4aa9-9b99-8c74194ddb19"
              },
              "Multicar": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "6fb715eb-944b-406c-ba01-94ceedce179a"
              }
            }
          },
          "id": "6128861f-0149-4d29-8768-a06073f36d33"
        },
        "VehicleCoverage": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleCoverageType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "id": {
                "type": "integer",
                "id": "233ca093-eee7-4061-b687-ce55987625d8",
                "minimum": 0,
                "exclusiveMinimum": true
              },
              "OtherCollisionDeductible": {
                "$ref": "#/definitions/OtherCollisionDeductibleType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No Coverage",
                    "0",
                    "50",
                    "100",
                    "200",
                    "250",
                    "300",
                    "500",
                    "750",
                    "1000",
                    "1500",
                    "2000",
                    "2500"
                  ]
                },
                "id": "8e599916-eeb8-4c5d-8cbd-7ca9e6c85a39"
              },
              "CollisionDeductible": {
                "$ref": "#/definitions/CollisionDeductibleType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No Coverage",
                    "0",
                    "50",
                    "100",
                    "200",
                    "250",
                    "300",
                    "500",
                    "750",
                    "1000",
                    "1500",
                    "2000",
                    "2500"
                  ]
                },
                "id": "7f24fcd1-97c9-43f0-80bc-ea0659637a32"
              },
              "FullGlass": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "e1a40e15-2dab-428d-8699-e41a4c10b7ac"
              },
              "TowingDeductible": {
                "$ref": "#/definitions/TowingDeductibleType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No Coverage",
                    "25",
                    "40",
                    "50",
                    "75",
                    "80",
                    "100",
                    "120",
                    "200",
                    "Unlimited"
                  ]
                },
                "id": "751408e3-1a60-4eb9-864f-4050e9523cad"
              },
              "RentalDeductible": {
                "$ref": "#/definitions/RentalDeductibleType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "No Coverage",
                    "15/450",
                    "20/600",
                    "25/750",
                    "30/900",
                    "35/1050",
                    "40/1200",
                    "45/1350",
                    "50/1500",
                    "75/2250",
                    "100/3000"
                  ]
                },
                "id": "18b0ebcf-b9a0-4783-909e-6b952fadcf09"
              },
              "LiabilityNotRequired": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "2a3aacc8-07fb-482b-871c-49b8a004ee53"
              },
              "LoanLeaseCoverage": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "38a74e1e-c529-43af-b9a1-1e41d1e37fd9"
              },
              "StatedAmount": {
                "$ref": "#/definitions/int100000",
                "typeDefinition": {
                  "type": "integer",
                  "maximum": 100000,
                  "minimum": 0,
                  "exclusiveMinimum": false,
                  "exclusiveMaximum": false
                },
                "id": "6739ebbe-9562-4821-88f5-011f17b7075d"
              },
              "ReplacementCost": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "125a818e-b771-4744-9ee6-eb6107e68d35"
              },
              "WaiverCollisionDamage": {
                "$ref": "#/definitions/BooleanType",
                "typeDefinition": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ]
                },
                "id": "256d07ef-c235-47c8-88cf-8f470f9351fd"
              }
            }
          },
          "id": "259917f9-262a-4674-9fea-707d1aaac2ff"
        },
        "StateSpecificCoverage": {
          "$ref": "#/definitions/StateSpecificCoverageType",
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "AR-Coverages": {
                "$ref": "#/definitions/AR-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "AR-PIP": {
                      "$ref": "#/definitions/AR-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "500",
                          "1000",
                          "2000",
                          "5000",
                          "10000",
                          "25000"
                        ]
                      },
                      "id": "6cc63428-680d-4164-ae9a-d1d0eca9a87d"
                    },
                    "AR-WorkLoss": {
                      "$ref": "#/definitions/WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Included",
                          "Excluded"
                        ]
                      },
                      "id": "59fd86da-992b-4180-bda8-13a832e171c3"
                    },
                    "AR-UMPD": {
                      "$ref": "#/definitions/AR-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "25000",
                          "50000",
                          "100000",
                          "300000"
                        ]
                      },
                      "id": "12105659-d9fd-40b7-8dc0-58b91a8f2b2c"
                    },
                    "AR-AccidentalDeath": {
                      "$ref": "#/definitions/AR-AccidentalDeathType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "5000",
                          "10000",
                          "15000",
                          "20000"
                        ]
                      },
                      "id": "c8b0621d-befd-4307-9d88-b2980aa10c23"
                    }
                  }
                },
                "id": "5d67be73-dcc0-4d51-a0ec-20a79d89b919"
              },
              "CA-Coverages": {
                "$ref": "#/definitions/CA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "CA-UMPD": {
                      "$ref": "#/definitions/CA-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "3500"
                        ]
                      },
                      "id": "1f903dc2-4168-4b11-9023-09e865188cb3"
                    }
                  }
                },
                "id": "2e342d92-3800-4d57-9703-85fa1881baae"
              },
              "CO-Coverages": {
                "$ref": "#/definitions/CO-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "CO-UMPD": {
                      "$ref": "#/definitions/CO-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "100",
                          "200",
                          "250",
                          "500",
                          "1000",
                          "2500"
                        ]
                      },
                      "id": "195049e9-0f05-4dc1-81e2-baea65f8b194"
                    }
                  }
                },
                "id": "01746f05-1291-44cc-9208-1ff58c92b1d3"
              },
              "CT-Coverages": {
                "$ref": "#/definitions/CT-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "CT-BRB": {
                      "$ref": "#/definitions/CT-BRBType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "Basic",
                          "Basic + 5000",
                          "Basic + 10000",
                          "Basic + 15000",
                          "Basic + 25000",
                          "Basic + 50000",
                          "Basic + 100000"
                        ]
                      },
                      "id": "c1a2be2c-9f60-41ba-bdca-3e3be2cab782"
                    },
                    "CT-WageLoss": {
                      "$ref": "#/definitions/CT-WageLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "200",
                          "300",
                          "400",
                          "500"
                        ]
                      },
                      "id": "96f4dd15-6078-46eb-8faf-8424c158eda8"
                    },
                    "CT-UMUIMConversion": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "afd6f10d-45b1-4b84-b55b-89b817b7cee7"
                    }
                  }
                },
                "id": "f0cbe48e-e019-47e2-bf8e-07b2c4c60ab4"
              },
              "DC-Coverages": {
                "$ref": "#/definitions/DC-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "DC-UMPD": {
                      "$ref": "#/definitions/DC-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "5000",
                          "10000",
                          "25000",
                          "50000",
                          "75000",
                          "100000"
                        ]
                      },
                      "id": "e2f9f563-2239-4c2b-9f95-4794c7f4ca48"
                    },
                    "DC-MedicalExpense": {
                      "$ref": "#/definitions/DC-MedicalExpenseType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "6fc8efc9-bcb5-45a8-8b48-6bb51e8bf6cf"
                    },
                    "DC-WorkLoss": {
                      "$ref": "#/definitions/DC-WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "12000",
                          "24000"
                        ]
                      },
                      "id": "69cfb1c0-615c-4227-8647-49da9ad2cae1"
                    },
                    "DC-FuneralExpense": {
                      "$ref": "#/definitions/DC-FuneralExpenseType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "4000"
                        ]
                      },
                      "id": "43b1f312-df20-4363-b8be-934bea12ea92"
                    }
                  }
                },
                "id": "fb7ab6fb-24a7-4805-bb57-344188846c59"
              },
              "DE-Coverages": {
                "$ref": "#/definitions/DE-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "DE-PIP": {
                      "$ref": "#/definitions/DE-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "15/30"
                        ]
                      },
                      "id": "b462264c-74be-4487-8ab7-85423522cfd7"
                    },
                    "DE-PIPDeductible": {
                      "$ref": "#/definitions/DE-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "250",
                          "500",
                          "1000",
                          "10000"
                        ]
                      },
                      "id": "6bb5b83d-c833-4a4a-be21-5991620f95cb"
                    },
                    "DE-PIPAppliesTo": {
                      "$ref": "#/definitions/DE-PIPAppliesToType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Named Insured",
                          "Named Insured and Relative(S)"
                        ]
                      },
                      "id": "ff8cfbc9-e64e-4aff-9820-f8107a07d597"
                    },
                    "DE-APIP": {
                      "$ref": "#/definitions/DE-APIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "20 Per Person",
                          "35 Per Person",
                          "50 Per Person",
                          "100 Per Person",
                          "300 Per Person",
                          "10 Per Person/20 Per Acc",
                          "20 Per Person/40 Per Acc",
                          "25 Per Person/50 Per Acc",
                          "50 Per Person/100 Per Acc",
                          "100 Per Person/300 Per Acc"
                        ]
                      },
                      "id": "fc1faf7a-f045-43ac-9dc9-08be3e41b214"
                    }
                  }
                },
                "id": "2091bf4c-48dd-463e-ba66-59bfa91d51e5"
              },
              "GA-Coverages": {
                "$ref": "#/definitions/GA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "GA-UMPD": {
                      "$ref": "#/definitions/GA-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "25/250 Ded",
                          "50/250 Ded",
                          "75/250 Ded",
                          "100/250 Ded",
                          "25/500 Ded",
                          "50/500 Ded",
                          "75/500 Ded",
                          "100/500 Ded",
                          "25/1000 Ded",
                          "50/1000 Ded",
                          "75/1000 Ded",
                          "100/1000 Ded"
                        ]
                      },
                      "id": "b551757e-7f77-4572-89f2-ea5d0d3faf26"
                    },
                    "GA-UM-OPTION": {
                      "$ref": "#/definitions/GA-UM-OPTIONType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Add-On",
                          "Reduced"
                        ]
                      },
                      "id": "c51452aa-d88e-4dae-aedb-139ad39d0cac"
                    }
                  }
                },
                "id": "dcffc736-2a5e-4128-9b4d-6cca552e9eff"
              },
              "FL-Coverages": {
                "$ref": "#/definitions/FL-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "FL-PIPDeductible": {
                      "$ref": "#/definitions/FL-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "250",
                          "500",
                          "1000"
                        ]
                      },
                      "id": "4d9d6bf1-422a-4fd4-9b63-ac8d086afee5"
                    },
                    "FL-PIPApplies": {
                      "$ref": "#/definitions/PIPAppliesType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Named Insured",
                          "Named Insured + Relatives"
                        ]
                      },
                      "id": "67c2ac7f-8a9a-4384-8959-39351bc5eaa7"
                    },
                    "FL-WageLoss": {
                      "$ref": "#/definitions/FL-WageLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Included",
                          "Excluded"
                        ]
                      },
                      "id": "30805504-32aa-4082-bb86-958397b62458"
                    },
                    "FL-PIPOptions": {
                      "$ref": "#/definitions/FL-PIPOptionsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Basic",
                          "Extended"
                        ]
                      },
                      "id": "e0458568-ada4-460f-8f0c-f7482ce808ba"
                    },
                    "FL-StackedUM": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "1b1310cf-f85f-43bf-90fa-cafd75c87e34"
                    }
                  }
                },
                "id": "b961be75-5705-4053-ab7d-071c3f5fd7d2"
              },
              "IL-Coverages": {
                "$ref": "#/definitions/IL-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "IL-UMPD": {
                      "$ref": "#/definitions/IL-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "99d08772-e85f-479f-bb64-21b18c720a84"
                    }
                  }
                },
                "id": "37414db1-2548-4565-976c-df40978dd6e0"
              },
              "IN-Coverages": {
                "$ref": "#/definitions/IN-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "IN-UMPD": {
                      "$ref": "#/definitions/UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "State Minimum",
                          "10000",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "9b327420-da17-4953-8d72-03883459f107"
                    }
                  }
                },
                "id": "dbbba439-bdc9-41cd-b30b-a678e62adab8"
              },
              "KY-Coverages": {
                "$ref": "#/definitions/KY-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "KY-PIP": {
                      "$ref": "#/definitions/KY-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "Basic-10000",
                          "20000",
                          "30000",
                          "40000",
                          "50000",
                          "75000",
                          "100000"
                        ]
                      },
                      "id": "f89d884c-13d6-4ae5-ab83-76d049ff11a1"
                    },
                    "KY-APIP": {
                      "$ref": "#/definitions/KY-APIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "1000",
                          "2000",
                          "3000",
                          "4000"
                        ]
                      },
                      "id": "6c6b4b30-06fc-491c-8b9b-d5b75aded2fa"
                    },
                    "KY-PIPDeductible": {
                      "$ref": "#/definitions/KY-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "250",
                          "500",
                          "1000"
                        ]
                      },
                      "id": "cc289743-81eb-41e2-a383-b022f542fe19"
                    },
                    "KY-TortLimitation": {
                      "$ref": "#/definitions/KY-TortLimitationType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Tort Limitation Not Rejected",
                          "Rejected By All Family Members",
                          "Rejected By Some Family Members"
                        ]
                      },
                      "id": "3d8ee9ce-0364-473c-861b-8142ecfd8532"
                    }
                  }
                },
                "id": "dbe5455f-779b-43ad-b670-180b39594541"
              },
              "KS-Coverages": {
                "$ref": "#/definitions/KS-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "KS-PIP": {
                      "$ref": "#/definitions/KS-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Basic - 4500",
                          "12500",
                          "27500"
                        ]
                      },
                      "id": "7c30f013-8c6e-4ab4-95a8-6bbfd908b6b4"
                    }
                  }
                },
                "id": "70614ff3-f5d6-48ef-bc00-ed0c8bf87e0d"
              },
              "MA-Coverages": {
                "$ref": "#/definitions/MA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MA-VehicleCoverages": {
                      "type": "array",
                      "maxItems": 6,
                      "minItems": 1,
                      "items": {
                        "$ref": "#/definitions/MA-VehicleCoveragesType"
                      },
                      "typeDefinition": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "id": {
                            "type": "integer",
                            "id": "bc7814b9-1c41-431c-9a28-95b66d2f7570",
                            "minimum": 0,
                            "exclusiveMinimum": true
                          },
                          "MA-BI": {
                            "$ref": "#/definitions/BIType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "State Minimum",
                                "10/20",
                                "12/25",
                                "12.5/25",
                                "15/30",
                                "20/40",
                                "20/50",
                                "25/25",
                                "25/50",
                                "25/65",
                                "30/60",
                                "50/50",
                                "50/100",
                                "100/100",
                                "100/300",
                                "200/600",
                                "250/500",
                                "300/300",
                                "500/500",
                                "500/1000",
                                "1000/1000",
                                "35 CSL",
                                "50 CSL",
                                "55 CSL",
                                "100 CSL",
                                "115 CSL",
                                "300 CSL",
                                "500 CSL",
                                "1000 CSL"
                              ]
                            },
                            "id": "71f1475f-24b0-4956-b8b2-392091f1285c"
                          },
                          "MA-PD": {
                            "$ref": "#/definitions/PDType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "No Coverage",
                                "State Minimum",
                                "5000",
                                "7500",
                                "10000",
                                "15000",
                                "20000",
                                "25000",
                                "35000",
                                "50000",
                                "100000",
                                "250000",
                                "300000",
                                "500000"
                              ]
                            },
                            "id": "45b6cebd-79d2-478f-9807-473acc339bdb"
                          },
                          "MA-UM": {
                            "$ref": "#/definitions/UMType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "Reject",
                                "State Minimum",
                                "10/20",
                                "12/25",
                                "12.5/25",
                                "15/30",
                                "20/40",
                                "20/50",
                                "25/25",
                                "25/50",
                                "25/60",
                                "25/65",
                                "30/60",
                                "35/80",
                                "50/50",
                                "50/100",
                                "100/100",
                                "100/200",
                                "100/300",
                                "200/400",
                                "200/600",
                                "250/500",
                                "250/1000",
                                "300/300",
                                "300/500",
                                "500/500",
                                "500/1000",
                                "1000/1000",
                                "35 CSL",
                                "50 CSL",
                                "55 CSL",
                                "100 CSL",
                                "300 CSL",
                                "500 CSL",
                                "600 CSL",
                                "1000 CSL"
                              ]
                            },
                            "id": "12eed8cd-1a23-4518-a135-ed4cebf45cdd"
                          },
                          "MA-UIM": {
                            "$ref": "#/definitions/UIMType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "Reject",
                                "State Minimum",
                                "10/20",
                                "12/25",
                                "12.5/25",
                                "15/30",
                                "20/40",
                                "20/50",
                                "25/25",
                                "25/50",
                                "25/60",
                                "25/65",
                                "30/60",
                                "35/80",
                                "50/50",
                                "50/100",
                                "100/100",
                                "100/200",
                                "100/300",
                                "200/400",
                                "200/600",
                                "250/500",
                                "250/1000",
                                "300/300",
                                "300/500",
                                "500/500",
                                "500/1000",
                                "1000/1000",
                                "35 CSL",
                                "50 CSL",
                                "55 CSL",
                                "100 CSL",
                                "300 CSL",
                                "500 CSL",
                                "600 CSL",
                                "1000 CSL"
                              ]
                            },
                            "id": "6757b740-5c14-4d72-982d-535c77f18202"
                          },
                          "MA-MP": {
                            "$ref": "#/definitions/MPType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "None",
                                "500",
                                "1000",
                                "2000",
                                "2500",
                                "5000",
                                "10000",
                                "15000",
                                "25000",
                                "50000",
                                "100000"
                              ]
                            },
                            "id": "7aa98502-6df4-469b-b9db-d40b897348d6"
                          },
                          "MA-OPTBI": {
                            "$ref": "#/definitions/MA-OPTBIType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "No Coverage",
                                "20/40",
                                "20/50",
                                "25/50",
                                "25/60",
                                "35/80",
                                "50/100",
                                "100/100",
                                "100/200",
                                "100/300",
                                "200/400",
                                "250/500",
                                "250/1000",
                                "300/500",
                                "500/500",
                                "500/1000"
                              ]
                            },
                            "id": "5ed30306-3029-435c-badd-60ef2f41eacf"
                          },
                          "MA-PIPDED": {
                            "$ref": "#/definitions/MA-PIPDEDType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "FC/0 Ded",
                                "100 Insured",
                                "250 Insured",
                                "500 Insured",
                                "1000 Insured",
                                "2000 Insured",
                                "4000 Insured",
                                "8000 Insured",
                                "100 Insured And Household Members",
                                "250 Insured And Household Members",
                                "500 Insured And Household Members",
                                "1000 Insured And Household Members",
                                "2000 Insured And Household Members",
                                "4000 Insured And Household Members",
                                "8000 Insured And Household Members"
                              ]
                            },
                            "id": "3db61e39-b852-488b-9470-6f6d23ec7cbb"
                          },
                          "MA-LIMCOLLDED": {
                            "$ref": "#/definitions/MA-LIMCOLLDEDType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "No Coverage",
                                "FC/0 Ded",
                                "300",
                                "500",
                                "1000",
                                "2000"
                              ]
                            },
                            "id": "a074e4d3-602d-402d-a39f-4f6d1479d5db"
                          },
                          "MA-WAIVECOLLDED": {
                            "$ref": "#/definitions/BooleanType",
                            "typeDefinition": {
                              "type": "string",
                              "enum": [
                                "Yes",
                                "No"
                              ]
                            },
                            "id": "59d5e6ad-ca71-4edc-b375-5b62870b390f"
                          }
                        }
                      },
                      "id": "d818202e-67e5-4ca6-917c-956c533036ad"
                    },
                    "MA-ApplySameCoverageLimits": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "378a71ef-cdd6-410d-926b-3b01a81811fe"
                    }
                  }
                },
                "id": "a5543dcf-f7bf-4217-b552-451e0d7d1283"
              },
              "MD-Coverages": {
                "$ref": "#/definitions/MD-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MD-UMPD": {
                      "$ref": "#/definitions/MD-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "15000",
                          "25000",
                          "50000",
                          "100000",
                          "250000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "f3201c46-ae5d-44c9-9005-19580b5622bf"
                    },
                    "MD-PIP": {
                      "$ref": "#/definitions/MD-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Waived",
                          "2500 Full Coverage",
                          "2500 Excluding Family",
                          "5000 Full Coverage",
                          "5000 Excluding Family",
                          "10000 Full Coverage",
                          "10000 Excluding Family"
                        ]
                      },
                      "id": "38ea9552-6394-4644-ba4b-b9470e8d27ac"
                    },
                    "MD-EUIM": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "12d614f0-0276-40ab-b616-97c0f64c73bf"
                    }
                  }
                },
                "id": "7bf794f1-ef5e-48bf-bb40-48c85cee454d"
              },
              "MI-Coverages": {
                "$ref": "#/definitions/MI-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MI-PropertyProtectionInsurance": {
                      "$ref": "#/definitions/MI-PropertyProtectionInsuranceType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "1000000"
                        ]
                      },
                      "id": "26a229d9-5505-45b8-a927-8cd1c76cedad"
                    },
                    "MI-PIP": {
                      "$ref": "#/definitions/MI-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Full Medical/Full Wage",
                          "Medical Excess",
                          "Wage Excess",
                          "Excess Medical/Excess Wage"
                        ]
                      },
                      "id": "7e32799c-44e7-464f-83b4-0f747bd24760"
                    },
                    "MI-PIPDeductible": {
                      "$ref": "#/definitions/MI-PIPDeductible",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Ded",
                          "100",
                          "200",
                          "300",
                          "500"
                        ]
                      },
                      "id": "4983a980-ee17-410d-bc31-57fc0150cf3f"
                    },
                    "MI-PIPWorkLossWaiver": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "e98482d5-fe65-43f8-940a-7acdfeeca27e"
                    },
                    "MI-UMPD": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "c0e88c74-92f9-4eb5-bcea-619692306326"
                    }
                  }
                },
                "id": "41a8bcc0-c43b-4d6d-96f7-7a60482563d9"
              },
              "MN-Coverages": {
                "$ref": "#/definitions/MN-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MN-PIPOptions": {
                      "$ref": "#/definitions/MN-PIPOptionsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "BASIC",
                          "BASIC+10K MED EXP",
                          "BASIC+20K MED EXP",
                          "BASIC+30K MED EXP",
                          "BASIC+30K MED EXP/15K WL",
                          "BASIC+55K MED EXP/15K WL",
                          "BASIC+80K MED EXP/40K WL"
                        ]
                      },
                      "id": "44920b44-fdcf-4ba5-b6c1-af9b664ccaaa"
                    },
                    "MN-PIPStacking": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "c1b57921-18c1-4837-8e26-3ef9db8a8047"
                    },
                    "MN-WorkLoss": {
                      "$ref": "#/definitions/WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Included",
                          "Excluded"
                        ]
                      },
                      "id": "af78b6b3-a63c-4e25-bf8b-72846cb7b856"
                    },
                    "MN-PIPDeductible": {
                      "$ref": "#/definitions/MN-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "100 MED/200WL",
                          "100 MED"
                        ]
                      },
                      "id": "b3f5e366-d824-4f48-80b0-bb2355518c1b"
                    }
                  }
                },
                "id": "330ec580-2ea1-4235-bd7d-ebbb62227616"
              },
              "MS-Coverages": {
                "$ref": "#/definitions/MS-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MS-UMPD": {
                      "$ref": "#/definitions/MS-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "25000",
                          "50000",
                          "100000",
                          "250000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "e8ee0ba3-7330-4396-b1f7-e083b2b5dedf"
                    }
                  }
                },
                "id": "647796ab-69a6-40cc-99e3-539646f8a162"
              },
              "MT-Coverages": {
                "$ref": "#/definitions/MT-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "MT-UMPD": {
                      "$ref": "#/definitions/MT-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "25000",
                          "50000"
                        ]
                      },
                      "id": "a390abea-2cf4-49df-b069-ee7a230d3e35"
                    }
                  }
                },
                "id": "e95f010f-ba71-40b4-9b80-1b9be2e66041"
              },
              "NC-Coverages": {
                "$ref": "#/definitions/NC-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "NC-UMPD": {
                      "$ref": "#/definitions/NC-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "25000",
                          "50000",
                          "100000",
                          "250000",
                          "500000"
                        ]
                      },
                      "id": "ab7b1083-6bef-4d40-8d93-442d38a29495"
                    }
                  }
                },
                "id": "f941d349-3ac1-4db5-bfa2-edd8f85bcc03"
              },
              "ND-Coverages": {
                "$ref": "#/definitions/ND-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "ND-PIP": {
                      "$ref": "#/definitions/ND-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "30000",
                          "40000",
                          "50000",
                          "80000",
                          "100000",
                          "110000"
                        ]
                      },
                      "id": "01beca7d-b0aa-4a4b-af35-82fc6baf6787"
                    }
                  }
                },
                "id": "f9386418-91b3-4a94-8a09-8cb39e132c93"
              },
              "NJ-Coverages": {
                "$ref": "#/definitions/NJ-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "NJ-HEALTHCARE": {
                      "$ref": "#/definitions/NJ-HEALTHCAREType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Primary",
                          "Secondary"
                        ]
                      },
                      "id": "4d508ee5-d421-48e0-94dc-b7b05d00a4ac"
                    },
                    "NJ-PIP": {
                      "$ref": "#/definitions/NJ-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "15000",
                          "50000",
                          "75000",
                          "150000",
                          "250000"
                        ]
                      },
                      "id": "26733b17-c212-48d2-af82-79dcbeaeacda"
                    },
                    "NJ-PIPDEDUCTIBLE": {
                      "$ref": "#/definitions/NJ-PIPDEDUCTIBLEType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "250",
                          "500",
                          "1000",
                          "2000",
                          "2500"
                        ]
                      },
                      "id": "ac762e4b-2974-474b-b30d-bef730f500b8"
                    },
                    "NJ-APIP": {
                      "$ref": "#/definitions/NJ-APIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "100 - 10400/ LIMITED",
                          "125 - 13000/ LIMITED",
                          "175 - 18200/ LIMITED",
                          "250 - 26000/ LIMITED",
                          "400 - 41600/ LIMITED",
                          "500 - 52000/ LIMITED",
                          "600 - 62400/ LIMITED",
                          "700 - 72800/ LIMITED",
                          "100/ UNLIMITED",
                          "125/ UNLIMITED",
                          "175/ UNLIMITED",
                          "250/ UNLIMITED",
                          "400/ UNLIMITED",
                          "500/ UNLIMITED",
                          "600/ UNLIMITED",
                          "700/ UNLIMITED"
                        ]
                      },
                      "id": "5256b6d2-0e9e-413d-92c0-db9a26171be3"
                    },
                    "NJ-THRESHOLD": {
                      "$ref": "#/definitions/NJ-THRESHOLD",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Verbal Threshold",
                          "Zero Threshold"
                        ]
                      },
                      "id": "0f8eabf8-b60f-4146-bac0-bc444500a0a3"
                    },
                    "NJ-UMPD": {
                      "$ref": "#/definitions/NJ-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "5000",
                          "10000",
                          "25000",
                          "35000",
                          "50000",
                          "100000",
                          "200000",
                          "250000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "ce44a773-2997-45b0-bf8f-cc51034ce85f"
                    },
                    "NJ-EXTENDEDMEDICAL": {
                      "$ref": "#/definitions/NJ-EXTENDEDMEDICALType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "1000",
                          "10000"
                        ]
                      },
                      "id": "2dd9ea50-d9ae-4fe5-985a-865c9abe9d4d"
                    }
                  }
                },
                "id": "946417a2-9c15-4723-879f-dc918fdc6d7c"
              },
              "NM-Coverages": {
                "$ref": "#/definitions/NM-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "NM-UMPD": {
                      "$ref": "#/definitions/UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "State Minimum",
                          "10000",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "29acf1c5-d8bb-414f-a9aa-f6744d2ea2e7"
                    }
                  }
                },
                "id": "c2cc88cb-c5ed-4b1f-a430-acf7cd5e42cb"
              },
              "NY-Coverages": {
                "$ref": "#/definitions/NY-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "NY-OBEL": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "2f540825-1f9c-43d9-a927-989f3e81f2c0"
                    },
                    "NY-PIPDeductible": {
                      "$ref": "#/definitions/NY-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "100",
                          "200",
                          "250"
                        ]
                      },
                      "id": "578af8ad-69d0-4e1a-8cbc-1c0a7f1f4060"
                    },
                    "NY-PIPOptions": {
                      "$ref": "#/definitions/NY-PIPOptionsType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Basic",
                          "Basic+25000",
                          "Basic+50000",
                          "Basic+100000"
                        ]
                      },
                      "id": "8c6bba21-33d1-4a82-b4ee-3f5637ad692e"
                    },
                    "NY-Supplemental": {
                      "$ref": "#/definitions/NY-SupplementalType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Basic",
                          "25/50",
                          "50/100",
                          "100/300",
                          "250/500",
                          "100/100",
                          "300/300",
                          "500/500"
                        ]
                      },
                      "id": "61f6a578-b245-4dfe-a6f3-dd9562c34290"
                    },
                    "NY-APIP": {
                      "$ref": "#/definitions/NY-APIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "75d166a4-e89a-4a52-97d0-6c287a8bdc42"
                    },
                    "NY-WorkLoss": {
                      "$ref": "#/definitions/WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Included",
                          "Excluded"
                        ]
                      },
                      "id": "10eec2c9-e43f-452a-97d7-168693fe9d26"
                    },
                    "NY-AdditionalDeath": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "b03d55ac-7ea6-4149-b5c8-3cedbaba9c91"
                    },
                    "NY-MedicalExpenseExclusion": {
                      "$ref": "#/definitions/NY-MedicalExpenseExclusionType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "Named Insured Only",
                          "Named Insured + Relatives"
                        ]
                      },
                      "id": "b8da21c1-f3db-4a8d-94c8-6a8608d066f8"
                    },
                    "NY-SupplementalSpousalLiability": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "2f30a3da-97ad-44c5-9878-58ec0d0b7150"
                    }
                  }
                },
                "id": "00e4fe1f-1775-4671-b813-884d81a3a92f"
              },
              "OH-Coverages": {
                "$ref": "#/definitions/OH-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "OH-UMPD": {
                      "$ref": "#/definitions/OH-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "7500",
                          "10000",
                          "25000"
                        ]
                      },
                      "id": "970adff0-4df3-40fc-b0cc-f65f35bd2e82"
                    }
                  }
                },
                "id": "c7c8b40c-9d6e-46f2-b678-c98ff90e761e"
              },
              "OR-Coverages": {
                "$ref": "#/definitions/OR-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "OR-PIP": {
                      "$ref": "#/definitions/OR-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "15000 BASIC",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "466ac24d-6213-482a-8bca-120000b7582c"
                    },
                    "OR-PIPDeductible": {
                      "$ref": "#/definitions/OR-PIPDeductibleType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "0",
                          "100",
                          "250"
                        ]
                      },
                      "id": "90ba6189-77fa-44bb-bd0c-748424d1cd4a"
                    },
                    "OR-PIPAppliesTo": {
                      "$ref": "#/definitions/PIPAppliesType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Named Insured",
                          "Named Insured + Relatives"
                        ]
                      },
                      "id": "0e8ebbde-25d9-4769-b922-15aabecedd66"
                    },
                    "OR-UMPD": {
                      "$ref": "#/definitions/UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "State Minimum",
                          "10000",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "57553b81-d60c-4d5d-b4d8-16d6e8f101f4"
                    }
                  }
                },
                "id": "a7d9ebab-3e7f-4e57-8bfe-f47faa8c1896"
              },
              "PA-Coverages": {
                "$ref": "#/definitions/PA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "PA-AccidentalDeath": {
                      "$ref": "#/definitions/PA-ADBType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "5000",
                          "10000",
                          "15000",
                          "25000"
                        ]
                      },
                      "id": "5451ad51-e4c3-412e-a752-6facc5bc442b"
                    },
                    "PA-StackedUM": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "6d337c9a-e5be-4147-a1b8-f5b3024c731a"
                    },
                    "PA-StackedUIM": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "22fab7c8-4bbb-47cd-b7ac-6bd9632ae033"
                    },
                    "PA-FuneralExpense": {
                      "$ref": "#/definitions/PA-FuneralExpType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "1500",
                          "2500"
                        ]
                      },
                      "id": "1809d32e-f44a-457e-97ca-9d440865316f"
                    },
                    "PA-WorkLoss": {
                      "$ref": "#/definitions/PA-WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "1000/5000",
                          "1000/15000",
                          "1500/25000",
                          "2500/50000"
                        ]
                      },
                      "id": "28bc28f1-3f58-436f-8d1e-8e9e4c3a21af"
                    },
                    "PA-TortLimitation": {
                      "$ref": "#/definitions/PA-TortLimitationType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Full",
                          "Limited"
                        ]
                      },
                      "id": "713f942a-3222-49af-819d-29c3c7582a98"
                    },
                    "PA-CombinationFirstParty": {
                      "$ref": "#/definitions/PA-CFPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "Addl First Party Benefits",
                          "Combo First Party Benefits - 50000",
                          "Combo First Party Benefits - 100000",
                          "Combo First Party Benefits - 177500"
                        ]
                      },
                      "id": "dd55ed88-611a-45ef-ac3c-569190b02e62"
                    },
                    "PA-FirstParty": {
                      "$ref": "#/definitions/PA-FirstPartyType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "5000",
                          "10000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "1c7a648d-4933-4492-add6-34ef9096f604"
                    },
                    "PA-ExtraMedicalExp": {
                      "$ref": "#/definitions/PA-ExtraMedicalExpType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "100000",
                          "300000",
                          "500000",
                          "1000000"
                        ]
                      },
                      "id": "04c2524a-a180-4947-a83a-65b5b6664eb3"
                    }
                  }
                },
                "id": "2badaad8-cb81-437c-b31f-46358fd1eafe"
              },
              "RI-Coverages": {
                "$ref": "#/definitions/RI-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "RI-UMPD": {
                      "$ref": "#/definitions/RI-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "25000",
                          "50000",
                          "100000",
                          "250000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "333c3f1e-1ade-4d26-bc0a-62bfe9b5aaae"
                    }
                  }
                },
                "id": "1f183bac-2626-410e-9f89-100f6bb14e97"
              },
              "SC-Coverages": {
                "$ref": "#/definitions/SC-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "SC-UMPD": {
                      "$ref": "#/definitions/SC-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "25000",
                          "50000",
                          "100000",
                          "200000"
                        ]
                      },
                      "id": "97088b41-b770-49f5-8a2c-2be0fbda1787"
                    }
                  }
                },
                "id": "563ae56f-0d28-40da-b8e5-7f206e9750aa"
              },
              "TN-Coverages": {
                "$ref": "#/definitions/TN-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "TN-UMPD": {
                      "$ref": "#/definitions/TN-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Reject",
                          "10000",
                          "15000",
                          "25000",
                          "50000",
                          "100000",
                          "200000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "d142d1c8-8259-4bfa-ae02-b10671cc84a9"
                    }
                  }
                },
                "id": "f1862aa0-6346-4afd-a8a9-91b4905fa751"
              },
              "TX-Coverages": {
                "$ref": "#/definitions/TX-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "TX-PIP": {
                      "$ref": "#/definitions/TX-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "2500",
                          "5000",
                          "10000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "5e8f69ee-53ae-4d35-b99d-9d5c5553ae67"
                    },
                    "TX-AutoDeathIndemnity": {
                      "$ref": "#/definitions/TX-AutoDeathIndemnityType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "5000",
                          "10000"
                        ]
                      },
                      "id": "3fad7597-acc7-40a8-b03d-1aa678dd10d1"
                    },
                    "TX-UMPD": {
                      "$ref": "#/definitions/UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "State Minimum",
                          "10000",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "4a8a81a2-0f90-448b-988d-729cc2128aba"
                    }
                  }
                },
                "id": "0e793ef0-bc96-4f5e-a707-a760d590c328"
              },
              "UT-Coverages": {
                "$ref": "#/definitions/UT-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "UT-PIP": {
                      "$ref": "#/definitions/UT-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "3000",
                          "5000",
                          "10000",
                          "25000"
                        ]
                      },
                      "id": "2345a031-67c5-45e7-9402-0de0c8c4f9ab"
                    },
                    "UT-WorkLoss": {
                      "$ref": "#/definitions/UT-WorkLossType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Accept",
                          "Reject"
                        ]
                      },
                      "id": "f970ced3-3c49-4209-bd80-afa352c24d05"
                    },
                    "UT-UMPD": {
                      "$ref": "#/definitions/UT-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "None",
                          "3500"
                        ]
                      },
                      "id": "b7cb40d9-fdb0-4574-9536-a91eeff1b57e"
                    },
                    "UT-APIP": {
                      "$ref": "#/definitions/UT-APIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "5000",
                          "10000"
                        ]
                      },
                      "id": "177bf60a-944c-48ee-97d7-9e3b79b0202b"
                    }
                  }
                },
                "id": "8d2b41a2-795f-47f9-bd87-88bdf325558e"
              },
              "VA-Coverages": {
                "$ref": "#/definitions/VA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "VA-UMPD": {
                      "$ref": "#/definitions/VA-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "20000",
                          "25000",
                          "50000",
                          "100000",
                          "250000",
                          "300000",
                          "500000"
                        ]
                      },
                      "id": "0dbe0fd0-b28f-41f4-b12c-9a1b4848a2b8"
                    },
                    "VA-INCOMELOSS": {
                      "$ref": "#/definitions/VA-INCOMELOSSType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "ACCEPT",
                          "REJECT"
                        ]
                      },
                      "id": "74f640a1-71fc-48e7-9e00-da5d99bf9af6"
                    }
                  }
                },
                "id": "216a5fa1-2809-4536-afe9-9387391f7fa7"
              },
              "WA-Coverages": {
                "$ref": "#/definitions/WA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "WA-PIP": {
                      "$ref": "#/definitions/WA-PIPType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "10000",
                          "35000"
                        ]
                      },
                      "id": "5f55889d-6b69-499a-9690-f361a5d280b7"
                    },
                    "WA-UMPD": {
                      "$ref": "#/definitions/UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "State Minimum",
                          "10000",
                          "15000",
                          "20000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "d0368617-51b7-4533-b730-00813ee8379b"
                    },
                    "WA-APIP": {
                      "$ref": "#/definitions/BooleanType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "Yes",
                          "No"
                        ]
                      },
                      "id": "e4ac017e-1165-4d62-afb8-6d141cd5c5b3"
                    }
                  }
                },
                "id": "3f9fa204-9ef6-4abb-a859-65364b05870d"
              },
              "WV-Coverages": {
                "$ref": "#/definitions/WV-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "WV-UMPD": {
                      "$ref": "#/definitions/WV-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "10000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "8317b597-ba0f-496d-8b84-9a51721e520a"
                    },
                    "WV-UIMPD": {
                      "$ref": "#/definitions/WV-UIMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "10000",
                          "25000",
                          "50000",
                          "100000"
                        ]
                      },
                      "id": "417c869c-da2c-4416-9b5b-70f5e83dcc9f"
                    }
                  }
                },
                "id": "e7000824-14e6-44d0-9788-55da962849dd"
              },
              "VT-Coverages": {
                "$ref": "#/definitions/VT-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "VT-UMPD": {
                      "$ref": "#/definitions/VT-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "10000"
                        ]
                      },
                      "id": "92584c3d-4f7b-4b6c-ab6b-b4e93fa8aed1"
                    }
                  }
                },
                "id": "b99b4092-a94b-4b6a-9674-dfb1ae5619a9"
              },
              "ID-Coverages": {
                "$ref": "#/definitions/ID-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "ID-UMPD": {
                      "$ref": "#/definitions/ID-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "25000",
                          "50000"
                        ]
                      },
                      "id": "f72e9b6b-dce7-4838-9a4f-76b2cc7a4c58"
                    }
                  }
                },
                "id": "f9dae9ff-4749-4ecb-9e5e-1ab0983211c0"
              },
              "LA-Coverages": {
                "$ref": "#/definitions/LA-StateSpecific",
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "LA-UMPD": {
                      "$ref": "#/definitions/LA-UMPDType",
                      "typeDefinition": {
                        "type": "string",
                        "enum": [
                          "No Coverage",
                          "25000"
                        ]
                      },
                      "id": "547f0ffb-6cec-4b18-a772-d63fd6a85c05"
                    }
                  }
                },
                "id": "16745cd7-f355-4383-9ed1-4376e2d75dcf"
              }
            }
          },
          "id": "5e9ec321-44df-43ec-9188-14b967aa1802"
        }
      },
      "required": [
        "GeneralCoverage"
      ]
    },
    "$ref": "#/definitions/CoveragesType",
    "id": "f0bdd071-44ce-4577-816a-af5a7554701f"
  },
  {
    "key": "VehicleAssignments",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VehicleAssignment": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleAssignmentType"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "id": {
                "type": "integer",
                "id": "9608b65d-f9ad-4a9d-b675-7a4a2d12a24b",
                "minimum": 0,
                "exclusiveMinimum": true
              },
              "DriverAssignment": {
                "type": "array",
                "maxItems": 6,
                "minItems": 1,
                "items": {
                  "$ref": "#/definitions/DriverAssignmentType"
                },
                "typeDefinition": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "id": {
                      "type": "integer",
                      "id": "113a6555-6fb8-4b73-80cc-b7ba5a72a09e",
                      "minimum": 0,
                      "exclusiveMinimum": true
                    }
                  }
                },
                "id": "eb39e4b6-a3a1-402d-be38-01d1ec20995a"
              }
            }
          },
          "id": "79770815-ebf1-48ff-857f-19f4c282ee6f"
        }
      }
    },
    "$ref": "#/definitions/VehicleAssignmentsType",
    "id": "ddf37186-3f86-4e0b-9c6f-08682d4d4f05"
  },
  {
    "key": "GeneralInfo",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "RatingStateCode": {
          "$ref": "#/definitions/StateCodeType",
          "typeDefinition": {
            "type": "string",
            "enum": [
              "AK",
              "AL",
              "AR",
              "AZ",
              "CA",
              "CO",
              "CT",
              "DC",
              "DE",
              "FL",
              "GA",
              "HI",
              "IA",
              "ID",
              "IL",
              "IN",
              "KS",
              "KY",
              "LA",
              "MA",
              "MD",
              "ME",
              "MI",
              "MN",
              "MO",
              "MS",
              "MT",
              "NC",
              "ND",
              "NE",
              "NH",
              "NJ",
              "NM",
              "NV",
              "NY",
              "OH",
              "OK",
              "OR",
              "PA",
              "RI",
              "SC",
              "SD",
              "TN",
              "TX",
              "UT",
              "VA",
              "VT",
              "WA",
              "WI",
              "WV",
              "WY"
            ]
          },
          "id": "23029fc1-b91f-4f7d-ab6e-b49b9c77839d"
        },
        "Comments": {
          "type": "string",
          "id": "ad67e6bd-1037-4c18-a95c-4a19993740cb"
        }
      },
      "required": [
        "RatingStateCode"
      ]
    },
    "$ref": "#/definitions/GeneralInfoType",
    "id": "61fac193-5c52-4ea0-9450-922b7b7ea24b"
  },
  {
    "key": "ExtendedInfo",
    "typeDefinition": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "name": {
          "type": "string",
          "id": "fe9f51ae-8f90-404c-b514-72564f92928a"
        },
        "typename": {
          "type": "string",
          "id": "77ae084b-9313-489c-b887-5f4605117d0f"
        },
        "valuepair": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/NVPair"
          },
          "typeDefinition": {
            "type": "object",
            "additionalProperties": true,
            "properties": {
              "name": {
                "type": "string",
                "id": "afa609ed-fa5a-4aa7-bdfa-bcbd8a480c35"
              },
              "value": {
                "type": "string",
                "id": "30eaba2a-10fc-422d-b697-dfe7633cf8a3"
              }
            },
            "required": [
              "value"
            ]
          },
          "id": "784f162e-c20b-432f-8109-a2a9906e3c04"
        }
      }
    },
    "type": "array",
    "items": {
      "$ref": "#/definitions/ExtendedInfoType"
    },
    "id": "f9061e55-5474-4209-985e-8c965415b32b"
  }
];
