import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Client } from '../models/client.model';
import { ClientService } from './client.service';
import { Driver } from '../models/driver.model';
import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';
import { LogService } from './log.service';
import { environment } from '../../environments/environment';
import { Answer } from '../models/answer.model';
import * as FileSaver from 'file-saver';
import * as dateFunction from '../utils/utils';
import { map } from 'rxjs/internal/operators/map';


@Injectable()
export class FileService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'file';
    client: Client;
    answers: Answer[];

    constructor(
        private clientService: ClientService,
        private http: HttpClient,
        private logService: LogService
        ) {}

   createFile(clientIds: Number[]) {
      const body = { clientIds: clientIds };
      return this.http.post(`${this.apiUrl}/csv`, body)
      .pipe(map(result =>
            result['obj']
      )).toPromise();
   }

   downloadFile(fileName: string, file: string, fileType: string) {
      const blob = new Blob([file], {type: fileType});
      FileSaver.saveAs(blob, fileName);
   }

   //  saveFile(client: Client, type: string, user?: User, company?: Company, formType?: string) {
   //      if (type === 'applied rater') {
   //          this.clientService.getClient(client)
   //          .subscribe(rClient => {
   //             this.client = rClient['obj'];
   //             const blob = new Blob([this.returnClientXml(this.client, type, company)],
   //                {type: 'application/xml'});
   //          saveAs(blob, ((this.client.drivers && this.client.drivers[0]) ?
   //             (this.client.drivers[0].applicantSurname + '.' + this.client.drivers[0].applicantGivenName + '.xml') : ''));
   //          }, error => {
   //             this.logService.console(error, true);
   //          });
   //      }
   //  }




    /* Service File Methods */

  // returns literal string of all drivers in xml format
  returnDriverObject(client: Client) {
    const theseDrivers: Driver[] = client.drivers;
    let driverString = '';
    theseDrivers.forEach((driver, i) => {
        driverString += `
        <PersDriver id="DRIVER` + (i + 1).toString() + `">
            <GeneralPartyInfo>
                <NameInfo>
                    <PersonName>
                        <Surname>` + driver.applicantSurname + `</Surname>
                        <GivenName>` + driver.applicantGivenName + `</GivenName>
                        <OtherGivenName>` + driver.applicantMiddleInitial + `</OtherGivenName>
                        <NameSuffix>` + driver.applicantNameSuffix + `</NameSuffix>
                    </PersonName>
                </NameInfo>
                <Addr>
                    <AddrTypeCd>` + 'StreetAddress' + `</AddrTypeCd>
                    <DetailAddr>
                        <StreetName>` + client.streetName + `</StreetName>
                        <StreetNumber>` + client.streetNumber + `</StreetNumber>
                    </DetailAddr>
                    <City>` + client.city + `</City>
                    <StateProvCd>` + client.stateCd + `</StateProvCd>
                    <PostalCode>` + client.postalCd + `</PostalCode>
                </Addr>
                <Addr>
                    <AddrTypeCd>` + 'MailingAddress' + `</AddrTypeCd>
                    <DetailAddr>
                        <StreetName>` + client.streetName + `</StreetName>
                        <StreetNumber>` + client.streetNumber + `</StreetNumber>
                    </DetailAddr>
                    <City>` + client.city + `</City>
                    <StateProvCd>` + client.stateCd + `</StateProvCd>
                    <PostalCode>` + client.postalCd + `</PostalCode>
                </Addr>
                <Communications>
                    <PhoneInfo>
                    <CommunicationUseCd>` + 'Home' + `</CommunicationUseCd>
                    <PhoneNumber>+1-${client.phone}</PhoneNumber>
                    </PhoneInfo>
                    <EmailInfo>
                    <EmailAddr>${client.email}</EmailAddr>
                    </EmailInfo>
                </Communications>
            </GeneralPartyInfo>
            <DriverInfo>
                <PersonInfo>
                    <GenderCd>${driver.applicantGenderCd ? driver.applicantGenderCd.charAt(0) : ''}</GenderCd>
                    <BirthDt>` + dateFunction.formatDate(driver.applicantBirthDt) + `</BirthDt>
                    <MaritalStatusCd>${driver.applicantMaritalStatusCd ? driver.applicantMaritalStatusCd.charAt(0) : ''}</MaritalStatusCd>
                </PersonInfo>
                <DriversLicense>
                    <LicensedDt>` + dateFunction.formatDate(driver.driverLicensedDt) + `</LicensedDt>
                    <DriversLicenseNumber>` + driver.driverLicenseNumber + `</DriversLicenseNumber>
                    <StateProvCd>` + driver.driverLicenseStateCd + `</StateProvCd>
                </DriversLicense>
            </DriverInfo>
            <PersDriverInfo VehPrincipallyDrivenRef="` + this.returnAllVehiclesString(client) + `">
                ` + ((driver.hasDefensiveDriverDiscount) ? '<DefensiveDriverCd>Y<DefensiveDriverCd>' : '') + `
            </PersDriverInfo>
        </PersDriver>`;
    });
      return driverString;
}

// returns literal string of accord xml file
returnClientXml(client: Client, type: string, company: Company) {
  const theseDrivers: Driver[] = client.drivers;
  const agentFirstName = company.agents[0].firstName;
  const agentLastName = company.agents[0].lastName;

  function returnField(clientField, driversField) {
     let field = '';
     if (client[clientField]) {
        field = client[clientField];
     } else if (client.drivers && client.drivers[0] && client.drivers[0][driversField]) {
        field = client.drivers[0][driversField];
     }
     return field;
  }
  const clientXml = `
  <ACORD>
    <SignonRq>
      <SignonPswd>
          <SignonRoleCd>Agent</SignonRoleCd>
          <CustId>
              <SPName>com.appliedsystems</SPName>
          </CustId>
          <CustPswd>
              <EncryptionTypeCd>NONE</EncryptionTypeCd>
          </CustPswd>
      </SignonPswd>
      <ClientDt>${dateFunction.getNextXDays(0)}</ClientDt>
      <CustLangPref>en-US</CustLangPref>
      <ClientApp>
          <Org>SEMCAT Corporation</Org>
          <Name>SEMCAT</Name>
          <Version>5.1.86</Version>
      </ClientApp>
  </SignonRq>
  <InsuranceSvcRq>
      <RqUID></RqUID>
      <PersPkgPolicyQuoteInqRq>
          <RqUID></RqUID>
          <TransactionRequestDt>${dateFunction.getNextXDays(0)}</TransactionRequestDt>
          <CurCd>USD</CurCd>
          <Producer>
              <GeneralPartyInfo>
                <NameInfo>
                    <PersonName>
                        <Surname>${agentFirstName}</Surname>
                        <GivenName>${agentLastName}</GivenName>
                    </PersonName>
                </NameInfo>
              </GeneralPartyInfo>
          </Producer>
          <PersPolicy>
              <LOBCd>AUTOP</LOBCd>
              <ContractTerm>
              <EffectiveDt>${dateFunction.getNextXDays(7)}</EffectiveDt>
              </ContractTerm>
              <OtherOrPriorPolicy>
              </OtherOrPriorPolicy>
              <PersApplicationInfo>
              <InsuredOrPrincipal>
                  <GeneralPartyInfo>
                      <NameInfo>
                          <PersonName>
                          <Surname>${returnField('lastName', 'applicantSurname')}</Surname>
                          <GivenName>${returnField('firstName', 'applicantGivenName')}</GivenName>
                          <OtherGivenName></OtherGivenName>
                          <NameSuffix></NameSuffix>
                          </PersonName>
                      </NameInfo>
                      <Addr>
                          <AddrTypeCd>MailingAddress</AddrTypeCd>
                          <DetailAddr>
                          <StreetNumber>` + client.streetNumber + `</StreetNumber>
                              <StreetName>` + client.streetName + `</StreetName>
                          </DetailAddr>
                          <City>` + client.city + `</City>
                          <StateProvCd>` + client.stateCd + `</StateProvCd>
                          <PostalCode>` + client.postalCd + `</PostalCode>
                      </Addr>
                      <Addr>
                          <AddrTypeCd>` + 'StreetAddress' + `</AddrTypeCd>
                          <DetailAddr>
                           <StreetNumber>` + client.streetNumber + `</StreetNumber>
                           <StreetName>` + client.streetName + `</StreetName>
                          </DetailAddr>
                          <City>` + client.city + `</City>
                          <StateProvCd>` + client.stateCd + `</StateProvCd>
                          <PostalCode>` + client.postalCd + `</PostalCode>
                      </Addr>
                      <Communications>
                          <PhoneInfo>
                          <CommunicationUseCd>` + 'Home' + `</CommunicationUseCd>
                          <PhoneNumber>+1-` + client.phone + `</PhoneNumber>
                          </PhoneInfo>
                          <EmailInfo>
                          <EmailAddr>` + client.email + `</EmailAddr>
                          </EmailInfo>
                      </Communications>
                  </GeneralPartyInfo>
                  <InsuredOrPrincipalInfo>
                      <PersonInfo>
                          <GenderCd>${returnField('gender', 'applicantGenderCd').charAt(0)}</GenderCd>
                          <BirthDt>` + dateFunction.formatDate(client.birthDate) + `</BirthDt>
                          <MaritalStatusCd>${returnField('maritalStatus', 'applicantMaritalStatus').charAt(0)}</MaritalStatusCd>
                          <OccupationClassCd>${returnField('occupation', 'applicantOccupationClassCd')}</OccupationClassCd>
                      </PersonInfo>
                  </InsuredOrPrincipalInfo>
              </InsuredOrPrincipal>
              </PersApplicationInfo>
          </PersPolicy>
          <Location id="LOCATION1">
              <ItemIdInfo>
              <AgencyId>1</AgencyId>
              </ItemIdInfo>
              <Addr>
              <AddrTypeCd>` + 'StreetAddress' + `</AddrTypeCd>
              <DetailAddr>
              <StreetNumber>` + client.streetNumber + `</StreetNumber>
                  <StreetName>` + client.streetName + `</StreetName>
              </DetailAddr>
              <City>` + client.city + `</City>
              <StateProvCd>` + client.stateCd + `</StateProvCd>
              <PostalCode>` + client.postalCd + `</PostalCode>
              </Addr>
          </Location>` + this.returnDriverObject(client) + this.returnVehicleObject(client)  + `
          <PersPkgHomeLineBusiness DwellRefs="DWELL1">
              <LOBCd>HOME</LOBCd>
              <QuestionAnswer>
              <QuestionCd>HOME01</QuestionCd>
              <YesNoCd>NO</YesNoCd>
              </QuestionAnswer>
          </PersPkgHomeLineBusiness>
          <PersPkgAutoLineBusiness VehRefs="` + this.returnAllVehiclesIndexesString(client)  + `">
              <LOBCd>AUTOP</LOBCd>
              <QuestionAnswer>
              <QuestionCd>AUTOP01</QuestionCd>
              <YesNoCd>NO</YesNoCd>
              </QuestionAnswer>
              <QuestionAnswer>
              <QuestionCd>AUTOP02</QuestionCd>
              <YesNoCd>YES</YesNoCd>
              </QuestionAnswer>
          </PersPkgAutoLineBusiness>
      </PersPkgPolicyQuoteInqRq>
  </InsuranceSvcRq>
  </ACORD>`;
  return clientXml;
}

// returns array of all vehicles for all drivers
returnAllVehicles(client: Client) {
    const allVehicles = [];
    client.vehicles.forEach((vehicle) => {
        allVehicles.push(vehicle);
        });
    return allVehicles;
}

// returns literal string of all vehicles title in xml format
returnAllVehiclesString(client: Client) {
    let allVehiclesString = '';
    this.returnAllVehicles(client).forEach((allVehiclesVehicle, i) => {
        client.vehicles.forEach((driverVehicle, j) => {
        if (allVehiclesVehicle.id === driverVehicle.id) {
            allVehiclesString += 'VEHICLE' + (i + 1).toString() + ((client.vehicles[j + 1]) ? ' ' : '');
        }
        });
    });
    return allVehiclesString;
}

// returns index of the driver
returnIndexOfDriver(driver: Driver, client: Client) {
    const theseDrivers: Driver[] = client.drivers;
    return (theseDrivers.indexOf(driver) + 1).toString();
}

// returns index of the vehicle
returnIndexOfVehicles(allVehicles: Vehicle[], vehicle: Vehicle) {
    return (allVehicles.indexOf(vehicle) + 1).toString();
}

// returns literal string of vehicles title in xml format
returnAllVehiclesIndexesString(client: Client) {
    const allVehicles = this.returnAllVehicles(client);
    let allVehiclesString = '';
    allVehicles.forEach((vehicle, i) => {
        allVehiclesString += 'VEHICLE' + (i + 1).toString() + ((allVehicles[i + 1]) ? ' ' : '');
    });
    return allVehiclesString;
}

returnStringValue(value: any) {
   if (value != 'undefined' && value && value !== null) {
      return value;
   } else {
      return '';
   }
}

   // returns string of vehicle in xml format
   returnVehicleObject(client: Client) {
    let thisVehicleString = ``;
    let vehicleIndex = 0;
      client.vehicles.forEach((thisVehicle, i) => {
          vehicleIndex++;
          thisVehicleString += `
          <PersVeh id="VEHICLE` + vehicleIndex + `" RatedDriverRef="DRIVER` + ( i + 1).toString() + `">
          <Manufacturer>` + thisVehicle.vehicleManufacturer + `</Manufacturer>
          <Model>` + thisVehicle.vehicleModel + `</Model>
          <ModelYear>` + thisVehicle.vehicleModelYear + `</ModelYear>
          <VehBodyTypeCd>PP</VehBodyTypeCd>
          <NumDaysDrivenPerWeek>` + thisVehicle.vehicleDaysDrivenPerWeek + `</NumDaysDrivenPerWeek>
          <EstimatedAnnualDistance>
          <NumUnits>` + thisVehicle.vehicleAnnualDistance + `</NumUnits>
          <UnitMeasurementCd>1A</UnitMeasurementCd>
          </EstimatedAnnualDistance>
          <VehIdentificationNumber>` + ((thisVehicle.vehicleVin !== null) ? thisVehicle.vehicleVin : '' ) + `</VehIdentificationNumber>
          <PrincipalOperatorInd>` + (i + 1).toString() + `</PrincipalOperatorInd>
          <VehUseCd>` + thisVehicle.vehicleUseCd + `</VehUseCd>
          <Coverage>
          <CoverageCd>BI</CoverageCd>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '25000' :
                          (thisVehicle.coverageLevel === '2') ? '50000' : '100000') + `</FormatInteger>
              <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
          </Limit>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '50000' :
                          (thisVehicle.coverageLevel === '2') ? '100000' :
                              (thisVehicle.coverageLevel === '3') ? '100000' :
                              (thisVehicle.coverageLevel === '4') ? '300000' : '300000') + `</FormatInteger>
              <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
          </Limit>
          </Coverage>
          <Coverage>
          <CoverageCd>PD</CoverageCd>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '10000' :
                          (thisVehicle.coverageLevel === '2') ? '20000' :
                          (thisVehicle.coverageLevel === '3') ? '30000' :
                              (thisVehicle.coverageLevel === '4') ? '50000' : '50000') + `</FormatInteger>
              <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
          </Limit>
          </Coverage>
          <Coverage>
          <CoverageCd>UM</CoverageCd>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '25000' :
                              (thisVehicle.coverageLevel === '3') ? '50000' :
                              (thisVehicle.coverageLevel === '4') ? '100000' : '100000') + `</FormatInteger>
              <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
          </Limit>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '50000' :
                              (thisVehicle.coverageLevel === '3') ? '100000' :
                              (thisVehicle.coverageLevel === '4') ? '100000' : '100000') + `</FormatInteger>
              <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
          </Limit>
          </Coverage>
          <Coverage>
          <CoverageCd>UNDUM</CoverageCd>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '25000' :
                              (thisVehicle.coverageLevel === '3') ? '50000' :
                              (thisVehicle.coverageLevel === '4') ? '100000' : '100000') + `</FormatInteger>
              <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
          </Limit>
          <Limit>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '50000' :
                              (thisVehicle.coverageLevel === '3') ? '100000' :
                              (thisVehicle.coverageLevel === '4') ? '100000' : '100000') + `</FormatInteger>
              <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
          </Limit>
          </Coverage>
          <Coverage>
          <CoverageCd>COMP</CoverageCd>
          <Deductible>
              <FormatInteger>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '250' :
                          (thisVehicle.coverageLevel === '3') ? '500' :
                              (thisVehicle.coverageLevel === '4') ? '1000' : '1000') + `</FormatInteger>
          </Deductible>
          </Coverage>
          <Coverage>
          <CoverageCd>COLL</CoverageCd>
          <Deductible>
              <FormatCurrencyAmt>
                  <Amt>` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '250' :
                              (thisVehicle.coverageLevel === '3') ? '500' :
                              (thisVehicle.coverageLevel === '4') ? '1000' : '1000') + `</Amt>
              </FormatCurrencyAmt>
          </Deductible>
          </Coverage>
          <Coverage>
          <CoverageCd>TL</CoverageCd>
          <Limit>
              <FormatInteger>
              ` + ((thisVehicle.coverageLevel === '1') ? '0' :
                          (thisVehicle.coverageLevel === '2') ? '0' :
                          (thisVehicle.coverageLevel === '3') ? '50' :
                              (thisVehicle.coverageLevel === '4') ? '100' : '100') + `
              </FormatInteger>
              <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
          </Limit>
          </Coverage>
        </PersVeh>`;
        });
        return thisVehicleString;
   }

   returnEZLynxXML(client: Client, user: User) {
      return `<?xml version="1.0" encoding="UTF-8"?>
      <ACORD>
         <SignonRq>
            <SignonPswd>
               <CustId>
                  <CustLoginId></CustLoginId>
                  <SPName></SPName>
               </CustId>
               <CustPswd>
                  <Pswd></Pswd>
                  <EncryptionTypeCd></EncryptionTypeCd>
               </CustPswd>
            </SignonPswd>
            <ClientDt></ClientDt>
            <CustLangPref>English</CustLangPref>
            <ClientApp>
               <Org>Webcetera</Org>
               <Name>EZLynx</Name>
               <Version>1.1</Version>
            </ClientApp>
         </SignonRq>
         <InsuranceSvcRq>
            <RqUID></RqUID>
            <PersAutoPolicyQuoteInqRq>
               <RqUID></RqUID>
               <TransactionRequestDt>${new Date()}</TransactionRequestDt>
               <CurCd>USAD</CurCd>
               <Producer>
                  <ItemIdInfo>
                     <AgencyId></AgencyId>
                  </ItemIdInfo>
                  <GeneralPartyInfo>
                     <NameInfo>
                        <PersonName>
                           <Surname>${user.lastName}</Surname>
                           <GivenName>${user.firstName}</GivenName>
                        </PersonName>
                     </NameInfo>
                     <Communications>
                        <EmailInfo>
                           <EmailAddr>${user.username}</EmailAddr>
                        </EmailInfo>
                     </Communications>
                  </GeneralPartyInfo>
               </Producer>
               <InsuredOrPrincipal>
                  <GeneralPartyInfo>
                     <NameInfo>
                        <PersonName>
                           <Surname>${client.lastName}</Surname>
                           <GivenName>${client.firstName}</GivenName>
                        </PersonName>
                     </NameInfo>
                     <Addr>
                        <AddrTypeCd>MailingAddress</AddrTypeCd>
                        <Addr1>${client.streetNumber + ' ' + client.streetName}</Addr1>
                        <Addr2 />
                        <City>${client.city}</City>
                        <County></County>
                        <StateProvCd>${client.stateCd}</StateProvCd>
                        <PostalCode>${client.postalCd}</PostalCode>
                     </Addr>
                     <Communications>
                     <PhoneInfo>
                        <PhoneTypeCd>Phone</PhoneTypeCd>
                        <CommunicationUseCd>Mobile</CommunicationUseCd>
                        <PhoneNumber>${client.phone}</PhoneNumber>
                        <Extension />
                     </PhoneInfo>
                        <EmailInfo>
                           <EmailAddr>${client.email}</EmailAddr>
                        </EmailInfo>
                     </Communications>
                  </GeneralPartyInfo>
               <InsuredOrPrincipalInfo>
                  <InsuredOrPrincipalRoleCd>Insured</InsuredOrPrincipalRoleCd>
                  <PersonInfo>
                     <GenderCd>${client.gender === 'Male' ? 'M' : client.gender === 'Female' ? 'F' : '' }</GenderCd>
                     <BirthDt>${client.birthDate}</BirthDt>
                     <MaritalStatusCd>S</MaritalStatusCd>
                           <com.webcetera__Industry_Type>${client.occupation}</com.webcetera__Industry_Type>
                           <OccupationClassCd>${client.occupation}</OccupationClassCd>
                  </PersonInfo>
               </InsuredOrPrincipalInfo>
               </InsuredOrPrincipal>
               <PersPolicy>
                  <LOBCd>AUTOP</LOBCd>
                  <BillingMethodCd>AB</BillingMethodCd>
                  <OtherOrPriorPolicy>
                     <PolicyCd>${client.drivers[0].applicantPreviousInsurance !== null ? 'PRIOR' : ''}</PolicyCd>
                     <InsurerName>${client.drivers[0].applicantPreviousInsurance !== null ? client.drivers[0].applicantPreviousInsurance : ''}</InsurerName>
                     <ExpirationDt></ExpirationDt>
                  <LengthTimeWithPreviousInsurer>
                     <DurationPeriod>
                        <NumUnits>${client.drivers[0].applicantPreviousInsuranceYears !== null ? client.drivers[0].applicantPreviousInsuranceYears : ''}</NumUnits>
                        <UnitMeasurementCd>Years</UnitMeasurementCd>
                     </DurationPeriod>
                     <DurationPeriod>
                        <NumUnits>0</NumUnits>
                        <UnitMeasurementCd>Months</UnitMeasurementCd>
                     </DurationPeriod>
                  </LengthTimeWithPreviousInsurer>
                  <com.webcetera__Length_ContinuousCov_Prev_Insurer>
                     <DurationPeriod>
                        <NumUnits>${client.drivers[0].applicantPreviousInsuranceYears !== null ? client.drivers[0].applicantPreviousInsuranceYears : ''}</NumUnits>
                        <UnitMeasurementCd>Years</UnitMeasurementCd>
                     </DurationPeriod>
                     <DurationPeriod>
                        <NumUnits>0</NumUnits>
                        <UnitMeasurementCd>Months</UnitMeasurementCd>
                     </DurationPeriod>
                  </com.webcetera__Length_ContinuousCov_Prev_Insurer>
                  </OtherOrPriorPolicy>
               <EffectiveDt></EffectiveDt>
                  <com.webcetera_Package_Ind>1</com.webcetera_Package_Ind>
                  <com.webcetera_CreditCheckPermission_Ind>1</com.webcetera_CreditCheckPermission_Ind>
               <PersApplicationInfo>
                  <ResidenceTypeCd></ResidenceTypeCd>
                     <LengthTimeCurrentAddr>
                        <DurationPeriod>
                           <NumUnits>1</NumUnits>
                           <UnitMeasurementCd>Years</UnitMeasurementCd>
                        </DurationPeriod>
                        <DurationPeriod>
                           <NumUnits>0</NumUnits>
                           <UnitMeasurementCd>Months</UnitMeasurementCd>
                        </DurationPeriod>
                     </LengthTimeCurrentAddr>
               </PersApplicationInfo>
                  <DriverVeh DriverRef="Drv1" VehRef="Veh1">
                     <UsePct>100</UsePct>
                  </DriverVeh>
               </PersPolicy>
               <PersAutoLineBusiness>
                  <PersDriver id="Drv1">
                     <GeneralPartyInfo>
                        <NameInfo>
                           <PersonName>
                              <Surname>${client.drivers[0].applicantSurname}</Surname>
                              <GivenName>${client.drivers[0].applicantGivenName}</GivenName>
                           </PersonName>
                        </NameInfo>
                     </GeneralPartyInfo>
                     <DriverInfo>
                        <PersonInfo>
                           <GenderCd>${client.drivers[0].applicantGenderCd === 'Male' ? 'M' : client.drivers[0].applicantGenderCd === 'Female' ? 'F' : ''}</GenderCd>
                           <BirthDt>${client.drivers[0].applicantBirthDt}</BirthDt>
                           <MaritalStatusCd>${client.drivers[0].applicantMaritalStatusCd === 'Married' ? 'M' : client.drivers[0].applicantMaritalStatusCd === 'Single' ? 'S' : ''}</MaritalStatusCd>
                           <com.webcetera__Industry_Type>${client.drivers[0].applicantOccupationClassCd}</com.webcetera__Industry_Type>
                           <OccupationClassCd>${client.drivers[0].applicantOccupationClassCd}</OccupationClassCd>
                        </PersonInfo>
                     <License>
                        <LicenseStatusCd>V</LicenseStatusCd>
                        <LicenseDt></LicenseDt>
                        <DriverLicenseNumber>${client.drivers[0].driverLicenseNumber}</DriverLicenseNumber>
                        <StateProvCd>${client.drivers[0].driverLicenseStateCd}</StateProvCd>
                     </License>
                     </DriverInfo>
                  </PersDriver>
                  <PersVeh id="Veh1" LocationRef="L01">
                     <ModelYear>${client.vehicles[0].vehicleModelYear}</ModelYear>
                     <Manufacturer>${client.vehicles[0].vehicleManufacturer}</Manufacturer>
                     <Model>${client.vehicles[0].vehicleModel}</Model>
                     <com.webcetera__SubModel_Veh></com.webcetera__SubModel_Veh>
                     <VehIdentificationNumber>${client.vehicles[0].vehicleVin || ''}</VehIdentificationNumber>
                     <AntiLockBrakeCd></AntiLockBrakeCd>
                     <AntiTheftDeviceCd></AntiTheftDeviceCd>
                     <PresentValueAmt></PresentValueAmt>
                     <DistanceOneWay>
                        <NumUnits>${client.vehicles[0].vehicleCommuteMilesDrivenOneWay || '0'}</NumUnits>
                        <UnitMeasurementCd>Miles</UnitMeasurementCd>
                     </DistanceOneWay>
                     <EstimatedAnnualDistance>
                        <NumUnits>${client.vehicles[0].vehicleAnnualDistance || '0'}</NumUnits>
                        <UnitMeasurementCd>Miles</UnitMeasurementCd>
                     </EstimatedAnnualDistance>
                     <NumDaysDrivenPerWeek></NumDaysDrivenPerWeek>
                     <VehUseCd></VehUseCd>
                  </PersVeh>
               </PersAutoLineBusiness>
               <Location id="L01">
               </Location>
            </PersAutoPolicyQuoteInqRq>
         </InsuranceSvcRq>
      </ACORD>`;
   }


   returnHawksoftXML(client: Client, user: User, company: Company) {
      return `<?xml version="1.0" encoding="UTF-8"?>
      <ACORD>
         <SignonRq>
            <CustLangPref>EN-US</CustLangPref>
            <ClientApp>
               <Org>HawkSoft</Org>
               <Name>HawkSoft CMS</Name>
               <Version>4.04.18.176</Version>
            </ClientApp>
         </SignonRq>
         <InsuranceSvcRq>
            <RqUID></RqUID>
            <PersAutoPolicyQuoteInqRq>
               <RqUID></RqUID>
               <TransactionRequestDt>${new Date()}</TransactionRequestDt>
               <TransactionEffectiveDt>${new Date()}</TransactionEffectiveDt>
               <Producer>
                  <GeneralPartyInfo>
                     <NameInfo>
                        <CommlName>
                           <CommercialName>${company.name}</CommercialName>
                        </CommlName>
                     </NameInfo>
                     <!-- <Addr>
                        <Addr1></Addr1>
                        <City></City>
                        <StateProvCd></StateProvCd>
                        <PostalCode></PostalCode>
                     </Addr> -->
                     <Communications>
                        <PhoneInfo>
                           <PhoneNumber>${company.contactNumber}</PhoneNumber>
                           <PhoneTypeCd>Phone</PhoneTypeCd>
                        </PhoneInfo>
                        <!-- <PhoneInfo>
                           <PhoneNumber></PhoneNumber>
                           <PhoneTypeCd></PhoneTypeCd>
                        </PhoneInfo> -->
                     </Communications>
                  </GeneralPartyInfo>
               </Producer>
               <InsuredOrPrincipal>
                  <GeneralPartyInfo>
                     <NameInfo>
                        <PersonName>
                           <Surname>${user.lastName}</Surname>
                           <GivenName>${user.firstName}</GivenName>
                        </PersonName>
                     </NameInfo>
                     <!-- <Addr>
                        <AddrTypeCd>StreetAddress</AddrTypeCd>
                        <Addr1></Addr1>
                        <City></City>
                        <StateProvCd></StateProvCd>
                        <PostalCode></PostalCode>
                     </Addr> -->
                     <Communications>
                        <EmailInfo id="EmailInfo1">
                           <CommunicationUseCd>Home</CommunicationUseCd>
                           <EmailAddr>${user.username}</EmailAddr>
                        </EmailInfo>
                     </Communications>
                  </GeneralPartyInfo>
                  <InsuredOrPrincipalInfo>
                     <InsuredOrPrincipalRoleCd>Insured</InsuredOrPrincipalRoleCd>
                     <!-- <PersonInfo>
                        <GenderCd></GenderCd>
                        <BirthDt></BirthDt>
                        <MaritalStatusCd></MaritalStatusCd>
                        <EmployerCd></EmployerCd>
                        <TitleRelationshipCd></TitleRelationshipCd>
                     </PersonInfo> -->
                  </InsuredOrPrincipalInfo>
               </InsuredOrPrincipal>
               <!-- <InsuredOrPrincipal>
                  <GeneralPartyInfo>
                     <NameInfo>
                        <PersonName>
                           <Surname></Surname>
                           <GivenName></GivenName>
                        </PersonName>
                     </NameInfo>
                  </GeneralPartyInfo>
                  <InsuredOrPrincipalInfo>
                     <InsuredOrPrincipalRoleCd>AI</InsuredOrPrincipalRoleCd>
                     <PersonInfo>
                        <GenderCd></GenderCd>
                        <BirthDt></BirthDt>
                        <MaritalStatusCd></MaritalStatusCd>
                        <EmployerCd></EmployerCd>
                        <TitleRelationshipCd></TitleRelationshipCd>
                     </PersonInfo>
                  </InsuredOrPrincipalInfo>
               </InsuredOrPrincipal> -->
               <PersPolicy>
                  <LOBCd>AUTO</LOBCd>
                  <!-- <NAICCd></NAICCd> -->
                  <!-- <ControllingStateProvCd></ControllingStateProvCd> -->
                  <!-- <PolicyNumber>Y8773469</PolicyNumber> -->
                  <!-- <ContractTerm>
                     <DurationPeriod>
                        <NumUnits>12</NumUnits>
                        <UnitMeasurementCd>Month</UnitMeasurementCd>
                     </DurationPeriod>
                     <EffectiveDt></EffectiveDt>
                     <ExpirationDt></ExpirationDt>
                  </ContractTerm> -->
                  <!-- <CurrentTermAmt>
                     <Amt>1737.60</Amt>
                     <CurCd>USD</CurCd>
                  </CurrentTermAmt> -->
                  <DriverVeh DriverRef="PersDriver2" VehRef="Veh1">
                     <UsePct>100</UsePct>
                  </DriverVeh>
                  <DriverVeh DriverRef="PersDriver1" VehRef="Veh2">
                     <UsePct>100</UsePct>
                  </DriverVeh>
                  <!-- if other policy <OtherOrPriorPolicy>
                     <PolicyCd>Prior</PolicyCd>
                     <InsurerName></InsurerName>
                     <NAICCd>39012</NAICCd>
                     <LOBCd>AUTO</LOBCd>
                     <LengthTimeWithPreviousInsurer>
                        <UnitMeasurementCd>Year</UnitMeasurementCd>
                        <NumUnits>1</NumUnits>
                     </LengthTimeWithPreviousInsurer>
                     <ContractTerm>
                        <EffectiveDt></EffectiveDt>
                        <ExpirationDt></ExpirationDt>
                        <DurationPeriod>
                           <UnitMeasurementCd>Month</UnitMeasurementCd>
                           <NumUnits>12</NumUnits>
                        </DurationPeriod>
                     </ContractTerm>
                  </OtherOrPriorPolicy> -->
               </PersPolicy>
               <PersAutoLineBusiness>
                  <LOBCd>AUTO</LOBCd>
                  <!-- <ContractTerm>
                     <DurationPeriod>
                        <NumUnits>12</NumUnits>
                        <UnitMeasurementCd>Month</UnitMeasurementCd>
                     </DurationPeriod>
                     <EffectiveDt>2018-12-22</EffectiveDt>
                     <ExpirationDt>2019-12-22</ExpirationDt>
                  </ContractTerm>
                  <CurrentTermAmt>
                     <Amt>1737.60</Amt>
                     <CurCd>USD</CurCd>
                  </CurrentTermAmt> -->
                  <PersVeh id="Veh1" RatedDriverRef="PersDriver2" LocationRef="Location1">
                     <ModelYear>${client.vehicles[0].vehicleModelYear}</ModelYear>
                     <VehIdentificationNumber>${client.vehicles[0].vehicleVin}</VehIdentificationNumber>
                     <Manufacturer>${client.vehicles[0].vehicleManufacturer}</Manufacturer>
                     <Model>${client.vehicles[0].vehicleModel}</Model>
                     <VehUseCd>${client.vehicles[0].vehicleUseCd}</VehUseCd>
                     <DistanceOneWay>
                        <NumUnits>${client.vehicles[0].vehicleCommuteMilesDrivenOneWay}</NumUnits>
                        <UnitMeasurementCd>MI</UnitMeasurementCd>
                     </DistanceOneWay>
                     <EstimatedAnnualDistance>
                        <NumUnits>${client.vehicles[0].vehicleAnnualDistance}</NumUnits>
                        <UnitMeasurementCd>MI</UnitMeasurementCd>
                     </EstimatedAnnualDistance>
                     <!-- <VehSymbolCd>13</VehSymbolCd> -->
                     <!-- <TerritoryCd>208</TerritoryCd> -->
                     <!-- <VehBodyTypeCd>PP</VehBodyTypeCd> -->
                     <!-- <Coverage>
                        <CoverageCd>ROAD</CoverageCd>
                        <CoverageDesc>Emergency Roadside Assistance</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatInteger>9</FormatInteger>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>MCAR</CoverageCd>
                        <CoverageDesc>Multi-Car Discount</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>ACCT</CoverageCd>
                        <CoverageDesc>Account Credit</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>FULLP</CoverageCd>
                        <CoverageDesc>Paid In Full Discount</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>CVDIS</CoverageCd>
                        <CoverageDesc>Coverage Discount</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>AQDIS</CoverageCd>
                        <CoverageDesc>Advance Coverage Discount</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>HODIS</CoverageCd>
                        <CoverageDesc>Homeownership Discount</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>ACCFR</CoverageCd>
                        <CoverageDesc>Accident Free</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>VIOFR</CoverageCd>
                        <CoverageDesc>Violation Free</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>ESNTL</CoverageCd>
                        <CoverageDesc>Essential Level Protection</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>TELEM</CoverageCd>
                        <CoverageDesc>Installed Telematic Device</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatText>Incl</FormatText>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>BI</CoverageCd>
                        <CoverageDesc>Bodily Injury Liability</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatCurrencyAmt>312.30</FormatCurrencyAmt>
                           </Amt>
                        </CurrentTermAmt>
                        <Limit>
                           <FormatInteger>100000</FormatInteger>
                           <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
                        </Limit>
                        <Limit>
                           <FormatInteger>300000</FormatInteger>
                           <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
                        </Limit>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>PD</CoverageCd>
                        <CoverageDesc>Property Damage</CoverageDesc>
                        <Limit>
                           <FormatInteger>100000</FormatInteger>
                        </Limit>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>PIP</CoverageCd>
                        <CoverageDesc>Personal Injury Protection</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatCurrencyAmt>35.80</FormatCurrencyAmt>
                           </Amt>
                        </CurrentTermAmt>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>UM</CoverageCd>
                        <CoverageDesc>Uninsured Motorist Liability</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatCurrencyAmt>43.40</FormatCurrencyAmt>
                           </Amt>
                        </CurrentTermAmt>
                        <Limit>
                           <FormatInteger>100000</FormatInteger>
                           <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
                        </Limit>
                        <Limit>
                           <FormatInteger>300000</FormatInteger>
                           <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
                        </Limit>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>UNDUM</CoverageCd>
                        <CoverageDesc>Underinsured Motorist Liability</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatInteger>19</FormatInteger>
                           </Amt>
                        </CurrentTermAmt>
                        <Limit>
                           <FormatInteger>100000</FormatInteger>
                           <LimitAppliesToCd>PerPerson</LimitAppliesToCd>
                        </Limit>
                        <Limit>
                           <FormatInteger>300000</FormatInteger>
                           <LimitAppliesToCd>PerAcc</LimitAppliesToCd>
                        </Limit>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>COLL</CoverageCd>
                        <CoverageDesc>Collision</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatCurrencyAmt>306.30</FormatCurrencyAmt>
                           </Amt>
                        </CurrentTermAmt>
                        <Deductible>
                           <FormatInteger>500</FormatInteger>
                        </Deductible>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>COMP</CoverageCd>
                        <CoverageDesc>Comprehensive</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatCurrencyAmt>109.60</FormatCurrencyAmt>
                           </Amt>
                        </CurrentTermAmt>
                        <Deductible>
                           <FormatInteger>500</FormatInteger>
                        </Deductible>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>RREIM</CoverageCd>
                        <CoverageDesc>Rental Reimbursement</CoverageDesc>
                        <CurrentTermAmt>
                           <Amt>
                              <FormatInteger>14</FormatInteger>
                           </Amt>
                        </CurrentTermAmt>
                        <Limit>
                           <FormatInteger>35</FormatInteger>
                           <LimitAppliesToCd>PerDay</LimitAppliesToCd>
                        </Limit>
                        <Limit>
                           <FormatInteger>1050</FormatInteger>
                           <LimitAppliesToCd>MaxAmount</LimitAppliesToCd>
                        </Limit>
                     </Coverage>
                     <Coverage>
                        <CoverageCd>ANTHF</CoverageCd>
                        <CoverageDesc>Anti-Theft Device</CoverageDesc>
                     </Coverage> -->
                  </PersVeh>
                  <PersDriver id="PersDriver1">
                     <GeneralPartyInfo>
                        <NameInfo>
                           <PersonName>
                              <Surname>${client.drivers[0].applicantSurname}</Surname>
                              <GivenName>${client.drivers[0].applicantGivenName}</GivenName>
                           </PersonName>
                        </NameInfo>
                     </GeneralPartyInfo>
                     <DriverInfo>
                        <PersonInfo>
                           <GenderCd>${client.drivers[0].applicantGenderCd}</GenderCd>
                           <BirthDt>${client.drivers[0].applicantBirthDt}</BirthDt>
                           <MaritalStatusCd>${client.drivers[0].applicantMaritalStatusCd}</MaritalStatusCd>
                           <EmployerCd>${client.drivers[0].applicantOccupationClassCd}</EmployerCd>
                           <TitleRelationshipCd>Insured</TitleRelationshipCd>
                        </PersonInfo>
                        <DriversLicense>
                           <!-- <LicenseStatusCd>Active</LicenseStatusCd> -->
                           <!-- <LicensedDt>2000-05-06</LicensedDt> -->
                           <DriversLicenseNumber>${client.drivers[0].driverLicenseNumber}</DriversLicenseNumber>
                           <StateProvCd>${client.drivers[0].driverLicenseStateCd}</StateProvCd>
                        </DriversLicense>
                        <!-- <License>
                           <LicenseTypeCd>Driver</LicenseTypeCd>
                           <LicenseStatusCd>Active</LicenseStatusCd>
                           <LicensedDt></LicensedDt>
                           <LicensePermitNumber></LicensePermitNumber>
                           <StateProvCd>UT</StateProvCd>
                        </License> -->
                     </DriverInfo>
                     <PersDriverInfo>
                        <DriverRelationshipToApplicantCd>IN</DriverRelationshipToApplicantCd>
                     </PersDriverInfo>
                  </PersDriver>
               </PersAutoLineBusiness>
               <Location id="Location1">
                  <Addr>
                     <AddrTypeCd>StreetAddress</AddrTypeCd>
                     <Addr1>${client.streetNumber + ' ' + client.streetName}</Addr1>
                     <City>${client.city}</City>
                     <StateProvCd>${client.stateCd}</StateProvCd>
                     <PostalCode>${client.postalCd}</PostalCode>
                  </Addr>
               </Location>
            </PersAutoPolicyQuoteInqRq>
         </InsuranceSvcRq>
      </ACORD>`;
   }


}
