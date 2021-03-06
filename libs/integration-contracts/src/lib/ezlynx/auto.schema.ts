export const ezLynxAutoSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "EZAUTO": {
      "$ref": "#/definitions/EZAUTOType"
    }
  },
  "required": [
    "EZAUTO"
  ],
  "definitions": {
    "EZAUTO": {},
    "NameType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Prefix": {
          "$ref": "#/definitions/NamePrefixType"
        },
        "FirstName": {
          "$ref": "#/definitions/ProperName"
        },
        "MiddleName": {
          "$ref": "#/definitions/MiddleInitial"
        },
        "LastName": {
          "$ref": "#/definitions/ProperName"
        },
        "Suffix": {
          "$ref": "#/definitions/NameSuffixType"
        }
      },
      "required": [
        "FirstName",
        "LastName"
      ]
    },
    "PersonalInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Name": {
          "$ref": "#/definitions/NameType"
        },
        "DOB": {
          "$ref": "#/definitions/DateType"
        },
        "SSN": {
          "$ref": "#/definitions/SSNType"
        },
        "Gender": {
          "$ref": "#/definitions/GenderType"
        },
        "MaritalStatus": {
          "$ref": "#/definitions/MaritalStatusType"
        },
        "Industry": {
          "type": "string"
        },
        "Occupation": {
          "type": "string"
        },
        "YearsWithEmployer": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": false
        },
        "YearsWithPreviousEmployer": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": false
        },
        "Education": {
          "$ref": "#/definitions/EducationType"
        },
        "LicensedToDrive": {
          "$ref": "#/definitions/BooleanType"
        },
        "Relation": {
          "$ref": "#/definitions/RelationType"
        },
        "MaidenName": {
          "type": "string"
        },
        "NickName": {
          "type": "string"
        }
      },
      "required": [
        "Name"
      ]
    },
    "DetailAddrType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "StreetName": {
          "$ref": "#/definitions/C-255"
        },
        "StreetNumber": {
          "$ref": "#/definitions/C-50"
        },
        "UnitNumber": {
          "$ref": "#/definitions/C-50"
        }
      },
      "required": [
        "StreetName",
        "StreetNumber"
      ]
    },
    "AddressType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "AddressCode": {
          "$ref": "#/definitions/AddressCodeType"
        },
        "Addr1": {
          "$ref": "#/definitions/DetailAddrType"
        },
        "Addr2": {
          "$ref": "#/definitions/C-255"
        },
        "City": {
          "$ref": "#/definitions/C-50"
        },
        "StateCode": {
          "$ref": "#/definitions/StateCodeType"
        },
        "County": {
          "$ref": "#/definitions/C-50"
        },
        "Zip5": {
          "$ref": "#/definitions/Zip5Type"
        },
        "Zip4": {
          "$ref": "#/definitions/Zip4Type"
        },
        "Phone": {
          "type": "object",
          "additionalProperties": true,
          "properties": {
            "id": {
              "type": "string"
            },
            "PhoneType": {
              "$ref": "#/definitions/PhoneTypeType"
            },
            "PhoneNumberType": {
              "$ref": "#/definitions/PhoneNumberTypeType"
            },
            "PhoneNumber": {
              "$ref": "#/definitions/PhoneNumberType"
            },
            "Extension": {
              "$ref": "#/definitions/C-10"
            }
          },
          "required": [
            "PhoneNumber"
          ]
        },
        "Email": {
          "type": "string",
          "maxLength": 100,
          "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        "PreferredContactMethod": {
          "$ref": "#/definitions/PreferredContactMethodType"
        },
        "PreferredContactTime": {
          "$ref": "#/definitions/PreferredContactTimeType"
        },
        "Validation": {
          "$ref": "#/definitions/AddressValidationType"
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
    "SimpleAddressType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "AddressCode": {
          "$ref": "#/definitions/AddressCodeType"
        },
        "Addr1": {
          "$ref": "#/definitions/DetailAddrType"
        },
        "Addr2": {
          "$ref": "#/definitions/C-255"
        },
        "City": {
          "$ref": "#/definitions/C-50"
        },
        "StateCode": {
          "$ref": "#/definitions/StateCodeType"
        },
        "County": {
          "$ref": "#/definitions/C-50"
        },
        "Zip5": {
          "$ref": "#/definitions/Zip5Type"
        },
        "Zip4": {
          "$ref": "#/definitions/Zip4Type"
        },
        "Validation": {
          "$ref": "#/definitions/AddressValidationType"
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
    "ApplicantType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "ApplicantType": {
          "$ref": "#/definitions/ApplicantTypeType"
        },
        "PersonalInfo": {
          "$ref": "#/definitions/PersonalInfoType"
        },
        "Address": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/AddressType"
          }
        }
      },
      "required": [
        "ApplicantType",
        "PersonalInfo"
      ]
    },
    "PriorPolicyInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "PriorCarrier": {
          "$ref": "#/definitions/PriorCarrierType"
        },
        "Expiration": {
          "$ref": "#/definitions/DateType"
        },
        "YearsWithPriorCarrier": {
          "$ref": "#/definitions/DurationType"
        },
        "YearsWithContinuousCoverage": {
          "$ref": "#/definitions/DurationType"
        },
        "PriorLiabilityLimit": {
          "$ref": "#/definitions/PriorLiabilityLimitType"
        },
        "ReasonForLapse": {
          "$ref": "#/definitions/ReasonForLapseType"
        },
        "ReasonNoPrior": {
          "$ref": "#/definitions/ReasonNoPriorType"
        },
        "PriorPolicyPremium": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": false
        },
        "PriorPolicyTerm": {
          "$ref": "#/definitions/PolicyTermType"
        }
      }
    },
    "PolicyInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "PolicyTerm": {
          "$ref": "#/definitions/PolicyTermType"
        },
        "Package": {
          "$ref": "#/definitions/BooleanType"
        },
        "Effective": {
          "$ref": "#/definitions/DateType"
        },
        "CreditCheckAuth": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "DurationType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Years": {
          "$ref": "#/definitions/DurationYearsType"
        },
        "Months": {
          "$ref": "#/definitions/DurationMonthsType"
        }
      },
      "required": [
        "Years"
      ]
    },
    "CurrentAddressType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "YearsAtCurrent": {
          "$ref": "#/definitions/DurationType"
        },
        "Ownership": {
          "$ref": "#/definitions/HomeOwnershipType"
        }
      }
    },
    "PreviousAddressType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "YearsAtPrevious": {
          "$ref": "#/definitions/DurationType"
        },
        "Address": {
          "$ref": "#/definitions/SimpleAddressType"
        }
      }
    },
    "GarageAddressType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Address": {
          "$ref": "#/definitions/SimpleAddressType"
        }
      }
    },
    "ResidenceInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "CurrentAddress": {
          "$ref": "#/definitions/CurrentAddressType"
        },
        "PreviousAddress": {
          "$ref": "#/definitions/PreviousAddressType"
        },
        "GarageLocation": {
          "$ref": "#/definitions/GarageAddressType"
        }
      }
    },
    "DriverTypeType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "Name": {
          "$ref": "#/definitions/NameType"
        },
        "Gender": {
          "$ref": "#/definitions/GenderType"
        },
        "DOB": {
          "$ref": "#/definitions/DateType"
        },
        "SSN": {
          "$ref": "#/definitions/SSNType"
        },
        "DLNumber": {
          "$ref": "#/definitions/C-50"
        },
        "SDIPPoint": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": false
        },
        "DLState": {
          "$ref": "#/definitions/DLStateCodeType"
        },
        "DateLicensed": {
          "$ref": "#/definitions/DateType"
        },
        "DLStatus": {
          "$ref": "#/definitions/DLStatusType"
        },
        "AgeLicensed": {
          "$ref": "#/definitions/int100"
        },
        "AccPrev": {
          "$ref": "#/definitions/DateType"
        },
        "MaritalStatus": {
          "$ref": "#/definitions/MaritalStatusType"
        },
        "Relation": {
          "$ref": "#/definitions/RelationType"
        },
        "Industry": {
          "type": "string"
        },
        "Occupation": {
          "type": "string"
        },
        "GoodStudent": {
          "$ref": "#/definitions/BooleanType"
        },
        "Student100": {
          "$ref": "#/definitions/BooleanType"
        },
        "DriverTraining": {
          "$ref": "#/definitions/BooleanType"
        },
        "GoodDriver": {
          "$ref": "#/definitions/BooleanType"
        },
        "MATDriver": {
          "$ref": "#/definitions/BooleanType"
        },
        "PrincipalVehicle": {
          "$ref": "#/definitions/int10"
        },
        "Accident": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/AccidentType"
          }
        },
        "Violation": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ViolationType"
          }
        },
        "CompLoss": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CompLossType"
          }
        },
        "Rated": {
          "$ref": "#/definitions/RatedDriverType"
        },
        "SR22": {
          "$ref": "#/definitions/BooleanType"
        },
        "FR44": {
          "$ref": "#/definitions/BooleanType"
        },
        "LicenseRevokedSuspended": {
          "$ref": "#/definitions/BooleanType"
        }
      },
      "required": [
        "Name"
      ]
    },
    "DriversType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Driver": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/DriverTypeType"
          }
        }
      }
    },
    "VehicleTypeType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "UseVinLookup": {
          "$ref": "#/definitions/BooleanType"
        },
        "UseVehicleLookupService": {
          "$ref": "#/definitions/BooleanType"
        },
        "Year": {
          "$ref": "#/definitions/YearType"
        },
        "Vin": {
          "$ref": "#/definitions/VINType"
        },
        "Make": {
          "$ref": "#/definitions/C-50_NoBlank"
        },
        "Model": {
          "$ref": "#/definitions/C-50"
        },
        "Sub-Model": {
          "$ref": "#/definitions/C-255"
        },
        "Anti-Theft": {
          "$ref": "#/definitions/AntiTheftType"
        },
        "PassiveRestraints": {
          "$ref": "#/definitions/PassiveRestraintsType"
        },
        "AntiLockBrake": {
          "$ref": "#/definitions/BooleanType"
        },
        "DaytimeRunningLights": {
          "$ref": "#/definitions/BooleanType"
        },
        "VehicleInspection": {
          "$ref": "#/definitions/VehicleInspectionType"
        }
      },
      "required": [
        "Year",
        "Make",
        "Model",
        "Sub-Model"
      ]
    },
    "VehiclesType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Vehicle": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleTypeType"
          }
        }
      }
    },
    "VehicleUseType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "Useage": {
          "$ref": "#/definitions/UseageType"
        },
        "OneWayMiles": {
          "$ref": "#/definitions/int999"
        },
        "DaysPerWeek": {
          "$ref": "#/definitions/DaysPerWeekType"
        },
        "WeeksPerMonth": {
          "$ref": "#/definitions/WeeksPerMonthType"
        },
        "AnnualMiles": {
          "$ref": "#/definitions/int100000"
        },
        "Ownership": {
          "$ref": "#/definitions/AutoOwnershipType"
        },
        "Carpool": {
          "$ref": "#/definitions/BooleanType"
        },
        "Odometer": {
          "$ref": "#/definitions/int999999"
        },
        "Performance": {
          "$ref": "#/definitions/PerformanceType"
        },
        "NewVehicle": {
          "$ref": "#/definitions/BooleanType"
        },
        "AdditionalModificationValue": {
          "$ref": "#/definitions/int100000"
        },
        "AlternateGarage": {
          "$ref": "#/definitions/BooleanType"
        },
        "PrincipalOperator": {
          "$ref": "#/definitions/int10"
        },
        "CostNew": {
          "$ref": "#/definitions/int999999"
        },
        "UsedForDelivery": {
          "$ref": "#/definitions/BooleanType"
        },
        "PriorDamagePresent": {
          "$ref": "#/definitions/BooleanType"
        },
        "SnowPlow": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "VehiclesUseType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VehicleUse": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleUseType"
          }
        }
      }
    },
    "AccidentType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "Date": {
          "$ref": "#/definitions/DateType"
        },
        "Description": {
          "$ref": "#/definitions/AccidentDescType"
        },
        "PD": {
          "$ref": "#/definitions/int999999"
        },
        "BI": {
          "$ref": "#/definitions/int999999"
        },
        "Collision": {
          "$ref": "#/definitions/int999999"
        },
        "MP": {
          "$ref": "#/definitions/int999999"
        },
        "VehicleInvolved": {
          "type": "string"
        }
      }
    },
    "ViolationType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "Date": {
          "$ref": "#/definitions/DateType"
        },
        "Description": {
          "$ref": "#/definitions/ViolationDescType"
        }
      }
    },
    "CompLossType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "Date": {
          "$ref": "#/definitions/DateType"
        },
        "Description": {
          "$ref": "#/definitions/CompLossDescType"
        },
        "Value": {
          "$ref": "#/definitions/int999999"
        },
        "VehicleInvolved": {
          "type": "string"
        }
      }
    },
    "GeneralCoverageType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "BI": {
          "$ref": "#/definitions/BIType"
        },
        "PD": {
          "$ref": "#/definitions/PDType"
        },
        "MP": {
          "$ref": "#/definitions/MPType"
        },
        "UM": {
          "$ref": "#/definitions/UMType"
        },
        "UIM": {
          "$ref": "#/definitions/UIMType"
        },
        "Multipolicy": {
          "$ref": "#/definitions/BooleanType"
        },
        "RetirementCommunity": {
          "$ref": "#/definitions/BooleanType"
        },
        "AAADiscount": {
          "$ref": "#/definitions/BooleanType"
        },
        "Multicar": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "FL-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "FL-PIPDeductible": {
          "$ref": "#/definitions/FL-PIPDeductibleType"
        },
        "FL-PIPApplies": {
          "$ref": "#/definitions/PIPAppliesType"
        },
        "FL-WageLoss": {
          "$ref": "#/definitions/FL-WageLossType"
        },
        "FL-PIPOptions": {
          "$ref": "#/definitions/FL-PIPOptionsType"
        },
        "FL-StackedUM": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "CT-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "CT-BRB": {
          "$ref": "#/definitions/CT-BRBType"
        },
        "CT-WageLoss": {
          "$ref": "#/definitions/CT-WageLossType"
        },
        "CT-UMUIMConversion": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "KY-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "KY-PIP": {
          "$ref": "#/definitions/KY-PIPType"
        },
        "KY-APIP": {
          "$ref": "#/definitions/KY-APIPType"
        },
        "KY-PIPDeductible": {
          "$ref": "#/definitions/KY-PIPDeductibleType"
        },
        "KY-TortLimitation": {
          "$ref": "#/definitions/KY-TortLimitationType"
        }
      }
    },
    "TX-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "TX-PIP": {
          "$ref": "#/definitions/TX-PIPType"
        },
        "TX-AutoDeathIndemnity": {
          "$ref": "#/definitions/TX-AutoDeathIndemnityType"
        },
        "TX-UMPD": {
          "$ref": "#/definitions/UMPDType"
        }
      }
    },
    "WA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "WA-PIP": {
          "$ref": "#/definitions/WA-PIPType"
        },
        "WA-UMPD": {
          "$ref": "#/definitions/UMPDType"
        },
        "WA-APIP": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "CA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "CA-UMPD": {
          "$ref": "#/definitions/CA-UMPDType"
        }
      }
    },
    "CO-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "CO-UMPD": {
          "$ref": "#/definitions/CO-UMPDType"
        }
      }
    },
    "GA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "GA-UMPD": {
          "$ref": "#/definitions/GA-UMPDType"
        },
        "GA-UM-OPTION": {
          "$ref": "#/definitions/GA-UM-OPTIONType"
        }
      }
    },
    "IL-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "IL-UMPD": {
          "$ref": "#/definitions/IL-UMPDType"
        }
      }
    },
    "OH-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "OH-UMPD": {
          "$ref": "#/definitions/OH-UMPDType"
        }
      }
    },
    "OR-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "OR-PIP": {
          "$ref": "#/definitions/OR-PIPType"
        },
        "OR-PIPDeductible": {
          "$ref": "#/definitions/OR-PIPDeductibleType"
        },
        "OR-PIPAppliesTo": {
          "$ref": "#/definitions/PIPAppliesType"
        },
        "OR-UMPD": {
          "$ref": "#/definitions/UMPDType"
        }
      }
    },
    "UT-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "UT-PIP": {
          "$ref": "#/definitions/UT-PIPType"
        },
        "UT-WorkLoss": {
          "$ref": "#/definitions/UT-WorkLossType"
        },
        "UT-UMPD": {
          "$ref": "#/definitions/UT-UMPDType"
        },
        "UT-APIP": {
          "$ref": "#/definitions/UT-APIPType"
        }
      }
    },
    "PA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "PA-AccidentalDeath": {
          "$ref": "#/definitions/PA-ADBType"
        },
        "PA-StackedUM": {
          "$ref": "#/definitions/BooleanType"
        },
        "PA-StackedUIM": {
          "$ref": "#/definitions/BooleanType"
        },
        "PA-FuneralExpense": {
          "$ref": "#/definitions/PA-FuneralExpType"
        },
        "PA-WorkLoss": {
          "$ref": "#/definitions/PA-WorkLossType"
        },
        "PA-TortLimitation": {
          "$ref": "#/definitions/PA-TortLimitationType"
        },
        "PA-CombinationFirstParty": {
          "$ref": "#/definitions/PA-CFPType"
        },
        "PA-FirstParty": {
          "$ref": "#/definitions/PA-FirstPartyType"
        },
        "PA-ExtraMedicalExp": {
          "$ref": "#/definitions/PA-ExtraMedicalExpType"
        }
      }
    },
    "NM-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "NM-UMPD": {
          "$ref": "#/definitions/UMPDType"
        }
      }
    },
    "IN-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "IN-UMPD": {
          "$ref": "#/definitions/UMPDType"
        }
      }
    },
    "AR-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "AR-PIP": {
          "$ref": "#/definitions/AR-PIPType"
        },
        "AR-WorkLoss": {
          "$ref": "#/definitions/WorkLossType"
        },
        "AR-UMPD": {
          "$ref": "#/definitions/AR-UMPDType"
        },
        "AR-AccidentalDeath": {
          "$ref": "#/definitions/AR-AccidentalDeathType"
        }
      }
    },
    "KS-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "KS-PIP": {
          "$ref": "#/definitions/KS-PIPType"
        }
      }
    },
    "MN-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MN-PIPOptions": {
          "$ref": "#/definitions/MN-PIPOptionsType"
        },
        "MN-PIPStacking": {
          "$ref": "#/definitions/BooleanType"
        },
        "MN-WorkLoss": {
          "$ref": "#/definitions/WorkLossType"
        },
        "MN-PIPDeductible": {
          "$ref": "#/definitions/MN-PIPDeductibleType"
        }
      }
    },
    "MS-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MS-UMPD": {
          "$ref": "#/definitions/MS-UMPDType"
        }
      }
    },
    "NC-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "NC-UMPD": {
          "$ref": "#/definitions/NC-UMPDType"
        }
      }
    },
    "NY-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "NY-OBEL": {
          "$ref": "#/definitions/BooleanType"
        },
        "NY-PIPDeductible": {
          "$ref": "#/definitions/NY-PIPDeductibleType"
        },
        "NY-PIPOptions": {
          "$ref": "#/definitions/NY-PIPOptionsType"
        },
        "NY-Supplemental": {
          "$ref": "#/definitions/NY-SupplementalType"
        },
        "NY-APIP": {
          "$ref": "#/definitions/NY-APIPType"
        },
        "NY-WorkLoss": {
          "$ref": "#/definitions/WorkLossType"
        },
        "NY-AdditionalDeath": {
          "$ref": "#/definitions/BooleanType"
        },
        "NY-MedicalExpenseExclusion": {
          "$ref": "#/definitions/NY-MedicalExpenseExclusionType"
        },
        "NY-SupplementalSpousalLiability": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "MD-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MD-UMPD": {
          "$ref": "#/definitions/MD-UMPDType"
        },
        "MD-PIP": {
          "$ref": "#/definitions/MD-PIPType"
        },
        "MD-EUIM": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "TN-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "TN-UMPD": {
          "$ref": "#/definitions/TN-UMPDType"
        }
      }
    },
    "VA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VA-UMPD": {
          "$ref": "#/definitions/VA-UMPDType"
        },
        "VA-INCOMELOSS": {
          "$ref": "#/definitions/VA-INCOMELOSSType"
        }
      }
    },
    "NJ-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "NJ-HEALTHCARE": {
          "$ref": "#/definitions/NJ-HEALTHCAREType"
        },
        "NJ-PIP": {
          "$ref": "#/definitions/NJ-PIPType"
        },
        "NJ-PIPDEDUCTIBLE": {
          "$ref": "#/definitions/NJ-PIPDEDUCTIBLEType"
        },
        "NJ-APIP": {
          "$ref": "#/definitions/NJ-APIPType"
        },
        "NJ-THRESHOLD": {
          "$ref": "#/definitions/NJ-THRESHOLD"
        },
        "NJ-UMPD": {
          "$ref": "#/definitions/NJ-UMPDType"
        },
        "NJ-EXTENDEDMEDICAL": {
          "$ref": "#/definitions/NJ-EXTENDEDMEDICALType"
        }
      }
    },
    "WV-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "WV-UMPD": {
          "$ref": "#/definitions/WV-UMPDType"
        },
        "WV-UIMPD": {
          "$ref": "#/definitions/WV-UIMPDType"
        }
      }
    },
    "MI-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MI-PropertyProtectionInsurance": {
          "$ref": "#/definitions/MI-PropertyProtectionInsuranceType"
        },
        "MI-PIP": {
          "$ref": "#/definitions/MI-PIPType"
        },
        "MI-PIPDeductible": {
          "$ref": "#/definitions/MI-PIPDeductible"
        },
        "MI-PIPWorkLossWaiver": {
          "$ref": "#/definitions/BooleanType"
        },
        "MI-UMPD": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "DC-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "DC-UMPD": {
          "$ref": "#/definitions/DC-UMPDType"
        },
        "DC-MedicalExpense": {
          "$ref": "#/definitions/DC-MedicalExpenseType"
        },
        "DC-WorkLoss": {
          "$ref": "#/definitions/DC-WorkLossType"
        },
        "DC-FuneralExpense": {
          "$ref": "#/definitions/DC-FuneralExpenseType"
        }
      }
    },
    "DE-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "DE-PIP": {
          "$ref": "#/definitions/DE-PIPType"
        },
        "DE-PIPDeductible": {
          "$ref": "#/definitions/DE-PIPDeductibleType"
        },
        "DE-PIPAppliesTo": {
          "$ref": "#/definitions/DE-PIPAppliesToType"
        },
        "DE-APIP": {
          "$ref": "#/definitions/DE-APIPType"
        }
      }
    },
    "SC-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "SC-UMPD": {
          "$ref": "#/definitions/SC-UMPDType"
        }
      }
    },
    "RI-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "RI-UMPD": {
          "$ref": "#/definitions/RI-UMPDType"
        }
      }
    },
    "MA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MA-VehicleCoverages": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/MA-VehicleCoveragesType"
          }
        },
        "MA-ApplySameCoverageLimits": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "MA-VehicleCoveragesType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "MA-BI": {
          "$ref": "#/definitions/BIType"
        },
        "MA-PD": {
          "$ref": "#/definitions/PDType"
        },
        "MA-UM": {
          "$ref": "#/definitions/UMType"
        },
        "MA-UIM": {
          "$ref": "#/definitions/UIMType"
        },
        "MA-MP": {
          "$ref": "#/definitions/MPType"
        },
        "MA-OPTBI": {
          "$ref": "#/definitions/MA-OPTBIType"
        },
        "MA-PIPDED": {
          "$ref": "#/definitions/MA-PIPDEDType"
        },
        "MA-LIMCOLLDED": {
          "$ref": "#/definitions/MA-LIMCOLLDEDType"
        },
        "MA-WAIVECOLLDED": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "ND-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "ND-PIP": {
          "$ref": "#/definitions/ND-PIPType"
        }
      }
    },
    "MT-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "MT-UMPD": {
          "$ref": "#/definitions/MT-UMPDType"
        }
      }
    },
    "ID-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "ID-UMPD": {
          "$ref": "#/definitions/ID-UMPDType"
        }
      }
    },
    "LA-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "LA-UMPD": {
          "$ref": "#/definitions/LA-UMPDType"
        }
      }
    },
    "VT-StateSpecific": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VT-UMPD": {
          "$ref": "#/definitions/VT-UMPDType"
        }
      }
    },
    "StateSpecificCoverageType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "AR-Coverages": {
          "$ref": "#/definitions/AR-StateSpecific"
        },
        "CA-Coverages": {
          "$ref": "#/definitions/CA-StateSpecific"
        },
        "CO-Coverages": {
          "$ref": "#/definitions/CO-StateSpecific"
        },
        "CT-Coverages": {
          "$ref": "#/definitions/CT-StateSpecific"
        },
        "DC-Coverages": {
          "$ref": "#/definitions/DC-StateSpecific"
        },
        "DE-Coverages": {
          "$ref": "#/definitions/DE-StateSpecific"
        },
        "GA-Coverages": {
          "$ref": "#/definitions/GA-StateSpecific"
        },
        "FL-Coverages": {
          "$ref": "#/definitions/FL-StateSpecific"
        },
        "IL-Coverages": {
          "$ref": "#/definitions/IL-StateSpecific"
        },
        "IN-Coverages": {
          "$ref": "#/definitions/IN-StateSpecific"
        },
        "KY-Coverages": {
          "$ref": "#/definitions/KY-StateSpecific"
        },
        "KS-Coverages": {
          "$ref": "#/definitions/KS-StateSpecific"
        },
        "MA-Coverages": {
          "$ref": "#/definitions/MA-StateSpecific"
        },
        "MD-Coverages": {
          "$ref": "#/definitions/MD-StateSpecific"
        },
        "MI-Coverages": {
          "$ref": "#/definitions/MI-StateSpecific"
        },
        "MN-Coverages": {
          "$ref": "#/definitions/MN-StateSpecific"
        },
        "MS-Coverages": {
          "$ref": "#/definitions/MS-StateSpecific"
        },
        "MT-Coverages": {
          "$ref": "#/definitions/MT-StateSpecific"
        },
        "NC-Coverages": {
          "$ref": "#/definitions/NC-StateSpecific"
        },
        "ND-Coverages": {
          "$ref": "#/definitions/ND-StateSpecific"
        },
        "NJ-Coverages": {
          "$ref": "#/definitions/NJ-StateSpecific"
        },
        "NM-Coverages": {
          "$ref": "#/definitions/NM-StateSpecific"
        },
        "NY-Coverages": {
          "$ref": "#/definitions/NY-StateSpecific"
        },
        "OH-Coverages": {
          "$ref": "#/definitions/OH-StateSpecific"
        },
        "OR-Coverages": {
          "$ref": "#/definitions/OR-StateSpecific"
        },
        "PA-Coverages": {
          "$ref": "#/definitions/PA-StateSpecific"
        },
        "RI-Coverages": {
          "$ref": "#/definitions/RI-StateSpecific"
        },
        "SC-Coverages": {
          "$ref": "#/definitions/SC-StateSpecific"
        },
        "TN-Coverages": {
          "$ref": "#/definitions/TN-StateSpecific"
        },
        "TX-Coverages": {
          "$ref": "#/definitions/TX-StateSpecific"
        },
        "UT-Coverages": {
          "$ref": "#/definitions/UT-StateSpecific"
        },
        "VA-Coverages": {
          "$ref": "#/definitions/VA-StateSpecific"
        },
        "WA-Coverages": {
          "$ref": "#/definitions/WA-StateSpecific"
        },
        "WV-Coverages": {
          "$ref": "#/definitions/WV-StateSpecific"
        },
        "VT-Coverages": {
          "$ref": "#/definitions/VT-StateSpecific"
        },
        "ID-Coverages": {
          "$ref": "#/definitions/ID-StateSpecific"
        },
        "LA-Coverages": {
          "$ref": "#/definitions/LA-StateSpecific"
        }
      }
    },
    "VehicleCoverageType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "OtherCollisionDeductible": {
          "$ref": "#/definitions/OtherCollisionDeductibleType"
        },
        "CollisionDeductible": {
          "$ref": "#/definitions/CollisionDeductibleType"
        },
        "FullGlass": {
          "$ref": "#/definitions/BooleanType"
        },
        "TowingDeductible": {
          "$ref": "#/definitions/TowingDeductibleType"
        },
        "RentalDeductible": {
          "$ref": "#/definitions/RentalDeductibleType"
        },
        "LiabilityNotRequired": {
          "$ref": "#/definitions/BooleanType"
        },
        "LoanLeaseCoverage": {
          "$ref": "#/definitions/BooleanType"
        },
        "StatedAmount": {
          "$ref": "#/definitions/int100000"
        },
        "ReplacementCost": {
          "$ref": "#/definitions/BooleanType"
        },
        "WaiverCollisionDamage": {
          "$ref": "#/definitions/BooleanType"
        }
      }
    },
    "CoveragesType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "GeneralCoverage": {
          "$ref": "#/definitions/GeneralCoverageType"
        },
        "VehicleCoverage": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleCoverageType"
          }
        },
        "StateSpecificCoverage": {
          "$ref": "#/definitions/StateSpecificCoverageType"
        }
      },
      "required": [
        "GeneralCoverage"
      ]
    },
    "DriverAssignmentType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        }
      }
    },
    "VehicleAssignmentType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "integer",
          "minimum": 0,
          "exclusiveMinimum": true
        },
        "DriverAssignment": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/DriverAssignmentType"
          }
        }
      }
    },
    "VehicleAssignmentsType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "VehicleAssignment": {
          "type": "array",
          "maxItems": 6,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/VehicleAssignmentType"
          }
        }
      }
    },
    "GeneralInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "RatingStateCode": {
          "$ref": "#/definitions/StateCodeType"
        },
        "Comments": {
          "type": "string"
        }
      },
      "required": [
        "RatingStateCode"
      ]
    },
    "NVPair": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "name": {
          "type": "string"
        },
        "value": {
          "type": "string"
        }
      },
      "required": [
        "value"
      ]
    },
    "ExtendedInfoType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "name": {
          "type": "string"
        },
        "typename": {
          "type": "string"
        },
        "valuepair": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/NVPair"
          }
        }
      }
    },
    "EZAUTOType": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "Applicant": {
          "type": "array",
          "maxItems": 2,
          "minItems": 1,
          "items": {
            "$ref": "#/definitions/ApplicantType"
          }
        },
        "PriorPolicyInfo": {
          "$ref": "#/definitions/PriorPolicyInfoType"
        },
        "PolicyInfo": {
          "$ref": "#/definitions/PolicyInfoType"
        },
        "ResidenceInfo": {
          "$ref": "#/definitions/ResidenceInfoType"
        },
        "Drivers": {
          "$ref": "#/definitions/DriversType"
        },
        "Vehicles": {
          "$ref": "#/definitions/VehiclesType"
        },
        "VehiclesUse": {
          "$ref": "#/definitions/VehiclesUseType"
        },
        "Coverages": {
          "$ref": "#/definitions/CoveragesType"
        },
        "VehicleAssignments": {
          "$ref": "#/definitions/VehicleAssignmentsType"
        },
        "GeneralInfo": {
          "$ref": "#/definitions/GeneralInfoType"
        },
        "ExtendedInfo": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ExtendedInfoType"
          }
        }
      }
    },
    "int10": {
      "type": "integer",
      "maximum": 10,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int50": {
      "type": "integer",
      "maximum": 50,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int100": {
      "type": "integer",
      "maximum": 100,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int255": {
      "type": "integer",
      "maximum": 255,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int999": {
      "type": "integer",
      "maximum": 999,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int100000": {
      "type": "integer",
      "maximum": 100000,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "int999999": {
      "type": "integer",
      "maximum": 999999,
      "minimum": 0,
      "exclusiveMinimum": false,
      "exclusiveMaximum": false
    },
    "NamePrefixType": {
      "type": "string",
      "enum": [
        "MR",
        "MRS",
        "MS",
        "DR"
      ]
    },
    "NameSuffixType": {
      "type": "string",
      "enum": [
        "JR",
        "SR",
        "I",
        "II",
        "III"
      ]
    },
    "SSNType": {
      "type": "string",
      "pattern": "\\d{9}"
    },
    "Zip5Type": {
      "type": "string",
      "pattern": "\\d{5}"
    },
    "Zip4Type": {
      "type": "string",
      "pattern": "\\d{4}"
    },
    "DateType": {
      "type": "string"
    },
    "YearType": {
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
    "BooleanType": {
      "type": "string",
      "enum": [
        "Yes",
        "No"
      ]
    },
    "MaritalStatusType": {
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
    "OccupationType": {
      "type": "string",
      "enum": [
        "Self-Employed",
        "Employed",
        "Unemployed",
        "Homemaker",
        "Retired",
        "Student"
      ]
    },
    "EducationType": {
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
    "AddressCodeType": {
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
    "C-10": {
      "type": "string",
      "maxLength": 10
    },
    "C-10_NoBlank": {
      "type": "string",
      "maxLength": 10,
      "minLength": 1
    },
    "C-50": {
      "type": "string",
      "maxLength": 50
    },
    "C-50_NoBlank": {
      "type": "string",
      "maxLength": 50,
      "minLength": 1
    },
    "C-255": {
      "type": "string",
      "maxLength": 255
    },
    "C-255_NoBlank": {
      "type": "string",
      "maxLength": 255,
      "minLength": 1
    },
    "ProperName": {
      "type": "string",
      "maxLength": 64,
      "minLength": 1,
      "pattern": "^[A-Za-z]{1}[\\-' A-Za-z]*$"
    },
    "MiddleInitial": {
      "type": "string",
      "pattern": "^[A-Za-z]?$"
    },
    "PhoneTypeType": {
      "type": "string",
      "enum": [
        "Home",
        "Work",
        "Mobile"
      ]
    },
    "PhoneNumberTypeType": {
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
    "PhoneNumberType": {
      "type": "string",
      "maxLength": 50
    },
    "VINType": {
      "type": "string",
      "maxLength": 17,
      "minLength": 3
    },
    "PreferredContactMethodType": {
      "type": "string",
      "enum": [
        "Phone (Home)",
        "Phone (Work)",
        "Phone (Mobile)",
        "Email"
      ]
    },
    "PreferredContactTimeType": {
      "type": "string",
      "enum": [
        "Morning",
        "Afternoon",
        "Evening",
        "Anytime"
      ]
    },
    "AddressValidationType": {
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
    "ApplicantTypeType": {
      "type": "string",
      "enum": [
        "Applicant",
        "CoApplicant"
      ]
    },
    "PriorLiabilityLimitType": {
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
    "PolicyTermType": {
      "type": "string",
      "enum": [
        "6 Month",
        "12 Month"
      ]
    },
    "ReasonForLapseType": {
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
    "ReasonNoPriorType": {
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
    "PriorCarrierType": {
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
    "HomeOwnershipType": {
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
    "AutoOwnershipType": {
      "type": "string",
      "enum": [
        "Owned",
        "Leased",
        "Lien"
      ]
    },
    "DurationYearsType": {
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
    "DurationMonthsType": {
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
    "GenderType": {
      "type": "string",
      "enum": [
        "Male",
        "Female",
        "X - Not Specified"
      ]
    },
    "RelationType": {
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
    "StateCodeType": {
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
    "DLStateCodeType": {
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
    "ChildCustodyType": {
      "type": "string",
      "enum": [
        "Male",
        "Female"
      ]
    },
    "RatedDriverType": {
      "type": "string",
      "enum": [
        "Rated",
        "Excluded",
        "Non Rated",
        "Never Licensed"
      ]
    },
    "DLStatusType": {
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
    "AntiTheftType": {
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
    "PassiveRestraintsType": {
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
    "VehicleInspectionType": {
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
    "UseageType": {
      "type": "string",
      "enum": [
        "Business",
        "Farming",
        "Pleasure",
        "To/From Work",
        "To/From School"
      ]
    },
    "PerformanceType": {
      "type": "string",
      "enum": [
        "Standard",
        "Sports",
        "Intermediate",
        "High Performance"
      ]
    },
    "DaysPerWeekType": {
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
    "WeeksPerMonthType": {
      "type": "string",
      "enum": [
        "4",
        "3",
        "2",
        "1"
      ]
    },
    "AccidentDescType": {
      "type": "string",
      "enum": [
        "At Fault With Injury",
        "At Fault With No Injury",
        "Not At Fault"
      ]
    },
    "ViolationDescType": {
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
    "CompLossDescType": {
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
    "BIType": {
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
    "PDType": {
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
    "UMPDType": {
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
    "MPType": {
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
    "UMType": {
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
    "UIMType": {
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
    "PIPType": {
      "type": "string",
      "enum": [
        "Accept",
        "Reject"
      ]
    },
    "OtherCollisionDeductibleType": {
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
    "CollisionDeductibleType": {
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
    "TowingDeductibleType": {
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
    "RentalDeductibleType": {
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
    "PIPAppliesType": {
      "type": "string",
      "enum": [
        "Named Insured",
        "Named Insured + Relatives"
      ]
    },
    "WorkLossType": {
      "type": "string",
      "enum": [
        "Included",
        "Excluded"
      ]
    },
    "FL-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "0",
        "250",
        "500",
        "1000"
      ]
    },
    "FL-WageLossType": {
      "type": "string",
      "enum": [
        "Included",
        "Excluded"
      ]
    },
    "FL-PIPOptionsType": {
      "type": "string",
      "enum": [
        "Basic",
        "Extended"
      ]
    },
    "CT-BRBType": {
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
    "CT-WageLossType": {
      "type": "string",
      "enum": [
        "200",
        "300",
        "400",
        "500"
      ]
    },
    "KY-PIPType": {
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
    "KY-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "None",
        "250",
        "500",
        "1000"
      ]
    },
    "KY-APIPType": {
      "type": "string",
      "enum": [
        "1000",
        "2000",
        "3000",
        "4000"
      ]
    },
    "KY-TortLimitationType": {
      "type": "string",
      "enum": [
        "Tort Limitation Not Rejected",
        "Rejected By All Family Members",
        "Rejected By Some Family Members"
      ]
    },
    "TX-PIPType": {
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
    "TX-AutoDeathIndemnityType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "5000",
        "10000"
      ]
    },
    "WA-PIPType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "10000",
        "35000"
      ]
    },
    "CA-UMPDType": {
      "type": "string",
      "enum": [
        "Reject",
        "3500"
      ]
    },
    "CO-UMPDType": {
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
    "GA-UMPDType": {
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
    "GA-UM-OPTIONType": {
      "type": "string",
      "enum": [
        "Add-On",
        "Reduced"
      ]
    },
    "IL-UMPDType": {
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
    "OH-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "7500",
        "10000",
        "25000"
      ]
    },
    "OR-PIPType": {
      "type": "string",
      "enum": [
        "15000 BASIC",
        "25000",
        "50000",
        "100000"
      ]
    },
    "OR-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "0",
        "100",
        "250"
      ]
    },
    "UT-PIPType": {
      "type": "string",
      "enum": [
        "3000",
        "5000",
        "10000",
        "25000"
      ]
    },
    "UT-WorkLossType": {
      "type": "string",
      "enum": [
        "Accept",
        "Reject"
      ]
    },
    "UT-UMPDType": {
      "type": "string",
      "enum": [
        "None",
        "3500"
      ]
    },
    "UT-APIPType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "5000",
        "10000"
      ]
    },
    "PA-ADBType": {
      "type": "string",
      "enum": [
        "None",
        "5000",
        "10000",
        "15000",
        "25000"
      ]
    },
    "PA-FuneralExpType": {
      "type": "string",
      "enum": [
        "None",
        "1500",
        "2500"
      ]
    },
    "PA-WorkLossType": {
      "type": "string",
      "enum": [
        "None",
        "1000/5000",
        "1000/15000",
        "1500/25000",
        "2500/50000"
      ]
    },
    "PA-TortLimitationType": {
      "type": "string",
      "enum": [
        "Full",
        "Limited"
      ]
    },
    "PA-CFPType": {
      "type": "string",
      "enum": [
        "None",
        "Addl First Party Benefits",
        "Combo First Party Benefits - 50000",
        "Combo First Party Benefits - 100000",
        "Combo First Party Benefits - 177500"
      ]
    },
    "PA-FirstPartyType": {
      "type": "string",
      "enum": [
        "5000",
        "10000",
        "25000",
        "50000",
        "100000"
      ]
    },
    "PA-ExtraMedicalExpType": {
      "type": "string",
      "enum": [
        "100000",
        "300000",
        "500000",
        "1000000"
      ]
    },
    "AR-PIPType": {
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
    "AR-UMPDType": {
      "type": "string",
      "enum": [
        "Reject",
        "25000",
        "50000",
        "100000",
        "300000"
      ]
    },
    "AR-AccidentalDeathType": {
      "type": "string",
      "enum": [
        "Reject",
        "5000",
        "10000",
        "15000",
        "20000"
      ]
    },
    "KS-PIPType": {
      "type": "string",
      "enum": [
        "Basic - 4500",
        "12500",
        "27500"
      ]
    },
    "MN-PIPOptionsType": {
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
    "MN-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "0",
        "100 MED/200WL",
        "100 MED"
      ]
    },
    "MS-UMPDType": {
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
    "NC-UMPDType": {
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
    "NY-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "0",
        "100",
        "200",
        "250"
      ]
    },
    "NY-PIPOptionsType": {
      "type": "string",
      "enum": [
        "Basic",
        "Basic+25000",
        "Basic+50000",
        "Basic+100000"
      ]
    },
    "NY-SupplementalType": {
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
    "NY-APIPType": {
      "type": "string",
      "enum": [
        "25000",
        "50000",
        "100000"
      ]
    },
    "NY-MedicalExpenseExclusionType": {
      "type": "string",
      "enum": [
        "None",
        "Named Insured Only",
        "Named Insured + Relatives"
      ]
    },
    "MD-UMPDType": {
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
    "MD-PIPType": {
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
    "TN-UMPDType": {
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
    "VA-UMPDType": {
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
    "VA-INCOMELOSSType": {
      "type": "string",
      "enum": [
        "ACCEPT",
        "REJECT"
      ]
    },
    "NJ-HEALTHCAREType": {
      "type": "string",
      "enum": [
        "Primary",
        "Secondary"
      ]
    },
    "NJ-PIPType": {
      "type": "string",
      "enum": [
        "15000",
        "50000",
        "75000",
        "150000",
        "250000"
      ]
    },
    "NJ-PIPDEDUCTIBLEType": {
      "type": "string",
      "enum": [
        "250",
        "500",
        "1000",
        "2000",
        "2500"
      ]
    },
    "NJ-APIPType": {
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
    "NJ-THRESHOLD": {
      "type": "string",
      "enum": [
        "Verbal Threshold",
        "Zero Threshold"
      ]
    },
    "NJ-UMPDType": {
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
    "NJ-EXTENDEDMEDICALType": {
      "type": "string",
      "enum": [
        "1000",
        "10000"
      ]
    },
    "WV-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "10000",
        "25000",
        "50000",
        "100000"
      ]
    },
    "WV-UIMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "10000",
        "25000",
        "50000",
        "100000"
      ]
    },
    "MI-PropertyProtectionInsuranceType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "1000000"
      ]
    },
    "MI-PIPType": {
      "type": "string",
      "enum": [
        "Full Medical/Full Wage",
        "Medical Excess",
        "Wage Excess",
        "Excess Medical/Excess Wage"
      ]
    },
    "MI-PIPDeductible": {
      "type": "string",
      "enum": [
        "No Ded",
        "100",
        "200",
        "300",
        "500"
      ]
    },
    "DC-UMPDType": {
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
    "DC-MedicalExpenseType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "50000",
        "100000"
      ]
    },
    "DC-WorkLossType": {
      "type": "string",
      "enum": [
        "None",
        "12000",
        "24000"
      ]
    },
    "DC-FuneralExpenseType": {
      "type": "string",
      "enum": [
        "None",
        "4000"
      ]
    },
    "DE-PIPType": {
      "type": "string",
      "enum": [
        "15/30"
      ]
    },
    "DE-PIPDeductibleType": {
      "type": "string",
      "enum": [
        "0",
        "250",
        "500",
        "1000",
        "10000"
      ]
    },
    "DE-PIPAppliesToType": {
      "type": "string",
      "enum": [
        "Named Insured",
        "Named Insured and Relative(S)"
      ]
    },
    "DE-APIPType": {
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
    "SC-UMPDType": {
      "type": "string",
      "enum": [
        "Reject",
        "25000",
        "50000",
        "100000",
        "200000"
      ]
    },
    "RI-UMPDType": {
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
    "MA-OPTBIType": {
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
    "MA-PIPDEDType": {
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
    "MA-LIMCOLLDEDType": {
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
    "ND-PIPType": {
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
    "MT-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "25000",
        "50000"
      ]
    },
    "ID-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "25000",
        "50000"
      ]
    },
    "LA-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "25000"
      ]
    },
    "VT-UMPDType": {
      "type": "string",
      "enum": [
        "No Coverage",
        "10000"
      ]
    }
  }
}
