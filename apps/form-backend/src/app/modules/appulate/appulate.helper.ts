/* eslint-disable no-param-reassign, consistent-return, no-lonely-if */
import {
  Injectable,
  Inject,
  Scope,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as archiver from 'archiver';
import * as pdfFiller from 'pdffiller';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import { Pdfs } from '../pdf/pdfs.entity';
import { CreatePdfDto } from '../pdf/dto/create-pdf.dto';
import { Clients } from '../client/client.entity';
import { ClientDto } from '../client/dto/client.dto';
import { Companies } from '../company/company.entity';
import { CompanyDto } from '../company/dto/company.dto';
import { Vehicles } from '../../entities/Vehicles';
import { Drivers } from '../driver/drivers.entity';
import { CreateDriverDto } from '../driver/dto/create-driver.dto';
import { Businesses } from '../business/businesses.entity';
import { CreateBusinessDto } from '../business/dto/create-business.dto';
import { Homes } from '../home/homes.entity';
import { formatDate } from '../../helpers/date.helper';
import { awsCredential } from '../../constants/appconstant';
import { ClientDetailsDto } from './dto/client-details.dto';

const { secretAccessKey, accessKeyId, region } = awsCredential;
const fsFile = fs.promises;

@Injectable({ scope: Scope.REQUEST })
export class AppulateHelper {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Pdfs) private pdfsRepository: Repository<Pdfs>,
    @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @InjectRepository(Vehicles)
    private vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(Drivers) private driversRepository: Repository<Drivers>,
    @InjectRepository(Businesses)
    private businessesRepository: Repository<Businesses>,
    @InjectRepository(Homes) private homesRepository: Repository<Homes>
  ) {}

  async getPdFFormZipByBuffer(
    clientDetails: ClientDetailsDto,
    clientParamsId: string,
    next: any
  ) {
    const { pdfId, clientId } = clientDetails;
    const pdfData: CreatePdfDto = await this.pdfsRepository.findOne(pdfId);

    if (!pdfData)
      throw new HttpException('Pdf not found!', HttpStatus.BAD_REQUEST);
    const clientData: ClientDto = await this.clientsRepository.findOne(
      clientId
    );

    if (!clientData)
      throw new HttpException('Client not found!', HttpStatus.BAD_REQUEST);
    const companyData: CompanyDto[] = await this.companiesRepository
      .createQueryBuilder('companies')
      .where({ id: clientData.companyClientId })
      .getRawMany();

    const vehicleData: any = await this.vehiclesRepository
      .createQueryBuilder('vehicles')
      .where({ clientVehicleId: clientData.id })
      .getRawMany();

    if (!vehicleData)
      throw new HttpException('Vehicle not found!', HttpStatus.BAD_REQUEST);
    const driverData: CreateDriverDto[] = await this.driversRepository
      .createQueryBuilder('drivers')
      .where({ clientDriverId: clientData.id })
      .getRawMany();

    if (!driverData)
      throw new HttpException('Driver not found!', HttpStatus.BAD_REQUEST);
    const businessData: CreateBusinessDto = await this.businessesRepository.findOne(
      { clientBusinessId: clientData.id }
    );
    const homeData: any = await this.homesRepository.findOne({
      clientHomeId: clientData.id,
    });

    const tempFieldObj: Array<object> = [];
    const drivers: Array<object> = [];
    const vehicles: Array<object> = [];
    const datesArray: Array<string> = [
      'birthDate',
      'priorPenaltiesDate',
      'spouseBirthdate',
      'priorInsuranceExpirationDate',
      'priorInsuranceStartDate',
      'accidentDate',
      'compLossDate',
      'homeLossDate',
      'entityStartDate',
      'purchaseDate',
      'moveInDate',
      'windMitigationInspectionDate',
      'plumbingUpdateDate',
      'purchaseDate',
      'priorOdometerReadingDate',
      'currentOdometerReadingDate',
      'applicantBirthDt',
      'driverLicensedDt',
      'priorPenaltiesDate',
      'hireDate',
    ];

    await pdfData.fields.forEach(async (oneField) => {
      if (oneField.type === 'client') {
        const isDate: boolean = datesArray.includes(oneField.value);
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
      } else if (oneField.type === 'business') {
        const isDate: boolean = datesArray.includes(oneField.value);
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
        const isDate: boolean = datesArray.includes(oneField.value);
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

    await vehicleData.forEach(async (oneVehicle, key) => {
      await vehicles.forEach((vehicle) => {
        if (vehicle['name'].includes(key + 1)) {
          vehicle['isFillup'] = true;
          const isDate: boolean = datesArray.includes(vehicle['value']);
          vehicle['value'] = isDate
            ? formatDate(oneVehicle[vehicle['value']])
            : oneVehicle[vehicle['value']];
        }
      });
    });

    await driverData.forEach(async (oneDriver, key) => {
      await drivers.forEach(async (driver) => {
        if (driver['name'].includes(key + 1)) {
          driver['isFillup'] = true;
          const isDate: boolean = datesArray.includes(driver['value']);
          driver['value'] = isDate
            ? formatDate(oneDriver[driver['value']])
            : oneDriver[driver['value']];
        }
      });
    });

    const fieldObj: object[] = [...drivers, ...vehicles, ...tempFieldObj];

    const filledObj = {};
    fieldObj.forEach((oneField) => {
      if (oneField['type'] === 'vehicles' || oneField['type'] === 'drivers') {
        if (!oneField['isFillup']) {
          oneField['value'] = null;
        }
      }

      if (oneField['value']) {
        if (oneField['value'] === true || oneField['value'] === 'Yes') {
          filledObj[oneField['name']] = 'Yes';
        } else {
          if (!oneField['expectedValue']) {
            filledObj[oneField['name']] = oneField['value'];
          } else {
            const isCheckbox: boolean =
              oneField['value'].toLowerCase() ===
              oneField['expectedValue'].toLowerCase();
            if (isCheckbox) {
              filledObj[oneField['name']] = 'Yes';
            }
          }
        }
      }
    });

    const s3: any = new S3({
      secretAccessKey: secretAccessKey,
      accessKeyId: accessKeyId,
      region: region,
    });

    const { fileName } = pdfData;
    const params: object = {
      Bucket: 'rent-z',
      Key: fileName,
    };

    const filePath: any = `server/assets/pdfForm/${fileName}`;
    const zipFilePath: any = `server/assets/pdfForm/${clientParamsId}.zip`;
    const clientfileName: any = `${clientParamsId}.pdf`;
    const filledPdfFilePath: any = `server/assets/pdfForm/${clientId}.pdf`;
    await s3.getObject(params, async (error, s3Data) => {
      if (error) throw new HttpException(error, HttpStatus.BAD_REQUEST);

      await fs.writeFile(filePath, s3Data.Body, async (fsError) => {
        if (fsError) throw new HttpException(fsError, HttpStatus.BAD_REQUEST);

        await pdfFiller.fillForm(
          filePath,
          filledPdfFilePath,
          filledObj,
          async (pdfErr) => {
            if (pdfErr) throw new HttpException(pdfErr, HttpStatus.BAD_REQUEST);
            const output: any = await fs.createWriteStream(zipFilePath);
            const archive: any = await archiver('zip', {
              gzip: true,
              zlib: { level: 9 },
            });
            archive.on('error', (archiveError) => {
              throw archiveError;
            });
            archive.pipe(output);
            archive.file(filledPdfFilePath, { name: clientfileName });
            await archive.finalize();
            const zipFileBuffer: any = await fsFile.readFile(
              zipFilePath,
              'base64'
            );
            await fs.unlinkSync(filePath);
            await fs.unlinkSync(filledPdfFilePath);
            await fs.unlinkSync(zipFilePath);
            return next(null, zipFileBuffer);
          }
        );
      });
    });
  }
}
