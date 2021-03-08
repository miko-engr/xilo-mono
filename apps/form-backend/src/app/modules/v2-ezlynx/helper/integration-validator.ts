import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path'
const readFileAsync = promisify(fs.readFile);
import * as jsonschema from 'jsonschema';
const validate = jsonschema.validate;
import { escapeRegExp } from 'lodash';
import * as libxml from 'libxmljs';
import * as ezHelper from '../../ezlynx/helper/ezlynx.helper';
import { V2EzlynxHelper } from '../helper/v2-ezlynx.helper';
export class IntegrationValidator {
  constructor(private v2EzHelper: V2EzlynxHelper) {}

  async arrayExists(array) {
        return array && array.length && array.length > 0;
  }

  async validateEZLynx(client, type, method) {
    try {

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const schema = method === 'fields' ? require(`../../../../assets/schema/ez${type}-fields.json`) : require(`../../../../assets/schema/ez${type}.json`);
      let ezData = null;

      if (type === 'auto') {
        ezData = await ezHelper.returnAutoData(client);
        if (!ezData.status) {
          return ezData;
        }
        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address.Phone
        ) {
          ezData.data.Applicant.Address.Phone = [
            ezData.data.Applicant.Address.Phone,
          ];
        }
        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address.Email
        ) {
          ezData.data.Applicant.Address.Email = [
            ezData.data.Applicant.Address.Email,
          ];
        }
        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address[0] &&
          ezData.data.Applicant.Address[0] !== {}
        ) {
          ezData.data.Applicant.Address = [ezData.data.Applicant.Address];
        } else {
          delete ezData.data.Applicant.Address;
        }
        if (await this.arrayExists(ezData.data.Drivers)) {
          ezData.data.Drivers = { Driver: ezData.data.Drivers[0].children };
          if (
            ezData.data.Drivers.Driver[0] &&
            ezData.data.Drivers.Driver[0].Accident
          ) {
            ezData.data.Drivers.Driver[0].Accident = [
              ezData.data.Drivers.Driver[0].Accident,
            ];
          }
          if (
            ezData.data.Drivers.Driver[0] &&
            ezData.data.Drivers.Driver[0].Violation
          ) {
            ezData.data.Drivers.Driver[0].Violation = [
              ezData.data.Drivers.Driver[0].Violation,
            ];
          }
          if (
            ezData.data.Drivers.Driver[0] &&
            ezData.data.Drivers.Driver[0].CompLoss
          ) {
            ezData.data.Drivers.Driver[0].CompLoss = [
              ezData.data.Drivers.Driver[0].CompLoss,
            ];
          }
        } else if (method === 'fields') {
          delete ezData.data.Drivers;
        } else {
          ezData.data.Drivers = { Driver: [] };
        }
        if (await this.arrayExists(ezData.data.Vehicles)) {
          ezData.data.Vehicles = { Vehicle: ezData.data.Vehicles[0].children };
        } else if (method === 'fields') {
          delete ezData.data.Vehicles;
        } else {
          ezData.data.Vehicles = { Vehicle: [] };
        }
        if (await this.arrayExists(ezData.data.VehiclesUse)) {
          ezData.data.VehiclesUse = {
            VehicleUse: ezData.data.VehiclesUse[0].children,
          };
        } else if (method === 'fields') {
          delete ezData.data.VehiclesUse;
        } else {
          ezData.data.VehiclesUse = { VehicleUse: [] };
        }
        if (ezData.data.Coverages) {
          const coverages = ezData.data.Coverages;
          ezData.data.Coverages = {};
          if (coverages[0]) {
            ezData.data.Coverages[coverages[0].name] = coverages[0].children[0];
          }
          if (coverages[1]) {
            ezData.data.Coverages[coverages[1].name] = coverages[1].children;
          }
        }
        ezData.data.Applicant = [ezData.data.Applicant];
      } else {
        ezData = await ezHelper.returnHomeData(client);
        if (!ezData.status) {
          return ezData;
        }
        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address.Phone
        ) {
          ezData.data.Applicant.Address.Phone = [
            ezData.data.Applicant.Address.Phone,
          ];
        }
        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address.Email
        ) {
          ezData.data.Applicant.Address.Email = [
            ezData.data.Applicant.Address.Email,
          ];
        }
        ezData.data.Applicant.Address = [ezData.data.Applicant.Address];
        ezData.data.Applicant = [ezData.data.Applicant];

        if (
          ezData.data.Applicant.Address &&
          ezData.data.Applicant.Address[0] &&
          ezData.data.Applicant.Address[0] !== {}
        ) {
          ezData.data.Applicant.Address = [ezData.data.Applicant.Address];
        } else {
          delete ezData.data.Applicant.Address;
        }

        // Baths
        if (
          ezData.data.RatingInfo &&
          ezData.data.RatingInfo.ReplacementCostExtended &&
          ezData.data.RatingInfo.ReplacementCostExtended.FullBaths
        ) {}
      }

      const ezJson = {
        [`EZ${type.toUpperCase()}`]: ezData.data,
      };

      const result = await validate(ezJson, schema);

      const messages = [];

      if (result && result.errors) {
        for (const err of result.errors) {
          const messageArray = err.property.split('.');
          const propertyIndex = messageArray.length - 1;
          const objectIndex = messageArray.length - 2;
          let message = `Issue with ${messageArray[propertyIndex]} in ${messageArray[objectIndex]}: ${err.instance} ${err.message}`;
          message = message.replace('[0]', ' 1');
          message = message.replace('enum', 'the');
          message = message.replace('integer', 'number');
          message = message.replace('[object Object]', 'Data');
          messages.push(message);
        }
      }

      return { status: true, messages: messages };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  async replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  async validateV2EZLynx(client, type, method) {
    try {
      const sPath =
        method === 'fields'
          ? `/assets/schema/ezlynx-fields${type}V200.xsd`
          : `/assets/schema/ezlynx${type}V200.xsd`;
      const schemaPath = join(__dirname, sPath);
      const schema = await readFileAsync(schemaPath, { encoding: 'utf8' });
      const ezData = await this.v2EzHelper.returnData(client, type);

      if (!ezData.status)
        return { status: false, error: ezData.error };

      const xsdDoc = libxml.parseXml(schema);
      const xmlDocValid = libxml.parseXml(ezData.data);

      xmlDocValid.validate(xsdDoc);

      const validation = xmlDocValid.validationErrors;

      const messages = [];

      const result = validation.map((err) => {
        let error = err ? err.toString() : null;
        if (error) {
          error = this.replaceAll(
            error,
            '{http://www.ezlynx.com/XMLSchema/Auto/V200}',
            ''
          );
          error = this.replaceAll(
            error,
            '{http://www.ezlynx.com/XMLSchema/Home/V200}',
            ''
          );
          error = this.replaceAll(error, 'element', 'field');
          error = this.replaceAll(error, 'Error: ', '');
          error = this.replaceAll(error, "[facet 'enumeration']", '');
          error = this.replaceAll(error, "[facet 'pattern']", '');
          error = this.replaceAll(error, 'atomic', '');
          error = this.replaceAll(error, '\n', '');
          error = this.replaceAll(error, '/n', '');
          messages.push(error);
          return error;
        } else {
          return '';
        }
      });

      if (!result || !result.length || result.length === 0) {
        return { status: true, messages: null };
      }

      return { status: true, messages: messages };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
