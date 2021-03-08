import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as fs from 'fs';
import * as pdfFiller from 'pdffiller';
import * as PDFDocument from 'pdfkit';
import * as stringSimilarity from 'string-similarity';
import * as rP from 'request-promise';
import { escapeRegExp } from 'lodash';
import * as AWS from 'aws-sdk';
import { awsCredential } from '../../constants/appconstant';
import { Pdfs } from './pdfs.entity';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { Clients } from '../client/client.entity';
import { Forms } from '../form/forms.entity';
import { Companies } from '../company/company.entity';
import { Locations } from '../location/location.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Policies } from '../../entities/Policies';
import { Businesses } from '../business/businesses.entity';
import { Drivers } from '../driver/drivers.entity';
import { Homes } from '../home/homes.entity';
import { Incidents } from '../incident/incidents.entity';
import { Pages } from '../page/page.entity';
import { Answers } from '../../entities/Answers';
import { Questions } from '../../entities/Questions';
import { RecreationalVehicles } from '../recreational-vehicle/recreational-vehicles.entity';
import { returnArrayOfKeys } from '../company/helper/company.helper';
import { formatDate } from '../../helpers/date.helper';

AWS.config.update({
  secretAccessKey: awsCredential.secretAccessKey,
  accessKeyId: awsCredential.accessKeyId,
  region: awsCredential.region,
});
const s3 = new AWS.S3();

@Injectable({ scope: Scope.REQUEST })
export class PdfService {
  constructor(
    @InjectRepository(RecreationalVehicles)
    private recreationalVehiclesRepository: Repository<RecreationalVehicles>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    @InjectRepository(Questions)
    private questionsRepository: Repository<Questions>,
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>,
    @InjectRepository(Homes)
    private homesRepository: Repository<Homes>,
    @InjectRepository(Incidents)
    private incidentsRepository: Repository<Incidents>,
    @InjectRepository(Businesses)
    private businessesRepository: Repository<Businesses>,
    @InjectRepository(Drivers)
    private driversRepository: Repository<Drivers>,
    @InjectRepository(Pdfs)
    private pdfsRepository: Repository<Pdfs>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Forms)
    private formsRepository: Repository<Forms>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Locations)
    private locationsRepository: Repository<Locations>,
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(Policies)
    private policiesRepository: Repository<Policies>,
    @Inject(REQUEST) private request: Request
  ) {}
  async addPdfForm(file: any, pdfBody: CreatePdfDto) {
    try {
      if (!file || !pdfBody) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }
      const uploadedFile = await this.uploadFile(file);
      if (uploadedFile.message) {
        throw new HttpException(uploadedFile.message, HttpStatus.BAD_REQUEST);
      }
      const pdfData = await this.pdfsRepository.save({
        fileName: uploadedFile.key,
        formName: pdfBody.formName,
        isTemplate: pdfBody.isTemplate,
        exportValues: pdfBody.exportValues,
        companyId: this.request.body.decodedUser.companyId,
      });

      if (!pdfData) {
        throw new HttpException(
          'Failed to upload the file',
          HttpStatus.BAD_REQUEST
        );
      }

      const { fileName } = pdfData;

      const filePath = `server/assets/pdfForm/${fileName}`;
      const params = {
        Bucket: 'rent-z',
        Key: fileName,
      };
      const s3 = new AWS.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });
      await s3.getObject(params, async (error, data) => {
        if (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        await fs.writeFile(filePath, data.Body as any, async (fsErr) => {
          if (fsErr) {
            throw new HttpException(fsErr, HttpStatus.BAD_REQUEST);
          }
          const nameRegex = null;
          await pdfFiller.generateFDFTemplate(
            filePath,
            nameRegex,
            async (PDFErr, formFields) => {
              if (PDFErr) {
                throw new HttpException(PDFErr, HttpStatus.BAD_REQUEST);
              }

              const formFieldsList = [];
              if (this.request.query.version === '2') {
                const companyKeys = await returnArrayOfKeys('company');
                const clientKeys = await returnArrayOfKeys('client');
                const driverKeys = await returnArrayOfKeys('drivers');
                const vehicleKeys = await returnArrayOfKeys('vehicles');
                const homeKeys = await returnArrayOfKeys('homes');
                const businessKeys = await returnArrayOfKeys('business');
                const locationKeys = await returnArrayOfKeys('locations');
                const policyKeys = await returnArrayOfKeys('policies');
                const keys = await returnArrayOfKeys(null);

                Object.keys(formFields).forEach(async (oneField) => {
                  try {
                    const types = [
                      'company',
                      'client',
                      'drivers',
                      'vehicles',
                      'homes',
                      'business',
                      'locations',
                      'policies',
                    ];
                    let fieldArr = [];
                    if (oneField.includes('WHERE')) {
                      if (
                        oneField.includes('.') &&
                        oneField.split('.').length === 6
                      ) {
                        function replaceAll(str, find, replace) {
                          return str.replace(
                            new RegExp(escapeRegExp(find), 'g'),
                            replace
                          );
                        }

                        fieldArr = oneField.split('.');

                        const type =
                          types[
                            stringSimilarity.findBestMatch(fieldArr[1], types)
                              .bestMatchIndex
                          ];
                        const expectedString =
                          fieldArr[5] && !fieldArr[5].includes('[')
                            ? replaceAll(fieldArr[5], '+', ' ')
                            : null;
                        const whereValueString =
                          fieldArr[3] && !fieldArr[3].includes('[')
                            ? replaceAll(fieldArr[3], '+', ' ')
                            : null;
                        let keys = clientKeys;
                        if (type === 'company') {
                          keys = companyKeys;
                        } else if (type === 'client') {
                          keys = clientKeys;
                        } else if (type === 'drivers') {
                          keys = driverKeys;
                        } else if (type === 'vehicles') {
                          keys = vehicleKeys;
                        } else if (type === 'homes') {
                          keys = homeKeys;
                        } else if (type === 'business') {
                          keys = businessKeys;
                        } else if (type === 'locations') {
                          keys = locationKeys;
                        } else if (type === 'policies') {
                          keys = policyKeys;
                        }
                        const bm = stringSimilarity.findBestMatch(
                          fieldArr[4],
                          keys
                        );
                        let value = null;
                        if (bm.bestMatch.rating >= 0.5) {
                          const bmi = bm.bestMatchIndex;
                          value = keys[bmi];
                        }
                        formFieldsList.push({
                          name: oneField,
                          value: value ? value : '',
                          type: value ? type : '',
                          expectedValue: expectedString ? expectedString : '',
                          whereKey: fieldArr[2],
                          whereValue: whereValueString,
                        });
                      } else if (
                        oneField.includes('.') &&
                        oneField.split('.').length === 5
                      ) {
                        function replaceAll(str, find, replace) {
                          return str.replace(
                            // new RegExp(escapeRegExp(find), 'g'),
                            replace
                          );
                        }

                        fieldArr = oneField.split('.');

                        const type =
                          types[
                            stringSimilarity.findBestMatch(fieldArr[1], types)
                              .bestMatchIndex
                          ];
                        const whereValueString =
                          fieldArr[3] && !fieldArr[3].includes('[')
                            ? replaceAll(fieldArr[3], '+', ' ')
                            : null;

                        let keys = clientKeys;
                        if (type === 'company') {
                          keys = companyKeys;
                        } else if (type === 'client') {
                          keys = clientKeys;
                        } else if (type === 'drivers') {
                          keys = driverKeys;
                        } else if (type === 'vehicles') {
                          keys = vehicleKeys;
                        } else if (type === 'homes') {
                          keys = homeKeys;
                        } else if (type === 'business') {
                          keys = businessKeys;
                        } else if (type === 'locations') {
                          keys = locationKeys;
                        } else if (type === 'policies') {
                          keys = policyKeys;
                        }

                        const bm = stringSimilarity.findBestMatch(
                          fieldArr[4],
                          keys
                        );
                        let value = null;
                        if (bm.bestMatch.rating >= 0.5) {
                          const bmi = bm.bestMatchIndex;
                          value = keys[bmi];
                        }
                        formFieldsList.push({
                          name: oneField,
                          value: value ? value : '',
                          type: value ? type : '',
                          whereKey: fieldArr[2],
                          whereValue: whereValueString,
                        });
                      }
                    } else if (
                      oneField.includes('.') &&
                      oneField.split('.').length === 3
                    ) {
                      function replaceAll(str, find, replace) {
                        return str.replace(
                          // new RegExp(escapeRegExp(find), 'g'),
                          replace
                        );
                      }

                      fieldArr = oneField.split('.');

                      const type =
                        types[
                          stringSimilarity.findBestMatch(fieldArr[0], types)
                            .bestMatchIndex
                        ];
                      const expectedString =
                        fieldArr[2] && !fieldArr[2].includes('[')
                          ? replaceAll(fieldArr[2], '+', ' ')
                          : null;
                      let keys = clientKeys;
                      if (type === 'company') {
                        keys = companyKeys;
                      } else if (type === 'client') {
                        keys = clientKeys;
                      } else if (type === 'drivers') {
                        keys = driverKeys;
                      } else if (type === 'vehicles') {
                        keys = vehicleKeys;
                      } else if (type === 'homes') {
                        keys = homeKeys;
                      } else if (type === 'business') {
                        keys = businessKeys;
                      } else if (type === 'locations') {
                        keys = locationKeys;
                      } else if (type === 'policies') {
                        keys = policyKeys;
                      }
                      const bm = stringSimilarity.findBestMatch(
                        fieldArr[1],
                        keys
                      );
                      let value = null;
                      if (bm.bestMatch.rating >= 0.5) {
                        const bmi = bm.bestMatchIndex;
                        value = keys[bmi];
                      }
                      formFieldsList.push({
                        name: oneField,
                        value: value ? value : '',
                        type: value ? type : '',
                        expectedValue: expectedString ? expectedString : '',
                      });
                    } else if (
                      oneField.includes('.') &&
                      oneField.split('.').length === 2
                    ) {
                      fieldArr = oneField.split('.');

                      const type =
                        types[
                          stringSimilarity.findBestMatch(fieldArr[0], types)
                            .bestMatchIndex
                        ];
                      let keys = clientKeys;
                      if (type === 'company') {
                        keys = companyKeys;
                      } else if (type === 'client') {
                        keys = clientKeys;
                      } else if (type === 'drivers') {
                        keys = driverKeys;
                      } else if (type === 'vehicles') {
                        keys = vehicleKeys;
                      } else if (type === 'homes') {
                        keys = homeKeys;
                      } else if (type === 'business') {
                        keys = businessKeys;
                      } else if (type === 'locations') {
                        keys = locationKeys;
                      } else if (type === 'policies') {
                        keys = policyKeys;
                      }
                      const bm = stringSimilarity.findBestMatch(
                        fieldArr[1],
                        keys
                      );
                      let value = null;
                      if (bm.bestMatch.rating >= 0.5) {
                        const bmi = bm.bestMatchIndex;
                        value = keys[bmi];
                      }
                      formFieldsList.push({
                        name: oneField,
                        value: value ? value : '',
                        type: value ? type : '',
                      });
                    } else {
                      const bm = stringSimilarity.findBestMatch(oneField, keys);
                      const bmi = bm.bestMatchIndex;
                      const value = keys[bmi];
                      const type = types[bmi];
                      if (bm.bestMatch.rating >= 0.5) {
                        formFieldsList.push({
                          name: oneField,
                          value: value,
                          type: type,
                        });
                      } else {
                        formFieldsList.push({
                          name: oneField,
                          value: '',
                          type: '',
                        });
                      }
                    }
                  } catch (error) {
                    throw new Error(error);
                  }
                });
              }
              const updatedPDFData = await this.pdfsRepository.update(
                pdfData.id,
                { fields: formFieldsList }
              );

              if (!updatedPDFData) {
                throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
              }
              await fs.unlinkSync(filePath);
              return {
                title: 'Pdf form uploded successfully',
                obj: updatedPDFData[1].dataValues,
              };
            }
          );
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getPdfList() {
    try {
      const whereClause = {};
      whereClause['companyId'] = this.request.body.decodedUser.companyId;

      const pdfsList = await this.pdfsRepository.find({
        where: whereClause,
      });
      if (!pdfsList) {
        throw new HttpException('No found PDFs', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Pdfs list retrieved successfully',
        obj: pdfsList,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByIdAndClientId(pdfId: number) {
    try {
      const whereClause = {};

      whereClause['id'] = pdfId;

      const pdf = await this.pdfsRepository.findOne({
        where: whereClause,
      });

      if (!pdf) {
        throw new HttpException(
          'Error finding PDF. None found',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        title: 'Pdf retrieved successfully',
        obj: pdf,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getFormFields(id: number) {
    try {
      //   if (!this.request.query) {
      //     throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      //   }
      //   const { id } = this.request.query && this.request.params;

      const pdfData = await this.pdfsRepository.findOne({
        where: {
          id,
        },
      });

      if (!pdfData) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Form fields retrieved successfully',
        pdf: pdfData,
        obj: pdfData.fields,
        fileUrl: awsCredential.s3BaseURL + pdfData.fileName,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateFormFields(pdfBody: CreatePdfDto) {
    try {
      if (!pdfBody) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }

      const { pdfId, fields } = pdfBody;

      const pdfData = await this.pdfsRepository.update(pdfId, {
        fields: fields,
      });

      if (!pdfData) {
        throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST);
      }

      return {
        title: 'Form fields updated successfully',
        obj: pdfData[1].dataValues,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async filledForm() {
    try {
      const pdfId = this.request.query.pdfId ? this.request.query.pdfId : null;
      const clientId = this.request.query.clientId
        ? this.request.query.clientId
        : this.request.params.clientId
        ? this.request.params.clientId
        : null;
      const pdfData = await this.pdfsRepository.findOne({
        where: {
          id: pdfId,
        },
      });

      if (!pdfData) {
        throw new HttpException('Pdf not found!', HttpStatus.BAD_REQUEST);
      }

      const clientData = await this.clientsRepository.findOne({
        where: {
          id: clientId,
        },
      });

      if (!clientData) {
        throw new HttpException('Client not found!', HttpStatus.BAD_REQUEST);
      }

      let form = null;

      if (clientData.formClientId) {
        form = await this.formsRepository.findOne({
          where: { id: clientData.formClientId },
          select: ['id', 'title'],
        });
      }

      const companyData = await this.companiesRepository.findOne({
        where: {
          id: clientData.companyClientId,
        },
      });

      const vehicleData = await this.vehiclesRepository.find({
        where: {
          clientVehicleId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });
      if (!vehicleData) {
        throw new HttpException('Vehicle not found!', HttpStatus.BAD_REQUEST);
      }

      const locationData = await this.locationsRepository.find({
        where: {
          clientLocationId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });
      if (!locationData) {
        throw new HttpException('Location not found!', HttpStatus.BAD_REQUEST);
      }

      const policyData = await this.policiesRepository.find({
        where: {
          clientPolicyId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });
      if (!policyData) {
        throw new HttpException('Policies not found!', HttpStatus.BAD_REQUEST);
      }

      const driverData = await this.driversRepository.find({
        where: {
          clientDriverId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      if (!driverData) {
        throw new HttpException('Driver not found!', HttpStatus.BAD_REQUEST);
      }

      const incidentData = await this.incidentsRepository.find({
        where: {
          clientIncidentId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const businessData = await this.businessesRepository.findOne({
        where: {
          clientBusinessId: clientData.id,
        },
      });

      const homeData = await this.homesRepository.findOne({
        where: {
          clientHomeId: clientData.id,
        },
      });

      const tempFieldObj = [];
      const drivers = [];
      const vehicles = [];
      const locations = [];
      const incidents = [];
      const policies = [];
      const datesArray = [
        'birthDate',
        'priorPenaltiesDate',
        'spouseBirthdate',
        'priorInsuranceExpirationDate',
        'retroDate',
        'cancellationDate',
        'priorInsuranceStartDate',
        'accidentDate',
        'compLossDate',
        'homeLossDate',
        'entityStartDate',
        'purchaseDate',
        'expirationDate',
        'moveInDate',
        'windMitigationInspectionDate',
        'plumbingUpdateDate',
        'purchaseDate',
        'priorOdometerReadingDate',
        'effectiveDate',
        'currentOdometerReadingDate',
        'applicantBirthDt',
        'driverLicensedDt',
        'priorPenaltiesDate',
        'hireDate',
        'createdAt',
        'updatedAt',
      ];

      const arrayKeys = [
        'typesOfOperations',
        'medications',
        'typeOfRetirementAccounts',
        'typesOfInsurances',
        'otherInsurances',
        'discounts',
      ];

      await pdfData.fields.forEach(async (oneField) => {
        if (oneField.type === 'client') {
          const isDate = datesArray.includes(oneField.value);
          tempFieldObj.push({
            name: oneField.name,
            value: isDate
              ? formatDate(clientData[oneField.value])
              : clientData[oneField.value],
            expectedValue: oneField.expectedValue,
          });
        } else if (oneField.type === 'drivers') {
          drivers.push(oneField);
        } else if (oneField.type === 'vehicles') {
          vehicles.push(oneField);
        } else if (oneField.type === 'locations') {
          locations.push(oneField);
        } else if (oneField.type === 'incidents') {
          incidents.push(oneField);
        } else if (oneField.type === 'policies') {
          policies.push(oneField);
        } else if (oneField.type === 'business') {
          const isDate = datesArray.includes(oneField.value);
          if (businessData) {
            tempFieldObj.push({
              name: oneField.name,
              value: isDate
                ? formatDate(businessData[oneField.value])
                : businessData[oneField.value],
              expectedValue: oneField.expectedValue,
            });
          }
        } else if (oneField.type === 'homes') {
          const isDate = datesArray.includes(oneField.value);
          if (homeData) {
            tempFieldObj.push({
              name: oneField.name,
              value: isDate
                ? formatDate(homeData[oneField.value])
                : homeData[oneField.value],
              expectedValue: oneField.expectedValue,
            });
          }
        } else if (oneField.type === 'company') {
          if (companyData) {
            tempFieldObj.push({
              name: oneField.name,
              value: companyData[oneField.value],
              expectedValue: oneField.expectedValue,
            });
          }
        }
      });

      async function setData(obj, data, key) {
        try {
          if (obj.name.includes('WHERE') && obj.whereKey) {
            if (data[obj.whereKey] && data[obj.whereKey] === obj.whereValue) {
              obj.isFillup = true;
              const isDate = datesArray.includes(obj.value);
              obj.value = isDate
                ? formatDate(data[obj.value])
                : data[obj.value];
            }
          } else if (obj.name.includes(key + 1)) {
            obj.isFillup = true;
            const isDate = datesArray.includes(obj.value);
            obj.value = isDate ? formatDate(data[obj.value]) : data[obj.value];
          }
        } catch (error) {
          console.log(error);
        }
      }

      await vehicleData.forEach(async (oneVehicle, key) => {
        await vehicles.forEach(async (vehicle) => {
          await setData(vehicle, oneVehicle, key);
        });
      });

      await driverData.forEach(async (oneDriver, key) => {
        await drivers.forEach(async (driver) => {
          await setData(driver, oneDriver, key);
        });
      });

      await locationData.forEach(async (oneLocation, key) => {
        await locations.forEach(async (location) => {
          await setData(location, oneLocation, key);
        });
      });

      await incidentData.forEach(async (oneIncident, key) => {
        await incidents.forEach(async (incident) => {
          await setData(incident, oneIncident, key);
        });
      });

      await policyData.forEach(async (onePolicy, key) => {
        await policies.forEach(async (policy) => {
          await setData(policy, onePolicy, key);
        });
      });

      const fieldObj = [
        ...policies,
        ...locations,
        ...drivers,
        ...vehicles,
        ...tempFieldObj,
      ];

      const filledObj = {};
      fieldObj.forEach((oneField) => {
        if (
          oneField.type === 'vehicles' ||
          oneField.type === 'drivers' ||
          oneField.type === 'locations' ||
          oneField.type === 'incidents' ||
          oneField.type === 'policies'
        ) {
          if (!oneField.isFillup) {
            oneField.value = null;
          }
        }
        if (oneField.value) {
          if (
            oneField.value === true ||
            oneField.value === 'Yes' ||
            oneField.name.includes(oneField.value) === true
          ) {
            if (
              oneField.name.includes(oneField.value) === true &&
              pdfData.exportValues
            ) {
              filledObj[oneField.name] = pdfData.exportValues;
            } else {
              filledObj[oneField.name] = 'Yes';
            }
          } else {
            filledObj[oneField.name] = oneField.value;
            const isArray = typeof oneField.value === 'object';
            if (isArray) {
              if (oneField.value.includes(oneField.expectedValue)) {
                filledObj[oneField.name] = pdfData.exportValues;
              } else {
                filledObj[oneField.name] = oneField.value.join(', ');
              }
            } else if (oneField.expectedValue) {
              const isCheckbox =
                oneField.value.toLowerCase() ===
                oneField.expectedValue.toLowerCase();
              const isEmpty =
                !oneField.value &&
                oneField.expectedValue.toLowerCase() === 'isempty';
              const isNotEmpty =
                oneField.value &&
                oneField.expectedValue.toLowerCase() === 'isnotempty';
              if (isCheckbox || isEmpty || isNotEmpty) {
                filledObj[oneField.name] = pdfData.exportValues;
              }
            }
          }
        }
      });

      const s3 = new AWS.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });

      const { fileName } = pdfData;
      const params = {
        Bucket: 'rent-z',
        Key: fileName,
      };

      const filePath = `server/assets/pdfForm/${fileName}`;

      await s3.getObject(params, async (error, s3Data) => {
        if (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        await fs.writeFile(filePath, s3Data.Body as string, async (fsError) => {
          if (fsError) {
            throw new HttpException(fsError, HttpStatus.BAD_REQUEST);
          }
          const filledPdfFilePath = `server/assets/pdfForm/${clientId}.pdf`;
          await pdfFiller.fillFormWithFlatten(
            filePath,
            filledPdfFilePath,
            filledObj,
            false,
            async (pdfErr) => {
              if (pdfErr) {
                throw new HttpException(pdfErr, HttpStatus.BAD_REQUEST);
              }
              if (this.request.query.isEmail) {
                const streamBuffer = await fs.readFileSync(filledPdfFilePath);
                return {
                  buffer: Buffer.from(streamBuffer),
                  filledPdfFilePath,
                  filePath,
                  fileName: form && form.title ? form.title : null,
                };
              } else {
                const streamBuffer = await fs.readFileSync(filledPdfFilePath);
                await fs.unlinkSync(filePath);
                await fs.unlinkSync(filledPdfFilePath);
                return Buffer.from(streamBuffer);
              }
            }
          );
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async genericPdf() {
    try {
      const clientId = this.request.query.clientId
        ? this.request.query.clientId
        : this.request.params.clientId
        ? this.request.params.clientId
        : null;

      const obj = { clientId: clientId };

      const pdfData = await this.createPdf(obj);

      if (!pdfData.status) {
        throw new HttpException(pdfData.error, HttpStatus.BAD_REQUEST);
      }

      return Buffer.from(pdfData.data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async createPdf(data) {
    try {
      const clientId = data.clientId ? data.clientId : null;

      const clientData = await this.clientsRepository.findOne({
        where: {
          id: clientId,
        },
      });
      if (!clientData) {
        return { status: false, error: 'Client not found!' };
      }

      const form = await this.formsRepository.findOne({
        where: {
          id: clientData.formClientId,
        },
        select: ['title'],
      });
      if (!form) {
        return { status: false, error: 'Form not found!' };
      }

      const companyData = await this.companiesRepository.findOne({
        where: {
          id: clientData.companyClientId,
        },
        select: [
          'name',
          'brandColor',
          'navbarBackgroundColorStart',
          'navbarFontColor',
          'city',
          'state',
          'logoHeight',
          'logo',
          'contactNumber',
        ],
      });
      if (!companyData) {
        return { status: false, error: 'Company not found!' };
      }

      const pages = await this.pagesRepository.find({
        where: {
          formPageId: clientData.formClientId,
        },
        select: ['id'],
        order: { position: 'ASC' },
      });
      if (!pages) {
        return { status: false, error: 'Pages not found!' };
      }

      const questions = await this.questionsRepository.find({
        where: {
          formQuestionId: clientData.formClientId,
        },
        select: ['id', 'pageQuestion'],
        order: { position: 'ASC' },
      });
      if (!questions) {
        return { status: false, error: 'Questions not found!' };
      }

      const answers = await this.answersRepository.find({
        where: {
          formAnswerId: clientData.formClientId,
        },
        select: [
          'placeholderText',
          'objectName',
          'propertyKey',
          'questionAnswer',
        ],
        order: { position: 'ASC' },
      });
      if (!answers) {
        return { status: false, error: 'Answers not found!' };
      }

      const drivers = await this.driversRepository.find({
        where: {
          clientDriverId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const vehicles = await this.vehiclesRepository.find({
        where: {
          clientVehicleId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const homes = await this.homesRepository.find({
        where: {
          clientHomeId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const locations = await this.locationsRepository.find({
        where: {
          clientLocationId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const incidents = await this.incidentsRepository.find({
        where: {
          clientIncidentId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const policies = await this.policiesRepository.find({
        where: {
          clientPolicyId: clientData.id,
        },
        order: { createdAt: 'ASC' },
      });

      const businessData = await this.businessesRepository.findOne({
        where: {
          clientBusinessId: clientData.id,
        },
      });

      const recreationalVehicles = await this.recreationalVehiclesRepository.find(
        {
          where: {
            clientRecreationalVehicleId: clientData.id,
          },
          order: { createdAt: 'ASC' },
        }
      );

      const pdfBuffer = await new Promise(async (resolve) => {
        try {
          let doc = new PDFDocument({
            bufferPages: true,
            margins: { top: 50, left: 50, right: 50, bottom: 60 },
          });

          doc.initForm();

          doc.registerFont(
            'Inter Regular',
            'server/assets/fonts/inter_regular.ttf'
          );
          doc.registerFont(
            'Inter SemiBold',
            'server/assets/fonts/inter_semibold.ttf'
          );
          doc.registerFont('Inter Bold', 'server/assets/fonts/inter_bold.ttf');

          let companyLocation = companyData.city + ', ' + companyData.state;
          let shortLocation = companyLocation;
          if (shortLocation.length > 26) shortLocation = companyData.city;
          if (shortLocation.length > 26)
            shortLocation = shortLocation.substr(0, 23) + '...';

          let logoImageData = null;
          if (companyData.logo) {
            let response = await rP.get({
              uri: companyData.logo,
              encoding: null,
            });
            logoImageData = new Buffer(response, 'base64');
          }

          drawHeader();
          drawFooter();

          let y = (doc.y = 50);
          let pageCount = 1;

          function resetStyle() {
            doc.fillColor('#868686').font('Inter Regular').fontSize(12);
          }

          function drawHeader() {
            const fontColor = companyData.navbarFontColor || '#111111';
            const navbarColor =
              companyData.navbarBackgroundColorStart || '#ffffff';
            if (navbarColor) {
              doc.rect(0, 0, doc.page.width, 48).fill(navbarColor);
            }

            doc.image('server/assets/icons/location.png', 250, 18, {
              height: 13,
            });

            doc
              .fillColor(fontColor)
              .font('Inter SemiBold')
              .fontSize(12)
              .text(shortLocation, 270, 17);

            if (companyData.contactNumber) {
              doc.image('server/assets/icons/contact.png', 450, 18, {
                height: 13,
              });

              doc
                .fillColor(fontColor)
                .font('Inter SemiBold')
                .fontSize(12)
                .text(companyData.contactNumber, 470, 17);
            }

            if (logoImageData) {
              doc.image(logoImageData, 55, 12, {
                height: 24,
              });
            }

            resetStyle();
          }

          function drawFooter() {
            const navbarColor =
              companyData.navbarBackgroundColorStart || '#ffffff';
            const fontColor = companyData.navbarFontColor || '#111111';
            let bottom = doc.page.margins.bottom;
            doc.page.margins.bottom = 0;
            if (navbarColor) {
              doc
                .rect(0, doc.page.height - 48, doc.page.width, 48)
                .fill(navbarColor);
            }

            doc
              .fillColor(fontColor)
              .font('Inter SemiBold')
              .fontSize(12)
              .text(
                companyData.name + ', ' + companyLocation,
                50,
                doc.page.height - 48 + 17
              );

            doc.text('', 50, 50);
            doc.page.margins.bottom = bottom;

            resetStyle();
          }

          doc.on('pageAdded', () => {
            pageCount++;
            drawHeader();
            drawFooter();
            doc.y = y = 70;
          });

          let labelKeys = await require('../company/helper/company.helper').returnKeys();

          let associations = {
            drivers: {
              data: drivers,
              title: 'Drivers',
              singularTitle: 'Driver',
              drawn: false,
            },
            vehicles: {
              data: vehicles,
              title: 'Vehicles',
              singularTitle: 'Vehicle',
              drawn: false,
            },
            homes: {
              data: homes,
              title: 'Homes',
              singularTitle: 'Home',
              drawn: false,
            },
            incidents: {
              data: incidents,
              title: 'Incidents',
              singularTitle: 'Incident',
              drawn: false,
            },
            locations: {
              data: locations,
              title: 'Locations',
              singularTitle: 'Location',
              drawn: false,
            },
            policies: {
              data: policies,
              title: 'Policies',
              singularTitle: 'Policy',
              drawn: false,
            },
            recreationalVehicles: {
              data: recreationalVehicles,
              title: 'Recreational vehicles',
              singularTitle: 'Recreational vehicle',
              drawn: false,
            },
          };

          let processedAnswers = [];

          function getLabel(answer) {
            let label = answer.placeholderText;
            let objectName = answer.objectName;
            let property = answer.propertyKey;

            if (
              answer.isButton &&
              labelKeys[objectName] &&
              labelKeys[objectName][property]
            )
              label = labelKeys[objectName][property];

            if (label === null || label === undefined) {
              label = property
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function (str) {
                  return str.toUpperCase();
                });
              label =
                label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
            }

            return label;
          }

          function drawLabel(label, y) {
            doc
              .fillColor('#868686')
              .font('Inter Regular')
              .fontSize(12)
              .text(label + ':', 50, y + (label.length > 35 ? 0 : 5), {
                align: 'left',
                width: 150,
              });
          }

          function drawTableHeader(text, x, y, width) {
            doc
              .fillColor('#111111')
              .font('Inter SemiBold')
              .fontSize(12)
              .text(text, x, y, {
                align: 'left',
                width: width,
              });
          }

          function drawSectionHeader(section, y) {
            let sectionHeader =
              associations[section].singularTitle + ' information';
            doc.rect(0, y - 8, doc.page.width, 32).fill('#FAFAFA');
            doc
              .fillColor('#111111')
              .font('Inter Bold')
              .fontSize(14)
              .text(sectionHeader, 50, y, {
                align: 'left',
                width: 250,
              });
            associations[section].drawn = true;
          }

          function drawValue(value, id, x, y, width) {
            if (value === null || value === undefined) value = '';

            if (typeof value.getMonth === 'function')
              value = value.toISOString();

            if (value.indexOf && value.indexOf('00.000Z') !== -1) {
              doc
                .font('Inter SemiBold')
                .fontSize(12)
                .formText(id, x, y, width, 20, {
                  value: value.split('T')[0],
                  format: {
                    type: 'date',
                    param: 'yyyy-mm-dd',
                  },
                });
            } else {
              doc.font('Inter SemiBold').formText(id, x, y, width, 20, {
                value: value.toString(),
                format: {
                  type: 'text',
                },
              });
            }
          }

          function generateFields(type, question) {
            answers.forEach((answer, index) => {
              if (answer.questionAnswerId !== question.id) return;

              let objectName = answer.objectName;
              let property = answer.propertyKey;

              if (
                property === null ||
                objectName !== type ||
                (type !== 'client' &&
                  type !== 'business' &&
                  !associations[objectName])
              )
                return;

              let processingKey = property + '|' + objectName;
              if (processedAnswers.includes(processingKey)) return;
              processedAnswers.push(processingKey);

              let label = getLabel(answer);

              if (type === 'client') {
                let value = clientData[property];

                y = doc.y + 20;
                drawLabel(label, y);
                drawValue(value, 'field' + (index + 1), 220, y, 340);
              } else if (type === 'business') {
                let value = businessData[property];

                y = doc.y + 20;
                drawLabel(label, y);
                drawValue(value, 'field' + (index + 1), 220, y, 340);
              } else {
                let data = associations[objectName].data;
                if (data.length === 0) return;

                let itemWidth = (340 - 10 * (data.length - 1)) / data.length;
                let x = 220;
                y = doc.y + 20;

                if (!associations[objectName].drawn) {
                  y += 20;
                  drawSectionHeader(objectName, y);

                  y = doc.y + 30;
                  drawTableHeader(
                    associations[objectName].singularTitle,
                    50,
                    y,
                    150
                  );

                  data.forEach((item, index2) => {
                    drawTableHeader(index2 + 1, x, y, itemWidth);
                    x += itemWidth + 10;
                  });

                  y = doc.y + 20;
                }

                drawLabel(label, y);

                x = 220;

                data.forEach((item, index2) => {
                  let value = item[property];
                  drawValue(
                    value,
                    'field' + (index + 1) + (index2 + 1),
                    x,
                    y,
                    itemWidth
                  );
                  x += itemWidth + 10;
                });
              }
            });
          }

          ['client', 'business', ...Object.keys(associations)].forEach(
            (group) => {
              pages.forEach((page) => {
                questions.forEach((question) => {
                  if (question.pageQuestionId !== page.id) return;
                  generateFields(group, question);
                });
              });
            }
          );

          function drawPageNumbers() {
            for (let i = 0; i < pageCount; i++) {
              doc.switchToPage(i);

              let bottom = doc.page.margins.bottom;
              doc.page.margins.bottom = 0;

              doc
                .fillColor('#111111')
                .font('Inter SemiBold')
                .fontSize(12)
                .text(
                  'Page ' + (i + 1) + ' of ' + pageCount,
                  480,
                  doc.page.height - 48 + 17
                );

              doc.text('', 50, 50);
              doc.page.margins.bottom = bottom;
            }
          }

          drawPageNumbers();

          doc.end();

          //Finalize document and convert to buffer array
          let buffers = [];
          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => {
            let pdfData = new Uint8Array(Buffer.concat(buffers));
            resolve(pdfData);
          });
        } catch (error) {
          resolve({ status: false, error: error });
        }
      });

      // pdf

      return { status: true, data: pdfBuffer };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async fillDefault() {
    try {
      const { pdfId, clientId } = this.request.query;

      const pdfData = await this.pdfsRepository.findOne({
        where: {
          id: pdfId,
        },
      });

      if (!pdfData) {
        throw new HttpException('Pdf not found!', HttpStatus.BAD_REQUEST);
      }

      const tempFieldObj = [];

      await pdfData.fields.forEach(async (oneField, i) => {
        tempFieldObj.push({
          name: oneField.name,
          value: i,
          expectedValue: oneField.expectedValue,
        });
      });

      const fieldObj = [...tempFieldObj];

      const filledObj = {};
      fieldObj.forEach((oneField) => {
        if (oneField.value) {
          if (oneField.value === true || oneField.value === 'Yes') {
            filledObj[oneField.name] = 'Yes';
          } else {
            if (!oneField.expectedValue) {
              filledObj[oneField.name] = oneField.value;
            } else if (typeof oneField.value === 'string') {
              const isCheckbox =
                oneField.value.toLowerCase() ===
                oneField.expectedValue.toLowerCase();
              if (isCheckbox) {
                filledObj[oneField.name] = 'Yes';
              }
            }
          }
        }
      });

      const s3 = new AWS.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });

      const { fileName } = pdfData;
      const params = {
        Bucket: 'rent-z',
        Key: fileName,
      };

      const filePath = `server/assets/pdfForm/${fileName}`;

      await s3.getObject(params, async (error, s3Data) => {
        if (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        await fs.writeFile(filePath, s3Data.Body as string, async (fsError) => {
          if (fsError) {
            throw new HttpException(fsError, HttpStatus.BAD_REQUEST);
          }
          const filledPdfFilePath = `server/assets/pdfForm/${clientId}.pdf`;
          await pdfFiller.fillFormWithFlatten(
            filePath,
            filledPdfFilePath,
            filledObj,
            false,
            async (pdfErr) => {
              if (pdfErr) {
                throw new HttpException(pdfErr, HttpStatus.BAD_REQUEST);
              }
              const streamBuffer = await fs.readFileSync(filledPdfFilePath);
              await fs.unlinkSync(filePath);
              await fs.unlinkSync(filledPdfFilePath);
              return Buffer.from(streamBuffer);
            }
          );
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async removePdfForm(id: number) {
    try {
      const pdfData = await this.pdfsRepository.findOne({
        where: { id: id },
      });
      if (!pdfData) {
        throw new HttpException('No pdf found', HttpStatus.BAD_REQUEST);
      }
      const deletedPdf = await this.pdfsRepository.delete(pdfData);
      if (deletedPdf.affected === 0) {
        throw new HttpException('deleting error', HttpStatus.BAD_REQUEST);
      }

      const params = {
        Bucket: 'rent-z',
        Key: pdfData.fileName,
      };
      const s3 = new AWS.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });
      await s3.deleteObject(params, async (error) => {
        if (error) {
          throw new HttpException(
            'Something want wrong',
            HttpStatus.BAD_REQUEST
          );
        }
        return {
          message: 'File removed successfully',
        };
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async returnClosestValue(value, array) {
    try {
      const bestValue = value
        ? array[stringSimilarity.findBestMatch(value, array).bestMatchIndex]
        : null;
      return bestValue;
    } catch (error) {
      return null;
    }
  }
  async uploadPDFAWS(filledPDFInfo: any, clientId: number) {
    try {
      const { filledPdfFilePath } = filledPDFInfo.data;
      const { filePath } = filledPDFInfo.data;

      const s3 = new AWS.S3({
        secretAccessKey: awsCredential.secretAccessKey,
        accessKeyId: awsCredential.accessKeyId,
        region: awsCredential.region,
      });

      const fileName = `${clientId}.pdf`;

      const fileStream = await fs.createReadStream(filledPdfFilePath);

      const params = {
        Bucket: 'rent-z',
        Key: fileName,
        ACL: 'public-read',
        Body: fileStream,
      };

      const data = await s3
        .upload(params)
        .promise()
        .then((thisData) => {
          return thisData;
        })
        .catch((err) => {
          throw err;
        });

      await fs.unlinkSync(filePath);
      await fs.unlinkSync(filledPdfFilePath);

      const url = data && data.Location ? data.Location : null;

      if (url) {
        await this.clientsRepository.update(clientId, {
          attachmentLink: url,
        });
      }

      filledPDFInfo.data['Location'] = url;
      return filledPDFInfo.data['Location'];
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  private uploadFile(file: any): Promise<any> {
    const params: AWS.S3.PutObjectRequest = {
      Body: file.buffer,
      Bucket: 'rent-z',
      ACL: 'public-read',
      Key: `${Math.floor(Math.random() * 10000)}${file.originalname}`,
      Metadata: { fieldName: file.fieldname },
    };
    return s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return { key: params.Key };
        },
        (err) => {
          return err;
        }
      );
  }
}
