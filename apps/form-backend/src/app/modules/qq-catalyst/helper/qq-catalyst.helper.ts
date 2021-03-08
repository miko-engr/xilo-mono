/* eslint-disable no-shadow-restricted-names */
import { parseAddress } from '../../../helpers/address.helper';
import { REQUEST } from '@nestjs/core'
import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Integrations } from '../../integration/Integrations.entity';
import { Clients } from '../../client/client.entity';

@Injectable({ scope: Scope.REQUEST })
export class QqCatalystHelper {
    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(Integrations) private integrationsRepository: Repository<Integrations>,
        @InjectRepository(Clients) private clientsRepository: Repository<Clients>,
    ) { }

    async returnData(client, formName) {
        try {
            let integrations = null;
            if (client.formClientId > 0) {
                integrations = await this.integrationsRepository.find({
                    where: {
                        vendorName: 'QQ',
                        formIntegrationId: client.formClientId,
                        // xiloKey: { [Op.ne]: null },
                        // xiloObject: { [Op.ne]: null },
                    }
                });
            }
            if (!integrations || (integrations.length === 0)) {
                return await this.returnContact(client, formName);
            }

            const validations = [];
            const qqData = {
                CustomerNo: null,
                FirstName: null,
                LastName: null,
                Phone: null,
                Email: null,
                Line1: null,
                City: null,
                State: null,
                Zip: null,
                ContactType: 'P',
                ContactSubType: 'P',
                Status: 'A',
                Country: 'USA',
                LocationId: 1
            }
            const integrationsLength = integrations.length;
            const isXILOMultiple = ['drivers', 'vehicles', 'incidents', 'homes'];

            async function getAddress(address) {
                const parsedAddress = parseAddress(address);
                if (parsedAddress) {
                    function returnWithSpace(value) {
                        return (value && value !== '') ? ` ${value}` : '';
                    }
                    let addressObj = {};
                    addressObj['Line1'] = `${parsedAddress.number} ${parsedAddress.street}${returnWithSpace(parsedAddress.type)}`;
                    addressObj['City'] = parsedAddress.city;
                    addressObj['State'] = parsedAddress.state;
                    addressObj['Zip'] = parsedAddress.zip;
                    return addressObj;
                } else {
                    return {};
                }
            }

            async function getValue(key, object, index) {
                return isXILOMultiple.includes(object) ? (client[object][index] ? client[object][index][key] : null) :
                    object === 'client' ? client[key] : client[object][key];
            }

            async function calcValue(value, newValue, addedValue, operator) {
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
                return value;
            }

            async function isEmpty(value) {
                return (typeof value == 'undefined' || (!value && value !== 0) || value === null || value === '');
            }

            async function evalCondition(conditionKey, conditionObject, expectedValue, operator, index) {
                const conditionValue = await getValue(conditionKey, conditionObject, index);
                let evalResult = false;
                if (operator === '=') {
                    evalResult = (conditionValue === expectedValue);
                } else if (operator === '!=') {
                    evalResult = (conditionValue !== expectedValue);
                } else if (operator === '>') {
                    evalResult = (conditionValue > expectedValue);
                } else if (operator === '<') {
                    evalResult = (conditionValue < expectedValue);
                } else if (operator === '+') {
                    if (conditionValue) {
                        evalResult = conditionValue.includes(expectedValue);
                    } else {
                        evalResult = false;
                    }
                } else if (operator === '!+') {
                    if (conditionValue) {
                        evalResult = !conditionValue.includes(expectedValue);
                    } else {
                        evalResult = false;
                    }
                } else if (operator === '!') {
                    evalResult = await isEmpty(conditionValue);
                } else if (operator === '!!') {
                    evalResult = !(await isEmpty(conditionValue));
                }
                return evalResult;
            }

            async function transformValue(trans, value, index) {
                const newIndex = trans.index ? trans.index : index;
                const newValue = trans.newValue ? trans.newValue : trans.valueKey ?
                    await getValue(trans.valueKey, trans.valueObject, newIndex) : value;
                if (trans.method === 'change') {
                    if (trans.type === 'uppercase' && typeof value === 'string') {
                        value = value.toUpperCase();
                    } else if (trans.type === 'lowercase' && typeof value === 'string') {
                        value = value.toLowerCase();
                    } else if (trans.type === 'number' && !isNaN(value)) {
                        value = parseInt(value);
                    }
                } else if (trans.method === 'add') {
                    value = await calcValue(value, newValue, trans.addedValue, trans.operator);
                } else if (trans.method === 'addif') {
                    if (await evalCondition(trans.conditionKey, trans.conditionObject, trans.conditionValue, trans.conditionOperator, newIndex)) {
                        value = await calcValue(value, newValue, trans.addedValue, trans.operator);
                    }
                } else if (trans.method === 'set') {
                    value = newValue;
                } else if (trans.method === 'setif') {
                    if (await evalCondition(trans.conditionKey, trans.conditionObject, trans.conditionValue, trans.conditionOperator, newIndex)) {
                        value = newValue;
                    } else {
                        value = null;
                    }
                }
                return value;
            }

            async function updateValidations() {
                let newValidations = [];
                if (client.validations && client.validations.length && client.validations.length > 0) {
                    newValidations = client.validations.filter(val => !(val.vendorName === 'QQ' && val.lob === formName));
                }
                if (validations.length > 0) {
                    newValidations.push(...validations);
                }
                await this.clientsRepository.update(client.id, {
                    validations: newValidations
                });
                client.validations = newValidations;
            }

            async function setValue(int, index) {
                let value = await getValue(int.xiloKey, int.xiloObject, index);
                if (int.element === 'FullAddress') {
                    const addressObj = await getAddress(value);
                    for (let pKey in addressObj) {
                        qqData[pKey] = addressObj[pKey]
                    }
                } else {
                    if (int.transformation) {
                        value = await transformValue(int.transformation, value, index);
                    } else if (!value && (int.value || int.value === 0)) {
                        value = int.value;
                    }
                    if (!(await isEmpty(value))) {
                        qqData[int.element] = value;
                    }
                }
            }

            for (let i = 0; i < integrationsLength; i++) {
                const int = integrations[i];
                await setValue(int, 0);
            }

            for (let key in qqData) {
                if (key !== 'CustomerNo') {
                    if (!qqData[key]) {
                        const ints = integrations.filter(i => i.element === key);
                        const integrationIds = [];
                        const error = `${key} is missing from submission`;
                        const oneValidation = {
                            lob: formName, createdAt: (new Date()).getTime(), error: error, dataIn: qqData,
                            integrationIds: null, fieldDataIn: null, errorType: 'data', vendorName: 'QQ'
                        }
                        if (ints && ints.length && ints.length > 0) {
                            for (let int of ints) {
                                integrationIds.push(int.id);
                            }
                            oneValidation.integrationIds = integrationIds;
                        }
                        validations.push(oneValidation);
                    }
                }
            }

            if (client.qqContactId) 
                qqData.CustomerNo = client.qqContactId

            await updateValidations();
            return { status: true, data: qqData };
        } catch (error) {
            return { status: false, error: error };
        }
    }

    async returnContact(client, formName) {
        try {
            function returnValueIfExists(value) {
                if (value && value !== 'undefined' && typeof value !== 'undefined' && value !== null) {
                    if (value === 'true' || value === true) {
                        return 'Yes';
                    } if (value === false || value === 'false') {
                        return 'No';
                    }
                    return value;
                }
                if (value === false) {
                    return 'No';
                }
                return false;
            }
            function returnValue(value) {
                if (returnValueIfExists(value)) {
                    return value;
                }
                return false;
            }
            async function assignObject(object, key, value) {
                if (returnValue(value)) {
                    object[key] = returnValue(value)
                }
                return undefined;
            }
            async function returnAddress() {
                const addressType = client.city ? 'client' : (client.business && client.business.city) ? 'business' :
                    (client.homes && client.homes.length && client.homes.length > 0) ? 'home' : null;
                if (addressType) {
                    if (addressType === 'client') {
                        return { streetAddress: client.streetAddress, city: client.city, state: client.stateCd, zipCode: client.postalCd };
                    } else if (addressType === 'home') {
                        const home = client.homes[0];
                        return { streetAddress: home.streetAddress, city: home.city, state: home.state, zipCode: home.zipCode };
                    } else if (addressType === 'business') {
                        const business = client.business;
                        return { streetAddress: business.streetAddress, city: business.city, state: business.state, zipCode: business.zipCode };
                    }
                } else {
                    return null;
                }
            }

            const dataFile = {};
            // const insured = await self.returnInsured(client)
            const address = await returnAddress();

            if (!address) {
                const oneValidation = {
                    lob: formName, createdAt: (new Date()).getTime(), error: 'No address present in this submission',
                    integrationIds: null, fieldDataIn: null, errorType: 'data', vendorName: 'QQ'
                }
                await this.clientsRepository.update(client.id, {
                    validations: [oneValidation]
                });
                return { status: false, error: 'No address present on the lead' };
            }
            await assignObject(dataFile, 'CustomerNo', client.qqContactId);
            await assignObject(dataFile, 'FirstName', client.firstName);
            await assignObject(dataFile, 'LastName', client.lastName);
            await assignObject(dataFile, 'Phone', client.phone);
            await assignObject(dataFile, 'Email', client.email);
            await assignObject(dataFile, 'Line1', address.streetAddress);
            await assignObject(dataFile, 'City', address.city);
            await assignObject(dataFile, 'State', address.state);
            await assignObject(dataFile, 'Zip', address.zipCode);
            await assignObject(dataFile, 'ContactType', 'P');
            await assignObject(dataFile, 'ContactSubType', 'P');
            await assignObject(dataFile, 'Status', 'A');
            await assignObject(dataFile, 'Country', 'USA');
            await assignObject(dataFile, 'LocationID', 1);
            return { status: true, data: dataFile };
        } catch (error) {
            return { status: false, error: error };
        }
    }
}