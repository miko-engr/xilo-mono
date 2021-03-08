import * as path from 'path';
import * as csv from 'csvtojson';
import * as stringSimilarity from 'string-similarity';
import { al3Parser, encryption } from '../../../constants/appconstant';
import * as simpleencryptor from 'simple-encryptor';
const encryptor = simpleencryptor.createEncryptor(encryption.key);
import * as addressParser from 'parse-address';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Integrations } from '../../integration/Integrations.entity';
import {
  formatDateYYMMDD,
  formatDateMMYY,
  formatDateYYYYMMDD,
  addDays,
} from '../../../helpers/date.helper';

function parseAddress(address) {
  if (!address) {
    return null;
  }
  return addressParser.parseLocation(address);
}
export class PlRaterHelper {
  constructor(
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>
  ) {}
  async returnData(client, type) {
    try {
      const csvPath = path.join(
        __dirname,
        '../../assets/templates/al3/autop-2016.csv'
      );
      const outputs = await csv().fromFile(csvPath);

      if (!outputs || (outputs && outputs.length === 0)) {
        throw new HttpException(
          'Error creating form from csv. CSV conversion failed',
          HttpStatus.BAD_REQUEST
        );
      }

      function isDate(classType) {
        return (
          classType &&
          (classType.includes('DT') ||
            classType.includes('D2') ||
            classType.includes('D4'))
        );
      }

      function returnDateType(dateType) {
        if (dateType === 'DT6') {
          return 'YYMMDD';
        } else if (dateType === 'D2Y') {
          return 'MMYY';
        }
        return 'YYYYMMDD';
      }

      function returnDate(date, int) {
        if (int.dataType === 'N0') {
          if (int.classType === 'DT6') {
            return date ? formatDateYYMMDD(new Date(date)) : null;
          } else if (int.classType === 'D2Y') {
            return date ? formatDateMMYY(new Date(date)) : null;
          }
          return date ? formatDateYYYYMMDD(new Date(date)) : null;
        }
        return null;
      }

      function returnNumber(value, int) {
        if (value) {
          let string = '';
          const stringLength = parseInt(int.al3Length);
          for (let i = 0; i < stringLength; i++) {
            string += '0';
          }
          string = string.slice(0, -value.length);
          string += value;
          value = string;
          return value;
        } else {
          return null;
        }
      }

      async function returnValue(object, key, index, referenceId, int) {
        if (object === 'homes') {
          index = 0;
        }
        let value = await getValue(key, object, index);

        // In case date
        if (isDate(int.classType)) {
          if (value) {
            return returnDate(value, int);
          }
          return null;
        }

        // In Case number with needed 0's
        if (
          int.dataType === 'N0' &&
          !int.classType &&
          !key.toLowerCase().includes('ssn')
        ) {
          return returnNumber(value, int);
        }

        // In case ssn
        if (key.toLowerCase().includes('ssn')) {
          return value ? await this.returnSSN(client, key, index) : null;
        }
        if (key === 'occupation' && client.industry) {
          key = client.industry;
        } else if (key === 'spouseOccupation' && client.spouseIndustry) {
          key = client.spouseIndustry;
        } else if (
          key === 'applicantOccupationClassCd' &&
          client.drivers &&
          client.drivers[index] &&
          client.drivers[index].industry
        ) {
          key = client.drivers[index].industry;
        }
        return value
          ? await this.returnClosestValueIfClose(value, key, 0.3, referenceId)
          : null;
      }

      if (type === 'auto' || type === 'Auto') {
        type = 'AUTOP';
      } else if (type === 'home' || type === 'Home') {
        type = 'HOMEP';
      }
      const integrations = await this.integrationsRepository.find({
        where: {
          formIntegrationId: client.formClientId,
          lob: type,
          xiloKey: Not(IsNull),
          xiloObject: Not(IsNull),
        },
        order: { sequence: 'ASC', al3Start: 'ASC', index: 'ASC' },
      });

      if (!integrations || (integrations.length && integrations.length === 0)) {
        return { status: false, error: 'No integrations found' };
      }

      const integrationsLength = integrations.length;
      const isXILOMultiple = ['drivers', 'vehicles', 'incidents', 'homes'];

      const lobType = type === 'AUTOP' ? 'AUTO' : 'HOME';

      let dataObj = [];

      if (type === 'AUTOP') {
        dataObj = [
          {
            header: '1MHG176',
            sequence: 1,
            values: [
              { start: '011', value: 'AMS Rackley', length: '176' },
              { start: '057', value: '0', length: '176' },
              { start: '069', value: 'AMSSET', length: '176' },
              { start: '098', value: '0', length: '176' },
              { start: '109', value: '60', length: '176' },
              {
                start: '162',
                value: formatDateYYYYMMDD(new Date()),
                length: '176',
              },
            ],
          },
          {
            header: '2TRG212',
            sequence: 2,
            values: [
              { start: '011', value: '90', length: '212' },
              { start: '022', value: '3', length: '212' },
              { start: '023', value: 'P ', length: '212' },
              { start: '025', value: 'P', length: '212' },
              { start: '026', value: lobType, length: '212' },
              { start: '031', value: 'QTE', length: '212' },
              { start: '034', value: 'I', length: '212' },
              { start: '037', value: 'B', length: '212' },
              { start: '143', value: '0001', length: '212' },
              {
                start: '147',
                value: formatDateYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '161',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              { start: '167', value: '3', length: '212' },
              { start: '168', value: 'NBQ', length: '212' },
              {
                start: '188',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '197',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '205',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
            ],
          },
          {
            header: '2GCG110',
            sequence: 4,
            values: [
              { start: '011', value: '5GNA', length: '110' },
              { start: '015', value: '5ACT', length: '110' },
              { start: '019', value: '5ATT', length: '110' },
              { start: '023', value: '5BNG', length: '110' },
              { start: '027', value: '5FOR', length: '110' },
              { start: '031', value: '5GIG', length: '110' },
              { start: '035', value: '5OIC', length: '110' },
              { start: '039', value: '5PMI', length: '110' },
              { start: '043', value: '9AOI', length: '110' },
              { start: '047', value: '5RMK', length: '110' },
              { start: '051', value: '6PAL', length: '110' },
              { start: '055', value: '5TAI', length: '110' },
              { start: '059', value: '5NID', length: '110' },
              { start: '063', value: '5UQG', length: '110' },
              { start: '067', value: '5CNR', length: '110' },
              { start: '071', value: '5SLC', length: '110' },
              { start: '075', value: '6PDS', length: '110' },
              { start: '091', value: type, length: '110' },
            ],
          },
          {
            header: '5BIS172   B10001',
            sequence: 7,
            values: [{ start: '031', value: 'P', length: '172' }],
          },
          {
            header: '3MTG240',
            sequence: 75,
            values: [{ start: '011', value: '00010695', length: '240' }],
          },
        ];
      } else {
        dataObj = [
          {
            header: '1MHG176',
            sequence: 1,
            values: [
              { start: '011', value: 'AMS Rackley', length: '176' },
              { start: '057', value: '0', length: '176' },
              { start: '069', value: 'AMSSET', length: '176' },
              { start: '098', value: '0', length: '176' },
              { start: '109', value: '60', length: '176' },
              {
                start: '162',
                value: formatDateYYYYMMDD(new Date()),
                length: '176',
              },
            ],
          },
          {
            header: '2TRG212',
            sequence: 2,
            values: [
              { start: '011', value: '90', length: '212' },
              { start: '022', value: '3', length: '212' },
              { start: '023', value: 'P ', length: '212' },
              { start: '025', value: 'P', length: '212' },
              { start: '026', value: lobType, length: '212' },
              { start: '031', value: 'QTE', length: '212' },
              { start: '034', value: 'I', length: '212' },
              { start: '037', value: 'B', length: '212' },
              { start: '143', value: '0001', length: '212' },
              {
                start: '147',
                value: formatDateYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '161',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              { start: '167', value: '3', length: '212' },
              { start: '168', value: 'NBQ', length: '212' },
              {
                start: '188',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '197',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
              {
                start: '205',
                value: formatDateYYYYMMDD(new Date()),
                length: '212',
              },
            ],
          },
          {
            header: '2GCG110',
            sequence: 4,
            values: [
              { start: '011', value: '5GNA', length: '110' },
              { start: '015', value: '5ACT', length: '110' },
              { start: '019', value: '5ATT', length: '110' },
              { start: '023', value: '5BNG', length: '110' },
              { start: '027', value: '5FOR', length: '110' },
              { start: '031', value: '5GIG', length: '110' },
              { start: '035', value: '5OIC', length: '110' },
              { start: '039', value: '5PMI', length: '110' },
              { start: '043', value: '9AOI', length: '110' },
              { start: '047', value: '5RMK', length: '110' },
              { start: '051', value: '6PAL', length: '110' },
              { start: '055', value: '5TAI', length: '110' },
              { start: '059', value: '5NID', length: '110' },
              { start: '063', value: '5UQG', length: '110' },
              { start: '067', value: '5CNR', length: '110' },
              { start: '071', value: '5SLC', length: '110' },
              { start: '075', value: '5PAY', length: '110' },
              { start: '079', value: '5PPI', length: '110' },
              { start: '083', value: '5VEH', length: '110' },
              { start: '087', value: '5PUL', length: '110' },
              { start: '091', value: type, length: '110' },
            ],
          },
          {
            header: '5BIS172   B10001',
            sequence: 7,
            values: [{ start: '031', value: 'P', length: '172' }],
          },
          {
            header: '3MTG240',
            sequence: 112,
            values: [{ start: '011', value: '00010695', length: '240' }],
          },
        ];
      }

      async function getAddress(address) {
        const parsedAddress = parseAddress(address);
        if (parsedAddress) {
          function returnWithSpace(value) {
            return value && value !== '' ? ` ${value}` : '';
          }
          let addressObj = {};
          addressObj['StreetNumber'] = parsedAddress.number;
          addressObj['StreetName'] = `${parsedAddress.street}${returnWithSpace(
            parsedAddress.type
          )}`;
          addressObj['City'] = parsedAddress.city;
          addressObj['StateCode'] = parsedAddress.state;
          addressObj['Zip5'] = parsedAddress.zip;
          return addressObj;
        } else {
          return {};
        }
      }

      async function getValue(key, object, index) {
        return isXILOMultiple.includes(object)
          ? client[object] && client[object][index]
            ? client[object][index][key]
            : null
          : object === 'client'
          ? client[key]
          : client[object][key];
      }

      async function calcValue(value, newValue, addedValue, operator, int) {
        if (isDate(int.classType)) {
          const dateType = returnDateType(int.classType);
          value = addDays(newValue, addedValue, dateType, operator);
        } else {
          if (operator === '+') {
            value = newValue + addedValue;
          } else if (operator === '-') {
            value = newValue + addedValue;
          } else if (operator === '*') {
            value = newValue * addedValue;
          } else if (operator === '/') {
            value = newValue / addedValue;
          } else if (operator === '%') {
            value = newValue % addedValue;
          }
        }
        return value;
      }

      async function isEmpty(value) {
        return (
          typeof value == 'undefined' ||
          !value ||
          value === null ||
          value === ''
        );
      }

      async function evalCondition(
        conditionKey,
        conditionObject,
        expectedValue,
        operator,
        index,
        referenceId,
        int
      ) {
        const conditionValue = await getValue(
          conditionKey,
          conditionObject,
          index
        );
        let evalue = false;
        if (operator === '=') {
          evalue = conditionValue === expectedValue;
        } else if (operator === '!=') {
          evalue = conditionValue !== expectedValue;
        } else if (operator === '>') {
          evalue = conditionValue > expectedValue;
        } else if (operator === '<') {
          evalue = conditionValue < expectedValue;
        } else if (operator === '+') {
          if (conditionValue) {
            evalue = conditionValue.includes(expectedValue);
          } else {
            evalue = false;
          }
        } else if (operator === '!+') {
          if (conditionValue) {
            evalue = !conditionValue.includes(expectedValue);
          } else {
            evalue = false;
          }
        } else if (operator === '!') {
          if (conditionObject === 'homes') {
            index = 0;
          }
          evalue = await isEmpty(conditionValue);
        } else if (operator === '!!') {
          if (conditionObject === 'homes') {
            index = 0;
          }
          evalue = !(await isEmpty(conditionValue));
        }
        return evalue;
      }

      async function transformValue(trans, value, index, referenceId, int) {
        const newIndex = trans.index ? trans.index : index;
        const newValue = trans.newValue
          ? trans.newValue
          : trans.valueKey
          ? await returnValue(
              trans.valueObject,
              trans.valueKey,
              newIndex,
              referenceId,
              int
            )
          : value;
        if (trans.method === 'change') {
          if (trans.type === 'uppercase' && typeof value === 'string') {
            value = value.toUpperCase();
          } else if (trans.type === 'lowercase' && typeof value === 'string') {
            value = value.toLowerCase();
          } else if (trans.type === 'number' && !isNaN(value)) {
            value = parseInt(value);
          }
        } else if (trans.method === 'add') {
          value = await calcValue(
            value,
            newValue,
            trans.addedValue,
            trans.operator,
            int
          );
        } else if (trans.method === 'addif') {
          if (
            await evalCondition(
              trans.conditionKey,
              trans.conditionObject,
              trans.conditionValue,
              trans.conditionOperator,
              newIndex,
              referenceId,
              int
            )
          ) {
            value = await calcValue(
              value,
              newValue,
              trans.addedValue,
              trans.operator,
              int
            );
          }
        } else if (trans.method === 'set') {
          value = newValue;
        } else if (trans.method === 'setif') {
          if (
            await evalCondition(
              trans.conditionKey,
              trans.conditionObject,
              trans.conditionValue,
              trans.conditionOperator,
              newIndex,
              referenceId,
              int
            )
          ) {
            value = newValue;
          } else {
            value = null;
          }
        }
        return value;
      }

      function trimString(length, string) {
        return typeof string === 'string'
          ? string.substring(0, length)
          : string;
      }

      // TODO SET INDEX AND PARENT INDEX PROPERLY - FOR NOW JUST SET ALL TO 1
      async function setValue(int, index, parentIndex) {
        const refId = int.classType === 'CD' ? int.referenceId : null;
        let value = await returnValue(
          int.xiloObject,
          int.xiloKey,
          index,
          refId,
          int
        );
        if (int.transformation) {
          value = await transformValue(
            int.transformation,
            value,
            index,
            refId,
            int
          );
        } else if (!value && (int.value || int.value === 0)) {
          value = int.value;
        }

        if (value || value === 0) {
          let header = '';
          index = !int.iterative ? index : index + 1;
          if (int.processLevel === 'Trans') {
            header = `${int.group}${int.al3GroupLength}`;
          } else if (!int.parentGroup || int.parentGroup === 'None') {
            header = `${int.group}${int.al3GroupLength}   ${
              int.processLevel
            }000${int.index || '1'}`;
          } else {
            if (int.isChild) {
              int.parentIndex = !parentIndex ? 1 : parseInt(parentIndex) + 1;
              if (!int.index) {
                index = 1;
              }
            }
            header = `${int.group}${int.al3GroupLength}   ${
              int.processLevel
            }000${index || '1'}${int.parentGroup}${int.parentProcessLevel}000${
              int.parentIndex || '1'
            }`;
          }

          if (!dataObj.some((row) => row.header === header) && !int.isChild) {
            dataObj.push({
              header: header,
              sequence: int.sequence,
              values: [],
            });
          }

          // ADD DRIVER NO IF NOT EXISTS
          if (int.group.includes('5DRV')) {
            const values = [];
            const filteredADriverNo = dataObj.filter(
              (row) =>
                row.header === header &&
                row.values.some((val) => val.start === '031')
            );
            if (filteredADriverNo && filteredADriverNo.length === 0) {
              values.push({
                start: '031',
                value: `000${index}`,
                length: 4,
                reference: 'DRVNO',
              });
            }
            const filteredCDriverNo = dataObj.filter(
              (row) =>
                row.header === header &&
                row.values.some((val) => val.start === '035')
            );
            if (filteredCDriverNo && filteredCDriverNo.length === 0) {
              values.push({
                start: '035',
                value: `000${index}`,
                length: 4,
                reference: 'DRVNO',
              });
            }
            values.push({ start: '039', value: 'P', length: 1 });
            if (values.length > 0) {
              const rowIndex = dataObj.findIndex(
                (row) => row.header === header
              );
              dataObj[rowIndex].values.push(...values);
            }
          }

          // ADD VEHICLE NO IF NOT EXISTS
          if (int.group.includes('5VEH')) {
            const values = [];
            const filteredAVehicleNo = dataObj.filter(
              (row) =>
                row.header === header &&
                row.values.some((val) => val.start === '031')
            );
            if (filteredAVehicleNo && filteredAVehicleNo.length === 0) {
              values.push({
                start: '031',
                value: `000${index}`,
                length: 4,
                reference: 'VEHNO',
              });
            }
            const filteredCVehicleNo = dataObj.filter(
              (row) =>
                row.header === header &&
                row.values.some((val) => val.start === '035')
            );
            if (filteredCVehicleNo && filteredCVehicleNo.length === 0) {
              values.push({
                start: '035',
                value: `000${index}`,
                length: 4,
                reference: 'VEHNO',
              });
            }
            if (values.length > 0) {
              const rowIndex = dataObj.findIndex(
                (row) => row.header === header
              );
              dataObj[rowIndex].values.push(...values);
            }
          }

          const newLineObj = {
            start: int.al3Start,
            value: trimString(int.al3Length, value),
            length: int.al3GroupLength,
            reference: int.referenceId,
          };

          let rowIndex = null;

          if (int.isChild) {
            const parentHeader = `${int.parentGroup}`;
            const parentProcessLevel = `${int.parentProcessLevel}000${
              int.parentIndex || '1'
            }`;
            rowIndex = dataObj.findIndex(
              (row) =>
                row.header.includes(parentHeader) &&
                row.header.includes(parentProcessLevel)
            );
            if (rowIndex > -1) {
              if (!dataObj[rowIndex].children) {
                dataObj[rowIndex].children = [
                  { header: header, sequence: int.sequence, values: [] },
                ];
              } else if (
                !dataObj[rowIndex].children.some((row) => row.header === header)
              ) {
                dataObj[rowIndex].children.push({
                  header: header,
                  sequence: int.sequence,
                  values: [],
                });
              }
              const childRowIndex = dataObj[rowIndex].children.findIndex(
                (row) => row.header === header
              );
              if (childRowIndex > -1) {
                dataObj[rowIndex].children[childRowIndex].values.push(
                  newLineObj
                );
              }
            }
          } else {
            rowIndex = dataObj.findIndex((row) => row.header === header);
            if (rowIndex > -1) {
              dataObj[rowIndex].values.push(newLineObj);
            }
          }

          // if (int.group === '6CVA' || int.group === '6PVH') {
          //     let row = null;
          //     if (rowIndex > -1) {
          //         row = dataObj[rowIndex];
          //     }
          //     let string = `ROW ${index}: ___${header} - ${JSON.stringify(newLineObj)}\n\n`;
          //     console.log(string);
          // }
        } else {
          // if (int.group === '6CVA') {
          //     let string = `ROW: NONE\n\n`;
          //     console.log(string);
          // }
        }
      }

      // // Loop through integrations to assign values

      /* Integration
                  -- vendorName, parentGroup, group, element, processLevel, subLevel, xiloObject, 
                  xiloKey, value, index, transformation, arrayKey, al3Length, parentIndex, parentProcessLevel, 
                  iterative, required, sequence, start, lob
                  Header = group + al3Length + ' ' + level + 000 + index + parentGroup + parentLevel + 000 + parentIndex
                  Elements = insertAtPosition(sequence, start, length(value, al3Length))
              */

      let dataLength = 0;
      for (let i = 0; i < integrationsLength; i++) {
        const int = integrations[i];
        if (int.al3Length && !isNaN(parseInt(int.al3Length))) {
          dataLength += parseInt(int.al3Length);
        }
        if (int.iterative && isXILOMultiple.includes(int.xiloObject)) {
          const objLength =
            client[int.xiloObject] && client[int.xiloObject].length
              ? client[int.xiloObject].length
              : 0;
          for (let j = 0; j < objLength; j++) {
            const index = int.index ? int.index : j;
            await setValue(int, index, j);
          }
        } else {
          const index = isXILOMultiple.includes(int.xiloObject)
            ? int.index
              ? int.index
              : 0
            : null;
          await setValue(int, index, false);
        }
      }

      let dataString = '';

      function insertRowString(position, originalString, newString) {
        let newOriginalString = [...originalString];

        if (position > originalString.length) {
          newOriginalString.length = position - 1;
          newOriginalString.fill(' ', originalString.length, position);
          newOriginalString.splice(position, newString.length, newString);
        }

        if (position === 0) {
          newOriginalString.splice(position, newString.length, newString);
        } else if (position > 0 && position < originalString.length) {
          newOriginalString.splice(
            position - 1,
            newOriginalString.length,
            newString
          );
        }

        return newOriginalString.join('');
      }

      // dataObj = [ { header: 'XYZ', values: [ { start: 20, value: 'ABC' } ] } ]

      const sortedData = dataObj.sort((a, b) => a.sequence - b.sequence);
      for (let i = 0; i < sortedData.length; i++) {
        const row = sortedData[i];
        let newString = '';
        let length = 0;
        if (!dataString.includes(row.group)) {
          newString = insertRowString(0, newString, row.header);
        }

        function writeValues(r) {
          const sortedValues = r.values.sort((a, b) => a.start - b.start);
          for (let j = 0; j < sortedValues.length; j++) {
            const value = sortedValues[j];
            length = value.length;
            if (value.value) {
              if (r.header === '3MTG240') {
                value.value = returnNumber(value.value, { al3Length: 8 });
              }
              newString = insertRowString(value.start, newString, value.value);
            }
          }

          const filler = length + 1;
          newString = insertRowString(filler, newString, '');

          // if (sortedData[i+1]) {
          //     newString += '\n';
          // }

          dataString += newString;
          newString = '';
        }

        // Write groups to file
        writeValues(row);

        // Write child groups to file
        if (row.children && row.children.length > 0) {
          for (let j = 0; j < row.children.length; j++) {
            const childRow = row.children[j];
            if (!dataString.includes(childRow.group)) {
              newString = insertRowString(0, newString, childRow.header);
            }
            writeValues(childRow);
          }
        }
      }

      // console.log(dataString);

      return { status: true, data: dataString };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  async returnClosestNumberValue(value, array, defaultValue?: any) {
    try {
      async function returnValueIfExists(val) {
        if (
          val &&
          val !== 'undefined' &&
          typeof val !== 'undefined' &&
          val !== null
        ) {
          return val;
        }
        return null;
      }

      const returnBestValue = async (arr, val, defaultVal) => {
        try {
          if (returnValueIfExists(val)) {
            if (isNaN(val)) {
              return null;
            } else {
              arr = arr.filter((a) => !isNaN(a));
              const bestValue = arr.reduce(function (prev, curr) {
                return Math.abs(curr - val) < Math.abs(prev - val)
                  ? curr
                  : prev;
              });
              return bestValue ? bestValue.toString() : null;
            }
          } else if (returnValueIfExists(defaultVal)) {
            return defaultVal;
          } else {
            return val;
          }
        } catch (error) {
          return null;
        }
      };

      const bestValue = await returnBestValue(array, value, defaultValue);

      return bestValue;
    } catch (error) {
      return null;
    }
  }
  async returnClosestValueIfClose(value, array, buffer, referenceId) {
    try {
      async function returnValueIfExists(val) {
        if (
          val &&
          val !== 'undefined' &&
          typeof val !== 'undefined' &&
          val !== null
        ) {
          return val;
        }
        return null;
      }

      // if (element === 'PrincipalOperator' && value) {
      //     const hasDrivers = (client['drivers'] && client.drivers.length && client.drivers.length > 0);
      //     if (hasDrivers && client.drivers.some(driver => driver.id === value)) {
      //         const driverIndex = client.drivers.findIndex(driver => driver.id === value);
      //         if (driverIndex > -1) {
      //             value = (driverIndex + 1);
      //         }
      //     }
      // }

      const returnBestValue = async (arr, origArray, val, origValue) => {
        try {
          if (returnValueIfExists(val)) {
            if (isNaN(val)) {
              let bestMatchIndex = (await (stringSimilarity.findBestMatch(
                val,
                arr
              ).bestMatch.rating > buffer))
                ? await stringSimilarity.findBestMatch(val, arr).bestMatchIndex
                : null;
              // Get best match based on labels
              if (bestMatchIndex === 0 || bestMatchIndex) {
                const bestValue = val ? origArray[bestMatchIndex] : null;
                return bestValue;
              } else {
                // Get best match based on stored values
                bestMatchIndex = (await (stringSimilarity.findBestMatch(
                  origValue,
                  origArray
                ).bestMatch.rating > buffer))
                  ? await stringSimilarity.findBestMatch(origValue, origArray)
                      .bestMatchIndex
                  : null;
                if (bestMatchIndex === 0 || bestMatchIndex) {
                  const bestValue = origValue
                    ? origArray[bestMatchIndex]
                    : null;
                  return bestValue;
                }
                return null;
              }
            } else {
              return await this.returnClosestNumberValue(origValue, origArray);
            }
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      };

      let valueArray: any = !referenceId
        ? await this.returnArrayByKey(array)
        : await this.getAl3CodeOptions(referenceId);

      if (!valueArray || valueArray['error']) {
        return value;
      }

      let displayArray = null;

      let bestValue = value;

      if (referenceId === 'CONCD' && (!isNaN(bestValue) || bestValue == 0)) {
        bestValue = bestValue <= 9 ? `CON0${bestValue}` : 'CON09';
      }

      if (value && isNaN(bestValue)) {
        if (referenceId) {
          valueArray = valueArray['data'];
          displayArray = valueArray.map((opt) => opt.label.toLowerCase());
          valueArray = valueArray.map((opt) => opt.value);
        } else {
          displayArray = valueArray.map((item) => item.toLowerCase());
        }

        bestValue = await returnBestValue(
          displayArray,
          valueArray,
          bestValue.toLowerCase(),
          value
        );
      } else {
        if (referenceId) {
          valueArray = valueArray['data'];
          displayArray = valueArray.map((opt) => opt.label.toLowerCase());
          valueArray = valueArray.map((opt) => opt.value);
        } else {
          displayArray = valueArray.map((item) => item.toLowerCase());
        }

        bestValue = await this.returnClosestNumberValue(
          bestValue,
          valueArray,
          null
        );
      }

      return bestValue;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async returnSSN(client, key, index) {
    try {
      if (key === 'ssn' && client.ssn === 'Answered') {
        return encryptor.decrypt(client.ssnHash);
      } else if (
        (index || index === 0) &&
        client.drivers &&
        client.drivers[index] &&
        client.drivers[index].ssnU === 'Answered'
      ) {
        return encryptor.decrypt(client.drivers[index].ssnUHash);
      } else if (
        key === 'spouseSsn' &&
        client.spouseSsn &&
        client.spouseSsn === 'Answered'
      ) {
        return encryptor.decrypt(client.spouseSsnHash);
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  async returnArrayByKey(value) {
    try {
      switch (value) {
        case 'priorInsuranceCompany':
          return [
            'Other Standard',
            'Other Non-Standard',
            'No Prior Insurance',
            '21st Century',
            'A.Central',
            'AAA',
            'AARP',
            'Acadia',
            'Access General',
            'Ace',
            'Acuity',
            'Adirondack Ins Exchange',
            'Aegis',
            'Affirmative',
            'AIC',
            'AIG',
            'Alfa Alliance',
            'Allied',
            'Allstate',
            'America First',
            'American Commerce',
            'American Family',
            'American Freedom Insurance Company',
            'American National',
            'Amerisure',
            'Amica',
            'Anchor General',
            'Arrowhead',
            'ASI Lloyds',
            'Atlantic Mutual',
            'Austin Mutual',
            'Autoone',
            'Auto-Owners',
            'AutoTex',
            'Badger Mutual',
            'Balboa',
            'Bankers',
            'Beacon National',
            'Bear River Mutual',
            'Brethern Mutual',
            'Bristol West',
            'Buckeye',
            'California Casualty',
            'Cameron Mutual',
            'Capital Insurance Group',
            'Celina',
            'Centennial',
            'Central Mutual of OH',
            'Charter',
            'Chubb',
            'Cincinnati',
            'Citizens',
            'CNA',
            'Colonial Penn',
            'Colorado Casualty',
            'Columbia',
            'Commerce West',
            'Constitutional Casualty',
            'Consumers',
            'Cornerstone',
            'Countrywide',
            'Country Insurance',
            'CSE',
            'Cumberland',
            'Dairyland',
            'Deerbrook',
            'Delta Lloyds Insurance Company',
            'Depositors',
            'Direct',
            'Direct General',
            'Discovery',
            'Donegal',
            'Drive',
            'Electric',
            'EMC',
            'Encompass',
            'Erie',
            'Esurance',
            'Eveready',
            'Explorer',
            'Farm Bureau',
            'Farmers',
            'Federated',
            'Fidelity',
            'Financial Indemnity',
            'Firemans Fund',
            'First Acceptance',
            'First American',
            'First Auto',
            'First Chicago',
            'First Connect',
            'Flagship Insurance',
            'Foremost',
            'Founders',
            'Frankenmuth',
            'Fred Loya',
            'Gateway',
            'Geico',
            'General Casualty',
            'Germantown Mutual',
            'GMAC',
            'Grange',
            'Great American',
            'GRE/Go America',
            'Grinnell',
            'Guide One',
            'Hallmark Insurance Company',
            'Hanover',
            'Harbor',
            'Harleysville',
            'Hartford OMNI',
            'Hartford',
            'Hastings Mutual',
            'Hawkeye Security',
            'HDI',
            'Horace Mann',
            'Houston General',
            'IFA',
            'Imperial Casualty',
            'IMT Ins',
            'Indiana Farmers',
            'Indiana',
            'Infinity',
            'Insuremax',
            'Insurequest',
            'Integon',
            'Integrity',
            'Kemper',
            'Kingsway',
            'Liberty Mutual',
            'Liberty Northwest',
            'MAIF',
            'Main Street America',
            'Mapfre',
            'Markel',
            'Maryland Auto Insurance',
            'Mendakota',
            'Mendota',
            'Merchants Group',
            'Mercury',
            'MetLife',
            'Metropolitan',
            'Mid-Continent',
            'Midwestern Indemnity',
            'Montgomery',
            'Motorists Mutual',
            'MSA',
            'Mt. Washington',
            'Mutual Benefit',
            'Mutual of Enumclaw',
            'National Lloyds Insurance Company',
            'Nationwide',
            'National General',
            'New York Central Mutual',
            'NJ Manufacturers',
            'NJ Skylands',
            'Nodak Mutual',
            'Northstar',
            'NYAIP',
            'Occidental',
            'Ocean Harbor',
            'Ohio Casualty',
            'Omaha P/C',
            'Omni Insurance Co',
            'One Beacon',
            'Oregon Mutual',
            'Palisades',
            'Patriot',
            'Patrons Oxford',
            'Peerless/Montgomery',
            'Pekin',
            'Pemco',
            'Penn National',
            'Phoenix Indemnity',
            'Plymouth Rock',
            'Preferred Mutual',
            'Proformance',
            'Progressive',
            'Prudential',
            'Republic',
            'Response',
            'Rockford Mutual',
            'Royal and Sun Alliance',
            'Safeco',
            'Safe Auto',
            'Safeway',
            'Sagamore',
            'SECURA',
            'Selective',
            'Sentry Ins',
            'Shelter Insurance',
            'Southern County',
            'Southern Mutual',
            'Southern Trust',
            'St. Paul/Travelers',
            'Standard Mutual',
            'Star Casualty',
            'State Auto',
            'State Farm',
            'StillWater',
            'Stonegate',
            'Titan',
            'Topa',
            'Tower',
            'Travelers',
            'TWFG',
            'Unigard',
            'United Automobile',
            'United Fire and Casualty',
            'Unitrin',
            'Universal',
            'USAA',
            'Utica National',
            'Victoria',
            'West Bend',
            'Western National',
            'Western Reserve Group',
            'Westfield',
            'White Mountains',
            'Wilshire',
            'Wilson Mutual',
            'Wisconsin Mutual',
            'Windsor',
            'Wind Haven',
            'Zurich',
          ];
        case 'priorBodilyInjuryLimits':
          return [
            'Other Standard',
            'Other Non-Standard',
            'No Prior Insurance',
            '21st Century',
            'AAA',
            'AAANCNU',
            'AARP',
            'Acuity',
            'Adirondack Ins Exchange',
            'Aegis',
            'AIG',
            'Alfa Alliance',
            'Allianz of America',
            'Allianz of America-Jefferson',
            'Allied',
            'Allied Trust',
            'Allmerica',
            'Allstate',
            'America First',
            'American Commerce',
            'American Family',
            'American Freedom Insurance Company',
            'American Traditions',
            'Amica',
            'Anchor Insurance',
            'ASI Lloyds',
            'Atlantic Mutual',
            'Atlas General Agency',
            'Austin Mutual',
            'Auto-Owners',
            'Badger Mutual',
            'Balboa',
            'Bankers',
            'Beacon National',
            'Bear River Mutual',
            'Bunker Hill',
            'California Casualty',
            'Capital Insurance Group',
            'Capitol Preferred',
            'Central Mutual of OH',
            'Celina',
            'Centauri',
            'Chubb',
            'Cincinnati',
            'Citizens',
            'CNA',
            'Colorado Casualty',
            'CSE',
            'Cumberland',
            'Cypress',
            'Dairyland',
            'Delta Lloyds Insurance Company',
            'Donegal',
            'Electric',
            'EMC',
            'Encompass',
            'Erie',
            'Esurance',
            'Excelsior Insurance Company',
            'Fair Plan',
            'Farm Bureau',
            'Farmers',
            'Flagship Insurance',
            'Fidelity',
            'Firemans Fund',
            'First American',
            'Florida Family',
            'Florida Peninsula',
            'Geico',
            'General Casualty',
            'Germantown Mutual',
            'GMAC',
            'Goodville Mutual',
            'Grange',
            'Great American',
            'GRE/Go America',
            'Grinnell',
            'Guide One',
            'GulfStream',
            'Hallmark Insurance Company',
            'Hanover',
            'Harleysville',
            'Hartford',
            'Hartford OMNI',
            'Hawkeye Security',
            'Heritage P/C',
            'Homeowners of America',
            'Horace Mann',
            'Houston General',
            'Integon',
            'Indiana',
            'Indiana Farmers',
            'Integrity',
            'Kemper',
            'Liberty Mutual',
            'Liberty Northwest',
            'LightHouse',
            'Lloyds',
            'Main Street America',
            'Merchants Group',
            'Mercury',
            'MetLife',
            'Midwestern Indemnity',
            'Modern USA',
            'Montgomery',
            'Motorists Mutual',
            'MSA',
            'Mutual Benefit',
            'Mutual of Enumclaw',
            'National Lloyds Insurance Company',
            'Nationwide',
            'Nationwide-Scottsdale',
            'New York Central Mutual',
            'NJ Skylands',
            'Northstar',
            'Ohio Casualty',
            'Omaha P/C',
            'One Beacon',
            'Oregon Mutual',
            'Peerless/Montgomery',
            'Pekin',
            'Penn National',
            'Plymouth Rock',
            'Preferred Mutual',
            'Progressive',
            'Prudential',
            'Republic',
            'Royal and Sun Alliance',
            'Safeco',
            'SECURA',
            'Selective',
            'Shelter Insurance',
            'Southern Fidelity',
            'Southern Fidelity P/C',
            'Southern Mutual',
            'Southern Trust',
            'St. Johns',
            'St. Paul/Travelers',
            'Standard Mutual',
            'State Auto',
            'State Farm',
            'Titan',
            'Tower',
            'Towerhill',
            'Travelers',
            'TWFG',
            'Unigard',
            'United Fire and Casualty',
            'Unitrin',
            'Universal',
            'UPCIC',
            'USAA',
            'Utica National',
            'Vermont Mutual',
            'Wellington Select',
            'Wellington Standard',
            'West Bend',
            'Western National',
            'Western Reserve Group',
            'Westfield',
            'White Mountains',
            'Wilson Mutual',
            'Windsor',
            'Zurich',
          ];
        case 'industry':
          return [
            'Homemaker/Houseprsn',
            'Retired',
            'Disabled',
            'Unemployed',
            'Student',
            'Agriclt/Forestry/Fish',
            'Art/Design/Media',
            'Banking/Finance/RE',
            'Business/Sales/Offi',
            'Construct/EnrgyTrds',
            'Education/Library',
            'Engr/Archt/Sci/Math',
            'Government/Military',
            'Info Tech',
            'Insurance',
            'Lgl/Law Enfcmt/Sec',
            'Maint/Rpr/Hsekeep',
            'Mfg/Production',
            'Med/Soc Svcs/Relig',
            'Person.Care/Service',
            'Sports/Recreation',
            'Other',
          ];
        case 'occupation':
          return [
            'Homemaker/Houseprsn',
            'Retired',
            'Disabled',
            'Unemployed',
            'Graduate Student',
            'High school',
            'Other',
            'Undergraduate',
            'Agr Inspect/Grader',
            'Arborist',
            'Clerk',
            'Equip. Operator',
            'Farm/Ranch Owner',
            'Farm/Ranch Worker',
            'Fisherman',
            'Florist',
            'Laborer/Worker',
            'Landscape/NursryWkr',
            'Landscaper',
            'Logger',
            'Millworker',
            'Other',
            'Ranger',
            'Supervisor',
            'Timber Grader/Scale',
            'Actor',
            'Admin Assist',
            'Announcer/Broadcstr',
            'Artist/Animator',
            'Author/Writer',
            'Choreography/Dancer',
            'Clerk',
            'Composer/Director',
            'Curator',
            'Designer',
            'Editor',
            'Journalist/Reporter',
            'Musician/Singer',
            'Other',
            'Printer',
            'Producer',
            'Production Crew',
            'Projectionist',
            'Receptionist/Sec',
            'Ticket Sales/Usher',
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst/Broker',
            'Bookkeeper',
            'Branch Manager',
            'Clerk',
            'Collections',
            'Consultant',
            'Controller',
            'CSR/Teller',
            'Director/Administr',
            'Executive',
            'Financial Advisor',
            'Investment Banker',
            'Investor',
            'Loan/EscrowProcess',
            'Mgr-Credit/Loan',
            'Mgr-Portfolio/Prod.',
            'Mgr-Property',
            'Other',
            'Realtor',
            'Receptionist/Sec',
            'SalesAgt/Represent.',
            'Trader,Finan Instru',
            'Underwriter',
            'Account Executive',
            'Admin Assist',
            'Buyer',
            'Clerk-Office',
            'Consultant',
            'CSR',
            'Director/Administr',
            'Executive',
            'H.R. Representative',
            'Marketing Researchr',
            'Messenger/Courier',
            'Mgr - District',
            'Mgr - Finance',
            'Mgr-Dept/Store',
            'Mgr-General Opers',
            'Mgr-H.R./PublicRel',
            'Mgr-Mkt/Sales',
            'Mgr/Supervisr-Offic',
            'Other',
            'Receptionist/Sec',
            'Sales-Counter/Rentl',
            'Sales-Home Based',
            'Sales-Mfg Rep',
            'Sales-Retail/Whlsle',
            'Sales-Route/Vendor',
            'Boiler Oper/Maker',
            'Bricklayer/Mason',
            'Carpenter',
            'Carpet Installer',
            'Concrete Worker',
            'Constrct Proj Mgr',
            'Contractor',
            'Crane Operator',
            'Electrician/Linesmn',
            'ElevatorTech/Instl',
            'Equip. Operator',
            'FloorLayer/Finisher',
            'Foreman/Supervisor',
            'Handyman',
            'Heat/Air Technician',
            'Inspector',
            'Laborer/Worker',
            'Metalworker',
            'Miner',
            'Oil/GasDril/RigOpr',
            'Other',
            'Painter',
            'Plstr/Drywall/Stuc',
            'Plumber',
            'Roofer',
            'Admin Assist',
            'Audio-Visual Tech.',
            'Child/DayCare Wrker',
            'Clerk',
            'Counselor',
            'Grad. Teaching/Asst',
            'Instructor-Vocation',
            'Librarian/Curator',
            'Other',
            'Professor, College',
            'Receptionist/Sec',
            'Superintendent',
            'Teacher, College',
            'Teacher, K-12',
            'Teaching Asst/Aide',
            'Tutor',
            'Actuary',
            'Admin Assist',
            'Analyst',
            'Architect',
            'Clerk',
            'Clinical Data Coord.',
            'Drafter',
            'Engineer',
            'Manager-Project',
            'Manager-R&D',
            'Mathematician',
            'Other',
            'Receptionist/Sec',
            'Research Prog. Dir.',
            'Researcher',
            'Scientist',
            'Sociologist',
            'Surveyor/Mapmaker',
            'Technician',
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst',
            'Attorney',
            'Chief Executive',
            'Clerk',
            'Commissioner',
            'Council member',
            'Director/Administr',
            'Enlst Mil Prsnl E1-4',
            'Legislator',
            'Mayor/City Manager',
            'Meter Reader',
            'NCO (E5-9)',
            'Officer-Commissiond',
            'Officer-Warrant',
            'Other',
            'Park Ranger',
            'Planner',
            'Postmaster',
            'Receptionist/Sec',
            'Regulator',
            'US Postal Worker',
            'Admin Assist',
            'Analyst',
            'Clerk',
            'Director/Administr',
            'Engineer-Hardware',
            'Engineer-Software',
            'Engineer-Systems',
            'Executive',
            'Manager-Systems',
            'Network Admin',
            'Other',
            'Programmer',
            'Project Coordinator',
            'Receptionist/Sec',
            'Support Technician',
            'Systems Security',
            'Technical Writer',
            'Web Developer',
            'Accountant/Auditor',
            'Actuarial Clerk',
            'Actuary',
            'Admin Assist',
            'Agent/Broker',
            'Analyst',
            'Attorney',
            'Claims Adjuster',
            'Clerk',
            'Commissioner',
            'CSR',
            'Director/Administr',
            'Executive',
            'Other',
            'Product Manager',
            'Receptionist/Sec',
            'Sales Rep',
            'Underwriter',
            'Airport Sec Ofcr',
            'Animal Control Ofcr',
            'Attorney',
            'Bailiff',
            'Corrections Officer',
            'Court Clrk/Reporter',
            'Deputy Sheriff',
            'Dispatcher',
            'Examiner',
            'Fed Agt/Marshall',
            'Fire Chief',
            'Fire Fighter/Supv.',
            'Gaming Ofcr/Invest',
            'Highway Patrol Ofcr',
            'Judge/Hearing Ofcr',
            'Legal Asst./Sec',
            'Other',
            'Paralegal/Law Clerk',
            'Police Chief',
            'Police Det/Investgr',
            'Police Offcr/Supvr',
            'Process Server',
            'Prvt Invest/Detec.',
            'Security Guard',
            'Sheriff',
            'Bldg Maint Engineer',
            'Custodian/Janitor',
            'Electrician',
            'Field Service Tech.',
            'Handyman',
            'Heat/AirCond Repair',
            'Housekeeper/Maid',
            'Lndscpe/Grnds Maint',
            'Maint Mechanic',
            'Mechanic',
            'Other',
            'Admin Assist',
            'Clerk',
            'Factory Worker',
            'Foreman/Supervisor',
            'Furniture Finisher',
            'Inspector',
            'Jeweler',
            'Machine Operator',
            'Other',
            'Packer',
            'Plant Manager',
            'Printer/Bookbinder',
            'Quality Control',
            'Receptionist/Sec',
            'Refining Operator',
            'Shoemaker',
            'Tailor/Custom Sewer',
            'Textile Worker',
            'Upholsterer',
            'Admin Assist',
            'Assist-Med/Dent/Vet',
            'Clergy',
            'Clerk',
            'Client Care Worker',
            'Dental Hygenist',
            'Dentist',
            'Doctor',
            'Hospice Volunteer',
            'Mortician',
            'Nurse - C.N.A.',
            'Nurse - LPN',
            'Nurse - RN',
            'Nurse Practitioner',
            'Optometrist',
            'Other',
            'Paramedic/EM Tech',
            'Pharmacist',
            'Receptionist/Sec',
            'Social Worker',
            'Support Services',
            'Technician',
            'Therapist',
            'Veterinarian',
            'Caregiver',
            'Dry Cleaner/Laundry',
            'Hair Stylist/Barber',
            'Housekeeper',
            'Manicurist',
            'Masseuse',
            'Nanny',
            'Other',
            'Pet Services',
            'Receptionist/Sec',
            'Baker',
            'Bartender',
            'Bellhop',
            'Bus Person',
            'Caterer',
            'Chef',
            'Concessionaire',
            'Concierge',
            'Cook-Rest/Cafeteria',
            'Cook/Wrkr-Fast Food',
            'Delivery Person',
            'Desk Clerk',
            'Dishwasher',
            'Food Prod/Packing',
            'Host/Maitre d',
            'Housekeeper/Maid',
            'Manager',
            'Other',
            'Valet',
            'Waiter/Waitress',
            'Wine Steward',
            'Activity/Recre.Asst',
            'Admin Assist',
            'Agent',
            'Athlete',
            'CampCounselor/Lead',
            'Clerk',
            'Coach',
            'Concessionaire',
            'Director, Program',
            'Event Mgr/Promoter',
            'Life Guard',
            'Mgr - Fitness Club',
            'Other',
            'Park Ranger',
            'Receptionist/Sec',
            'Sales-Tkt/Mmbrshp',
            'SportsBrdcstr/Journ',
            'Trainer/Instructor',
            'Umpire/Referee',
            'Admin Assist',
            'Air Traffic Control',
            'Airport Ops Crew',
            'Bellhop/Porter',
            'Clerk',
            'Crane Loader/Oper',
            'Dispatcher',
            'Driver-Bus/Strcar',
            'Driver-Taxi/Limo',
            'Driver-Truck/Delvry',
            'Flight Attendant',
            'Forklift Operator',
            'Laborer',
            'Longshoreman',
            'Mate/Sailor',
            'Mgr Warehse/Dist',
            'Other',
            'Parking Lot Attend',
            'Pilot/Capt/Eng',
            'Railroad Worker',
            'Receptionist/Sec',
            'Shipping/RecClk',
            'Subway/LgtRail Oper',
            'Ticket Agent',
            'Transportation Spec',
            'Other',
          ];
        case 'Homemaker/House person':
          return ['Homemaker/Houseprsn'];
        case 'Retired':
          return ['Retired'];
        case 'Disabled':
          return ['Disabled'];
        case 'Unemployed':
          return ['Unemployed'];
        case 'Student':
          return ['Graduate Student', 'High school', 'Other', 'Undergraduate'];
        case 'Agriculture/Forestry/Fishing':
          return [
            'Agr Inspect/Grader',
            'Arborist',
            'Clerk',
            'Equip. Operator',
            'Farm/Ranch Owner',
            'Farm/Ranch Worker',
            'Fisherman',
            'Florist',
            'Laborer/Worker',
            'Landscape/NursryWkr',
            'Landscaper',
            'Logger',
            'Millworker',
            'Other',
            'Ranger',
            'Supervisor',
            'Timber Grader/Scale',
          ];
        case 'Art/Design/Media':
          return [
            'Actor',
            'Admin Assist',
            'Announcer/Broadcstr',
            'Artist/Animator',
            'Author/Writer',
            'Choreography/Dancer',
            'Clerk',
            'Composer/Director',
            'Curator',
            'Designer',
            'Editor',
            'Journalist/Reporter',
            'Musician/Singer',
            'Other',
            'Printer',
            'Producer',
            'Production Crew',
            'Projectionist',
            'Receptionist/Sec',
            'Ticket Sales/Usher',
          ];
        case 'Banking/Finance/Real Estate':
          return [
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst/Broker',
            'Bookkeeper',
            'Branch Manager',
            'Clerk',
            'Collections',
            'Consultant',
            'Controller',
            'CSR/Teller',
            'Director/Administr',
            'Executive',
            'Financial Advisor',
            'Investment Banker',
            'Investor',
            'Loan/EscrowProcess',
            'Mgr-Credit/Loan',
            'Mgr-Portfolio/Prod.',
            'Mgr-Property',
            'Other',
            'Realtor',
            'Receptionist/Sec',
            'SalesAgt/Represent.',
            'Trader,Finan Instru',
            'Underwriter',
          ];
        case 'Business/Sales/Office':
          return [
            'Account Executive',
            'Admin Assist',
            'Buyer',
            'Clerk-Office',
            'Consultant',
            'CSR',
            'Director/Administr',
            'Executive',
            'H.R. Representative',
            'Marketing Researchr',
            'Messenger/Courier',
            'Mgr - District',
            'Mgr - Finance',
            'Mgr-Dept/Store',
            'Mgr-General Opers',
            'Mgr-H.R./PublicRel',
            'Mgr-Mkt/Sales',
            'Mgr/Supervisr-Offic',
            'Other',
            'Receptionist/Sec',
            'Sales-Counter/Rentl',
            'Sales-Home Based',
            'Sales-Mfg Rep',
            'Sales-Retail/Whlsle',
            'Sales-Route/Vendor',
          ];
        case 'Construction/Energy Trades':
          return [
            'Boiler Oper/Maker',
            'Bricklayer/Mason',
            'Carpenter',
            'Carpet Installer',
            'Concrete Worker',
            'Constrct Proj Mgr',
            'Contractor',
            'Crane Operator',
            'Electrician/Linesmn',
            'ElevatorTech/Instl',
            'Equip. Operator',
            'FloorLayer/Finisher',
            'Foreman/Supervisor',
            'Handyman',
            'Heat/Air Technician',
            'Inspector',
            'Laborer/Worker',
            'Metalworker',
            'Miner',
            'Oil/GasDril/RigOpr',
            'Other',
            'Painter',
            'Plstr/Drywall/Stuc',
            'Plumber',
            'Roofer',
          ];
        case 'Education/Library':
          return [
            'Admin Assist',
            'Audio-Visual Tech.',
            'Child/DayCare Wrker',
            'Clerk',
            'Counselor',
            'Grad. Teaching/Asst',
            'Instructor-Vocation',
            'Librarian/Curator',
            'Other',
            'Professor, College',
            'Receptionist/Sec',
            'Superintendent',
            'Teacher, College',
            'Teacher, K-12',
            'Teaching Asst/Aide',
            'Tutor',
          ];
        case 'Engineer/Architect/Science/Math':
          return [
            'Actuary',
            'Admin Assist',
            'Analyst',
            'Architect',
            'Clerk',
            'Clinical Data Coord.',
            'Drafter',
            'Engineer',
            'Manager-Project',
            'Manager-R&D',
            'Mathematician',
            'Other',
            'Receptionist/Sec',
            'Research Prog. Dir.',
            'Researcher',
            'Scientist',
            'Sociologist',
            'Surveyor/Mapmaker',
            'Technician',
          ];
        case 'Government/Military':
          return [
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst',
            'Attorney',
            'Chief Executive',
            'Clerk',
            'Commissioner',
            'Council member',
            'Director/Administr',
            'Enlst Mil Prsnl E1-4',
            'Legislator',
            'Mayor/City Manager',
            'Meter Reader',
            'NCO (E5-9)',
            'Officer-Commissiond',
            'Officer-Warrant',
            'Other',
            'Park Ranger',
            'Planner',
            'Postmaster',
            'Receptionist/Sec',
            'Regulator',
            'US Postal Worker',
          ];
        case 'Information Technology':
          return [
            'Admin Assist',
            'Analyst',
            'Clerk',
            'Director/Administr',
            'Engineer-Hardware',
            'Engineer-Software',
            'Engineer-Systems',
            'Executive',
            'Manager-Systems',
            'Network Admin',
            'Other',
            'Programmer',
            'Project Coordinator',
            'Receptionist/Sec',
            'Support Technician',
            'Systems Security',
            'Technical Writer',
            'Web Developer',
          ];
        case 'Insurance':
          return [
            'Accountant/Auditor',
            'Actuarial Clerk',
            'Actuary',
            'Admin Assist',
            'Agent/Broker',
            'Analyst',
            'Attorney',
            'Claims Adjuster',
            'Clerk',
            'Commissioner',
            'CSR',
            'Director/Administr',
            'Executive',
            'Other',
            'Product Manager',
            'Receptionist/Sec',
            'Sales Rep',
            'Underwriter',
          ];
        case 'Legal/Law Enforcement/Security':
          return [
            'Airport Sec Ofcr',
            'Animal Control Ofcr',
            'Attorney',
            'Bailiff',
            'Corrections Officer',
            'Court Clrk/Reporter',
            'Deputy Sheriff',
            'Dispatcher',
            'Examiner',
            'Fed Agt/Marshall',
            'Fire Chief',
            'Fire Fighter/Supv.',
            'Gaming Ofcr/Invest',
            'Highway Patrol Ofcr',
            'Judge/Hearing Ofcr',
            'Legal Asst./Sec',
            'Other',
            'Paralegal/Law Clerk',
            'Police Chief',
            'Police Det/Investgr',
            'Police Offcr/Supvr',
            'Process Server',
            'Prvt Invest/Detec.',
            'Security Guard',
            'Sheriff',
          ];
        case 'Maintenance/Repair/Housekeeping':
          return [
            'Bldg Maint Engineer',
            'Custodian/Janitor',
            'Electrician',
            'Field Service Tech.',
            'Handyman',
            'Heat/AirCond Repair',
            'Housekeeper/Maid',
            'Lndscpe/Grnds Maint',
            'Maint Mechanic',
            'Mechanic',
            'Other',
          ];
        case 'Manufacturing/Production':
          return [
            'Admin Assist',
            'Clerk',
            'Factory Worker',
            'Foreman/Supervisor',
            'Furniture Finisher',
            'Inspector',
            'Jeweler',
            'Machine Operator',
            'Other',
            'Packer',
            'Plant Manager',
            'Printer/Bookbinder',
            'Quality Control',
            'Receptionist/Sec',
            'Refining Operator',
            'Shoemaker',
            'Tailor/Custom Sewer',
            'Textile Worker',
            'Upholsterer',
          ];
        case 'Medical/Social Services/Religion':
          return [
            'Admin Assist',
            'Assist-Med/Dent/Vet',
            'Clergy',
            'Clerk',
            'Client Care Worker',
            'Dental Hygenist',
            'Dentist',
            'Doctor',
            'Hospice Volunteer',
            'Mortician',
            'Nurse - C.N.A.',
            'Nurse - LPN',
            'Nurse - RN',
            'Nurse Practitioner',
            'Optometrist',
            'Other',
            'Paramedic/EM Tech',
            'Pharmacist',
            'Receptionist/Sec',
            'Social Worker',
            'Support Services',
            'Technician',
            'Therapist',
            'Veterinarian',
          ];
        case 'Personal Care/Service':
          return [
            'Caregiver',
            'Dry Cleaner/Laundry',
            'Hair Stylist/Barber',
            'Housekeeper',
            'Manicurist',
            'Masseuse',
            'Nanny',
            'Other',
            'Pet Services',
            'Receptionist/Sec',
          ];
        case 'Restaurant/Hotel Services':
          return [
            'Baker',
            'Bartender',
            'Bellhop',
            'Bus Person',
            'Caterer',
            'Chef',
            'Concessionaire',
            'Concierge',
            'Cook-Rest/Cafeteria',
            'Cook/Wrkr-Fast Food',
            'Delivery Person',
            'Desk Clerk',
            'Dishwasher',
            'Food Prod/Packing',
            'Host/Maitre d',
            'Housekeeper/Maid',
            'Manager',
            'Other',
            'Valet',
            'Waiter/Waitress',
            'Wine Steward',
          ];
        case 'Sports/Recreation':
          return [
            'Activity/Recre.Asst',
            'Admin Assist',
            'Agent',
            'Athlete',
            'CampCounselor/Lead',
            'Clerk',
            'Coach',
            'Concessionaire',
            'Director, Program',
            'Event Mgr/Promoter',
            'Life Guard',
            'Mgr - Fitness Club',
            'Other',
            'Park Ranger',
            'Receptionist/Sec',
            'Sales-Tkt/Mmbrshp',
            'SportsBrdcstr/Journ',
            'Trainer/Instructor',
            'Umpire/Referee',
          ];
        case 'Travel/Transportation/Warehousing':
          return [
            'Admin Assist',
            'Air Traffic Control',
            'Airport Ops Crew',
            'Bellhop/Porter',
            'Clerk',
            'Crane Loader/Oper',
            'Dispatcher',
            'Driver-Bus/Strcar',
            'Driver-Taxi/Limo',
            'Driver-Truck/Delvry',
            'Flight Attendant',
            'Forklift Operator',
            'Laborer',
            'Longshoreman',
            'Mate/Sailor',
            'Mgr Warehse/Dist',
            'Other',
            'Parking Lot Attend',
            'Pilot/Capt/Eng',
            'Railroad Worker',
            'Receptionist/Sec',
            'Shipping/RecClk',
            'Subway/LgtRail Oper',
            'Ticket Agent',
            'Transportation Spec',
          ];
        case 'Other':
          return ['Other'];
        case 'applicantOccupationClassCd':
          return [
            'Homemaker/Houseprsn',
            'Retired',
            'Disabled',
            'Unemployed',
            'Graduate Student',
            'High school',
            'Other',
            'Undergraduate',
            'Agr Inspect/Grader',
            'Arborist',
            'Clerk',
            'Equip. Operator',
            'Farm/Ranch Owner',
            'Farm/Ranch Worker',
            'Fisherman',
            'Florist',
            'Laborer/Worker',
            'Landscape/NursryWkr',
            'Landscaper',
            'Logger',
            'Millworker',
            'Other',
            'Ranger',
            'Supervisor',
            'Timber Grader/Scale',
            'Actor',
            'Admin Assist',
            'Announcer/Broadcstr',
            'Artist/Animator',
            'Author/Writer',
            'Choreography/Dancer',
            'Clerk',
            'Composer/Director',
            'Curator',
            'Designer',
            'Editor',
            'Journalist/Reporter',
            'Musician/Singer',
            'Other',
            'Printer',
            'Producer',
            'Production Crew',
            'Projectionist',
            'Receptionist/Sec',
            'Ticket Sales/Usher',
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst/Broker',
            'Bookkeeper',
            'Branch Manager',
            'Clerk',
            'Collections',
            'Consultant',
            'Controller',
            'CSR/Teller',
            'Director/Administr',
            'Executive',
            'Financial Advisor',
            'Investment Banker',
            'Investor',
            'Loan/EscrowProcess',
            'Mgr-Credit/Loan',
            'Mgr-Portfolio/Prod.',
            'Mgr-Property',
            'Other',
            'Realtor',
            'Receptionist/Sec',
            'SalesAgt/Represent.',
            'Trader,Finan Instru',
            'Underwriter',
            'Account Executive',
            'Admin Assist',
            'Buyer',
            'Clerk-Office',
            'Consultant',
            'CSR',
            'Director/Administr',
            'Executive',
            'H.R. Representative',
            'Marketing Researchr',
            'Messenger/Courier',
            'Mgr - District',
            'Mgr - Finance',
            'Mgr-Dept/Store',
            'Mgr-General Opers',
            'Mgr-H.R./PublicRel',
            'Mgr-Mkt/Sales',
            'Mgr/Supervisr-Offic',
            'Other',
            'Receptionist/Sec',
            'Sales-Counter/Rentl',
            'Sales-Home Based',
            'Sales-Mfg Rep',
            'Sales-Retail/Whlsle',
            'Sales-Route/Vendor',
            'Boiler Oper/Maker',
            'Bricklayer/Mason',
            'Carpenter',
            'Carpet Installer',
            'Concrete Worker',
            'Constrct Proj Mgr',
            'Contractor',
            'Crane Operator',
            'Electrician/Linesmn',
            'ElevatorTech/Instl',
            'Equip. Operator',
            'FloorLayer/Finisher',
            'Foreman/Supervisor',
            'Handyman',
            'Heat/Air Technician',
            'Inspector',
            'Laborer/Worker',
            'Metalworker',
            'Miner',
            'Oil/GasDril/RigOpr',
            'Other',
            'Painter',
            'Plstr/Drywall/Stuc',
            'Plumber',
            'Roofer',
            'Admin Assist',
            'Audio-Visual Tech.',
            'Child/DayCare Wrker',
            'Clerk',
            'Counselor',
            'Grad. Teaching/Asst',
            'Instructor-Vocation',
            'Librarian/Curator',
            'Other',
            'Professor, College',
            'Receptionist/Sec',
            'Superintendent',
            'Teacher, College',
            'Teacher, K-12',
            'Teaching Asst/Aide',
            'Tutor',
            'Actuary',
            'Admin Assist',
            'Analyst',
            'Architect',
            'Clerk',
            'Clinical Data Coord.',
            'Drafter',
            'Engineer',
            'Manager-Project',
            'Manager-R&D',
            'Mathematician',
            'Other',
            'Receptionist/Sec',
            'Research Prog. Dir.',
            'Researcher',
            'Scientist',
            'Sociologist',
            'Surveyor/Mapmaker',
            'Technician',
            'Accountant/Auditor',
            'Admin Assist',
            'Analyst',
            'Attorney',
            'Chief Executive',
            'Clerk',
            'Commissioner',
            'Council member',
            'Director/Administr',
            'Enlst Mil Prsnl E1-4',
            'Legislator',
            'Mayor/City Manager',
            'Meter Reader',
            'NCO (E5-9)',
            'Officer-Commissiond',
            'Officer-Warrant',
            'Other',
            'Park Ranger',
            'Planner',
            'Postmaster',
            'Receptionist/Sec',
            'Regulator',
            'US Postal Worker',
            'Admin Assist',
            'Analyst',
            'Clerk',
            'Director/Administr',
            'Engineer-Hardware',
            'Engineer-Software',
            'Engineer-Systems',
            'Executive',
            'Manager-Systems',
            'Network Admin',
            'Other',
            'Programmer',
            'Project Coordinator',
            'Receptionist/Sec',
            'Support Technician',
            'Systems Security',
            'Technical Writer',
            'Web Developer',
            'Accountant/Auditor',
            'Actuarial Clerk',
            'Actuary',
            'Admin Assist',
            'Agent/Broker',
            'Analyst',
            'Attorney',
            'Claims Adjuster',
            'Clerk',
            'Commissioner',
            'CSR',
            'Director/Administr',
            'Executive',
            'Other',
            'Product Manager',
            'Receptionist/Sec',
            'Sales Rep',
            'Underwriter',
            'Airport Sec Ofcr',
            'Animal Control Ofcr',
            'Attorney',
            'Bailiff',
            'Corrections Officer',
            'Court Clrk/Reporter',
            'Deputy Sheriff',
            'Dispatcher',
            'Examiner',
            'Fed Agt/Marshall',
            'Fire Chief',
            'Fire Fighter/Supv.',
            'Gaming Ofcr/Invest',
            'Highway Patrol Ofcr',
            'Judge/Hearing Ofcr',
            'Legal Asst./Sec',
            'Other',
            'Paralegal/Law Clerk',
            'Police Chief',
            'Police Det/Investgr',
            'Police Offcr/Supvr',
            'Process Server',
            'Prvt Invest/Detec.',
            'Security Guard',
            'Sheriff',
            'Bldg Maint Engineer',
            'Custodian/Janitor',
            'Electrician',
            'Field Service Tech.',
            'Handyman',
            'Heat/AirCond Repair',
            'Housekeeper/Maid',
            'Lndscpe/Grnds Maint',
            'Maint Mechanic',
            'Mechanic',
            'Other',
            'Admin Assist',
            'Clerk',
            'Factory Worker',
            'Foreman/Supervisor',
            'Furniture Finisher',
            'Inspector',
            'Jeweler',
            'Machine Operator',
            'Other',
            'Packer',
            'Plant Manager',
            'Printer/Bookbinder',
            'Quality Control',
            'Receptionist/Sec',
            'Refining Operator',
            'Shoemaker',
            'Tailor/Custom Sewer',
            'Textile Worker',
            'Upholsterer',
            'Admin Assist',
            'Assist-Med/Dent/Vet',
            'Clergy',
            'Clerk',
            'Client Care Worker',
            'Dental Hygenist',
            'Dentist',
            'Doctor',
            'Hospice Volunteer',
            'Mortician',
            'Nurse - C.N.A.',
            'Nurse - LPN',
            'Nurse - RN',
            'Nurse Practitioner',
            'Optometrist',
            'Other',
            'Paramedic/EM Tech',
            'Pharmacist',
            'Receptionist/Sec',
            'Social Worker',
            'Support Services',
            'Technician',
            'Therapist',
            'Veterinarian',
            'Caregiver',
            'Dry Cleaner/Laundry',
            'Hair Stylist/Barber',
            'Housekeeper',
            'Manicurist',
            'Masseuse',
            'Nanny',
            'Other',
            'Pet Services',
            'Receptionist/Sec',
            'Baker',
            'Bartender',
            'Bellhop',
            'Bus Person',
            'Caterer',
            'Chef',
            'Concessionaire',
            'Concierge',
            'Cook-Rest/Cafeteria',
            'Cook/Wrkr-Fast Food',
            'Delivery Person',
            'Desk Clerk',
            'Dishwasher',
            'Food Prod/Packing',
            'Host/Maitre d',
            'Housekeeper/Maid',
            'Manager',
            'Other',
            'Valet',
            'Waiter/Waitress',
            'Wine Steward',
            'Activity/Recre.Asst',
            'Admin Assist',
            'Agent',
            'Athlete',
            'CampCounselor/Lead',
            'Clerk',
            'Coach',
            'Concessionaire',
            'Director, Program',
            'Event Mgr/Promoter',
            'Life Guard',
            'Mgr - Fitness Club',
            'Other',
            'Park Ranger',
            'Receptionist/Sec',
            'Sales-Tkt/Mmbrshp',
            'SportsBrdcstr/Journ',
            'Trainer/Instructor',
            'Umpire/Referee',
            'Admin Assist',
            'Air Traffic Control',
            'Airport Ops Crew',
            'Bellhop/Porter',
            'Clerk',
            'Crane Loader/Oper',
            'Dispatcher',
            'Driver-Bus/Strcar',
            'Driver-Taxi/Limo',
            'Driver-Truck/Delvry',
            'Flight Attendant',
            'Forklift Operator',
            'Laborer',
            'Longshoreman',
            'Mate/Sailor',
            'Mgr Warehse/Dist',
            'Other',
            'Parking Lot Attend',
            'Pilot/Capt/Eng',
            'Railroad Worker',
            'Receptionist/Sec',
            'Shipping/RecClk',
            'Subway/LgtRail Oper',
            'Ticket Agent',
            'Transportation Spec',
            'Other',
          ];
        case 'spouseIndustry':
          return [
            'Homemaker/Houseprsn',
            'Retired',
            'Disabled',
            'Unemployed',
            'Student',
            'Agriclt/Forestry/Fish',
            'Art/Design/Media',
            'Banking/Finance/RE',
            'Business/Sales/Offi',
            'Construct/EnrgyTrds',
            'Education/Library',
            'Engr/Archt/Sci/Math',
            'Government/Military',
            'Info Tech',
            'Insurance',
            'Lgl/Law Enfcmt/Sec',
            'Maint/Rpr/Hsekeep',
            'Mfg/Production',
            'Med/Soc Svcs/Relig',
            'Person.Care/Service',
            'Sports/Recreation',
            'Other',
          ];
        case 'poolType':
          return [
            'Above Ground with Slide',
            'Above Ground without Slide',
            'In Ground with Slide',
            'In Ground without Slide',
          ];
        case 'homeFoundationType':
          return ['Slab', 'Crawlspace', 'PiersOrPile', 'SuspendedOverHillside'];
        case 'educationLevel':
          return [
            'No High School Diploma',
            'High School Diploma',
            'Some College - No Degree',
            'Vocational/Technical Degree',
            'Associates Degree',
            'Bachelors',
            'Masters',
            'Phd',
            'Medical Degree',
            'Law Degree',
          ];
        case 'lengthAtAddress':
          return [
            '6 months or less',
            '6-12 months',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            'More than 10',
          ];
        case 'bodilyInjuryCoverage':
          return [
            'State Minimum',
            '10/20',
            '12/25',
            '12.5/25',
            '15/30',
            '20/40',
            '20/50',
            '25/25',
            '25/50',
            '25/65',
            '30/60',
            '50/50',
            '50/100',
            '100/100',
            '100/300',
            '200/600',
            '250/500',
            '300/300',
            '500/500',
            '500/1000',
            '1000/1000',
            '35 CSL',
            '50 CSL',
            '55 CSL',
            '100 CSL',
            '115 CSL',
            '300 CSL',
            '500 CSL',
            '1000 CSL',
          ];
        case 'priorLiabilityLimit':
          return [
            'State Minimum',
            '10/20',
            '12/25',
            '15/30',
            '25/25',
            '25/50',
            '50/50',
            '50/100',
            '100/100',
            '100/300',
            '250/500',
            '300/300',
            '500/500',
            '1000/1000',
            '55CSL',
            '100CSL',
            '300CSL',
            '500CSL',
            'None',
          ];
        case 'homeownership':
          return [
            'Home (owned)',
            'Condo (owned)',
            'Apartment',
            'Rental Home/Condo',
            'Mobile Home',
            'Live With Parents',
            'Other',
          ];
        case 'roadsideCoverage':
          return [
            'No Coverage',
            '25',
            '40',
            '50',
            '75',
            '80',
            '100',
            '120',
            '200',
          ];
        case 'collision':
          return [
            '0',
            '50',
            '100',
            '200',
            '250',
            '300',
            '500',
            '750',
            '1000',
            '1500',
            '2000',
            '2500',
          ];
        case 'comprehensive':
          return [
            '0',
            '50',
            '100',
            '200',
            '250',
            '300',
            '500',
            '750',
            '1000',
            '1500',
            '2000',
            '2500',
          ];
        case 'rentalDeductible':
          return [
            'No Coverage',
            '15/450',
            '20/600',
            '25/750',
            '30/900',
            '35/1050',
            '40/1200',
            '45/1350',
            '50/1500',
            '75/2250',
            '100/3000',
          ];
        case 'roofType':
          return [
            'ARCHITECTURAL SHINGLES',
            'ASBESTOS',
            'ASPHALT SHINGLES',
            'COMPOSITION',
            'COPPER(FLAT)',
            'COPPER(PITCHED)',
            'CORRUGATED STEEL(FLAT)',
            'CORRUGATED STEEL(PITCHED)',
            'FIBERGLASS',
            'FOAM',
            'GRAVEL',
            'METAL(FLAT)',
            'METAL(PITCHED)',
            'MINERAL FIBER SHAKE',
            'OTHER',
            'PLASTIC(FLAT)',
            'PLASTIC(PITCHED)',
            'ROCK',
            'ROLLED PAPER(FLAT)',
            'ROLLED PAPER(PITCHED)',
            'RUBBER FLAT',
            'RUBBER(PITCHED)',
            'SLATE',
            'TAR',
            'TAR and GRAVEL',
            'TILE(CLAY)',
            'TILE(CONCRETE)',
            'TILE(SPANISH)',
            'TIN(FLAT)',
            'TIN(PITCHED)',
            'WOOD FIBERGLASS SHINGLES',
            'WOOD SHAKE',
            'WOOD SHINGLES',
          ];
        case 'structureType':
          return [
            'Apartment',
            'Backsplit',
            'Bi-Level',
            'Bi-Level/Row Center',
            'Bi-Level/Row End',
            'Bungalow',
            'Cape Cod',
            'Colonial',
            'Condo',
            'Coop',
            'Contemporary',
            'Cottage',
            'Dwelling',
            'Federal Colonial',
            'Mediterranean',
            'Ornate Victorian',
            'Queen Anne',
            'Raised Ranch',
            'Rambler',
            'Ranch',
            'Rowhouse',
            'Rowhouse Center',
            'Rowhouse End',
            'Southwest Adobe',
            'Split Foyer',
            'Split Level',
            'Substandard',
            'Townhouse',
            'Townhouse Center',
            'Townhouse End',
            'Tri-Level',
            'Tri-Level Center',
            'Victorian',
          ];
        case 'constructionType':
          return [
            'Adobe',
            'Aluminum/Vinyl',
            'Barn Plank',
            'Brick',
            'Brick on Block',
            'Brick on Block, Custom',
            'Brick Veneer',
            'Brick Veneer, Custom',
            'Cement Fiber Shingles',
            'Clapboard',
            'Concrete Decorative Block, Painted',
            'Exterior Insulation and Finish System (EIFS)',
            'Fire Resistant',
            'Frame',
            'Logs',
            'Poured Concrete',
            'Siding, Aluminum',
            'Siding, Hardboard',
            'Siding, Plywood',
            'Siding, Steel',
            'Siding, T-111',
            'Siding, Vinyl',
            'Siding, Wood',
            'Slump Block',
            'Solid Brick',
            'Solid Brick, Custom',
            'Solid Brownstone',
            'Solid Stone',
            'Solid Stone, Custom',
            'Stone on Block',
            'Stone on Block, Custom Stone',
            'Stone Veneer',
            'Stone Veneer, Custom',
            'Stucco',
            'Stucco on Block',
            'Stucco on Frame',
            'Victorian Scalloped Shakes',
            'Window Wall',
            'Wood Shakes',
          ];
        case 'residenceType':
          return ['One Family', 'Two Family', 'Three Family', 'Four Family'];
        case 'heatType':
          return [
            'Electric',
            'Gas',
            'Gas - Forced Air',
            'Gas - Hot Water',
            'Oil',
            'Oil - Forced Air',
            'Oil - Hot Water',
            'Other',
            'Solid Fuel',
          ];
        case 'foundationType':
          return [
            'Basement',
            'Closed',
            'Concrete Slab',
            'Concrete Stilts/Pilings',
            'Crawlspace',
            'Crawlspace/Foundations and Piers &gt; 6&apos; elevations',
            'Crawlspace/Enclosed Piers up to 6&apos; elevations',
            'Deep Pilings',
            'Elevated Post/Pier&amp;Beam',
            'Open',
            'Open-Enclosed with Lattice',
            'Open Foundations/Open Piers &gt; 6&apos; elevations',
            'Open Foundations/Open Piers up to 6&apos; elevations',
            'Pier&amp;Grade Beam',
            'Pilings-Other',
            'Pilings-Wood',
            'Pilings/Stilts of Reinforced Masonry Construction',
            'Shallow Basement',
            'Slab',
            'Stilts/Pilings 8&apos;-10&apos; elevations',
            'Stilts/Pilings other',
            'Stilts with Sweep Away Walls',
            'Wood Stilts/Pilings',
          ];
        case 'pipType':
          return [
            'No Coverage',
            '2500',
            '5000',
            '10000',
            '25000',
            '50000',
            '100000',
          ];
        case 'homePrimaryUse':
          return [
            'Primary',
            'Secondary',
            'Seasonal',
            'Farm',
            'Unoccupied',
            'Vacant',
            'COC',
          ];
        case 'vehiclePrimaryUse':
          return [
            'Business',
            'Farming',
            'Pleasure',
            'To/From Work',
            'To/From School',
          ];
        case 'constructionMethod':
          return ['Site Built', 'Modular', 'Manufactured/Mobile', 'Unknown'];
        case 'gender':
          return ['Male', 'Female', 'X - Not Specified'];
        case 'maritalStatus':
          return [
            'Single',
            'Married',
            'Domestic Partner',
            'Widowed',
            'Separated',
            'Divorced',
          ];
        case 'durationYears':
          return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
          ];
        case 'accidentDescription':
          return [
            'At Fault With Injury',
            'At Fault With No Injury',
            'Not At Fault',
          ];
        case 'violationDescription':
          return [
            'Careless Driving',
            'Cell Phone',
            'Child Safety Restraint',
            'Defective Equipment',
            'Divided Highways',
            'Double Lines',
            'Driving Left of Center',
            'Driving on Sus. License',
            'Driving too slow',
            'Driving without lights',
            'DUI',
            'Eluding Police',
            'Failure to Obey Signal',
            'Failure to Stop',
            'Failure to Yield',
            'Failure To Observe A Safety Zone',
            'Failure to show documents',
            'False Reporting',
            'Felony',
            'Following too Closely',
            'Homicide',
            'Illegal Turn',
            'Improper Parking',
            'Improper Passing',
            'Improper Loads',
            'Leaving scene of an Accident/Hit and Run',
            'Motorcycle Violation',
            'Other Major',
            'Other Minor',
            'Open Container',
            'Operating Vehicle without Permission',
            'Out of State',
            'Passing School Bus',
            'Racing/Drag Racing',
            'Recreational Vehicle',
            'Refusal to submit to chemical test',
            'Speeding 1-5',
            'Speeding 6-10',
            'Speeding 11-15',
            'Speeding 16-20',
            'Speeding 21+',
            'Speed over 100mph',
            'Speeding Violation-Major',
            'Speeding Violation-Minor',
            'Seat Belt',
            'Suspension',
            'Ticket Violation Not Listed',
            'Towing',
            'Transportation of Hazardous Materials',
            'Unsafe Operation of a Motor Vehicle',
            'Vehicle Theft',
            'Wrong Way/Wrong Lane',
          ];
        case 'damageClaimDescription':
          return [
            'FIRE',
            'HIT ANIMAL',
            'THEFT',
            'TOWING',
            'VANDALISM',
            'GLASS',
            'TORNADO/HURRICANE',
            'FLOOD',
            'WIND/HAIL',
            'ALL OTHER',
          ];
        case 'allPerilsDeductible':
          return [
            '100',
            '250',
            '500',
            '750',
            '1000',
            '2000',
            '2500',
            '4000',
            '5000',
          ];
        case 'theftDeductible':
          return [
            '100',
            '250',
            '500',
            '750',
            '1000',
            '2000',
            '2500',
            '4000',
            '5000',
          ];
        case 'windDeductible':
          return [
            '100',
            '250',
            '500',
            '750',
            '1000',
            '2000',
            '2500',
            '4000',
            '5000',
          ];
        case 'personalLiabilityCoverage':
          return [
            '25000',
            '50000',
            '100000',
            '200000',
            '300000',
            '400000',
            '500000',
          ];
        case 'medicalPaymentsCoverage':
          return ['1000', '2000', '3000', '4000', '5000'];
        case 'policyType':
          return ['HO3', 'HO4', 'HO5', 'HO6'];
        case 'increaseReplacementCostPercent':
          return ['25', '50', '100'];
        case 'waterBackupCoverage':
          return [
            '1000',
            '2000',
            '3000',
            '4000',
            '5000',
            '6000',
            '7000',
            '8000',
            '9000',
            '10000',
            '15000',
            '20000',
            '25000',
            '50000',
          ];
        case 'smokeDetectorType':
          return ['Local', 'Direct', 'Central'];
        case 'burglarAlarmType':
          return ['Local', 'Direct', 'Central'];
        case 'sprinklerSystemType':
          return ['Local', 'Direct', 'Central'];
        case 'fireSystemType':
          return ['Local', 'Direct', 'Central'];
        case 'extraTransportationCoverage':
          return [
            'No Coverage',
            '15/450',
            '20/600',
            '25/750',
            '30/900',
            '35/1050',
            '40/1200',
            '45/1350',
            '50/1500',
            '75/2250',
            '100/3000',
          ];
        case 'autoCoverageTerm':
          return ['6 Month', '12 Month'];
        case 'priorPolicyTerm':
          return ['6 Month', '12 Month'];
        case 'hasDaytimeLights':
          return ['Yes', 'No'];
        case 'hasAntiLockBrakes':
          return ['Yes', 'No'];
        case 'passiveRestraintsType':
          return [
            'None',
            'Automatic Seatbelts',
            'Airbag (Drvr Side)',
            'Auto Stbelts/Drvr Airbag',
            'Airbag Both Sides',
            'Auto Stbelts/Airbag Both',
          ];
        case 'antiTheftType':
          return [
            'None',
            'Active',
            'Alarm Only',
            'Passive',
            'Vehicle Recovery System',
            'Both Active and Passive',
            'VIN# Etching',
          ];
        case 'relationship':
          return [
            'Child',
            'Domestic Partner',
            'Employee',
            'Insured',
            'Other',
            'Parent',
            'Relative',
            'Spouse',
          ];
        case 'state':
          return [
            'AK',
            'AL',
            'AR',
            'AS',
            'AZ',
            'CA',
            'CO',
            'CT',
            'DC',
            'DE',
            'FL',
            'GA',
            'GU',
            'HI',
            'IA',
            'ID',
            'IL',
            'IN',
            'KS',
            'KY',
            'LA',
            'MA',
            'MD',
            'ME',
            'MI',
            'MN',
            'MO',
            'MS',
            'MT',
            'NC',
            'ND',
            'NE',
            'NH',
            'NJ',
            'NM',
            'NV',
            'NY',
            'OH',
            'OK',
            'OR',
            'PA',
            'PR',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VA',
            'VI',
            'VT',
            'WA',
            'WI',
            'WV',
            'WY',
          ];
        case 'driverLicenseStateCd':
          return [
            'AK',
            'AL',
            'AR',
            'AS',
            'AZ',
            'CA',
            'CO',
            'CT',
            'DC',
            'DE',
            'FL',
            'GA',
            'GU',
            'HI',
            'IA',
            'ID',
            'IL',
            'IN',
            'KS',
            'KY',
            'LA',
            'MA',
            'MD',
            'ME',
            'MI',
            'MN',
            'MO',
            'MS',
            'MT',
            'NC',
            'ND',
            'NE',
            'NH',
            'NJ',
            'NM',
            'NV',
            'NY',
            'OH',
            'OK',
            'OR',
            'PA',
            'PR',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VA',
            'VI',
            'VT',
            'WA',
            'WI',
            'WV',
            'WY',
          ];
        case 'yearsAtCurrentAddress':
          return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            'More than 15',
          ];
        case 'yearsAtPreviousAddress':
          return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            'More than 15',
          ];
        case 'monthsAtCurrentAddress':
          return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'monthsAtPreviousAddress':
          return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'yearsWithCarrier':
          return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            'More than 15',
          ];
        case 'priorInsuranceYears':
          return [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            'More than 15',
          ];
        case 'monthsWithCarrier':
          return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        case 'priorInsuranceMonths':
          return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getAl3CodeOptions(referenceId) {
    try {
      const query = `SELECT * FROM public.\"CodesAL3\" 
                             WHERE \"AL3ReferenceID\" = '${referenceId}' AND "\AL3IsAList"\ IS FALSE 
                             ORDER BY \"AL3CodeDescription\"`;

      const body = { sql: query };

      const requestUrl = `${al3Parser.xiloParserendpoint}/api/parser/query`;
      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-xilo-access-token': `${al3Parser.xiloParserAccessToken}`,
        },
      };

      const { data, status } = await axios.post(
        requestUrl,
        body,
        requestOptions
      );

      if (status !== 200) {
        return { status: false, error: data.error };
      }

      const returnedData = data.map((d) => {
        return { value: d.AL3CodeValue, label: d.AL3CodeDescription };
      });

      return { status: true, data: returnedData };
    } catch (error) {
      console.log(error);
      return { status: false, error: error };
    }
  }
}
