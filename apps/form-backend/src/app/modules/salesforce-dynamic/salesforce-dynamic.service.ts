import {
  Injectable,
  Inject,
  Scope,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import * as salesforceAuthHelper from './helper/v2-salesforce-auth.helper';
import * as salesforceHelper from './helper/v2-salesforce.helper';
import * as url from 'url';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class SalesforceDynamicService {
  constructor(@Inject(REQUEST) private request: Request) {
    this.initAuth();
  }
  async initAuth() {
    await salesforceAuthHelper.init();
  }
  async handleGetReq() {
    try {
      const queryObject = url.parse(this.request.url, true).query;
      const action = queryObject.action;
      if (action == 'getAllObjects') {
        salesforceHelper.getAllSobject(async function (result, err) {
          if (err) {
            throw new HttpException(
              'Error retrieving sf objects',
              HttpStatus.BAD_REQUEST
            );
          }
          return {
            title: 'Objects retrieved successfully',
            obj: result.sobjects,
          };
        });
      } else if (action == 'getAllFields') {
        const objName = queryObject.objName;
        salesforceHelper.describeSobJect(objName, function (result, err) {
          return {
            title: 'Fields retrieved successfully',
            obj: result,
          };
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAndUpdateRecords(data) {
    try {

        const keyMatches = { 
          companyId: 'XILO_ID__c',
          email: 'email__c',
          accoutName: 'Name',
          supportStage: 'Support_Stage__c',
          onboardingStage: 'Onboarding_Stages__c',
          onboardingDate: 'Onboard_Date__c',
          liveDate: 'Live_Date__c',
        };

        let query = 
            'SELECT Id, Name, XILO_ID__c, Form_Submissions__c, email__c, ' + 
            'Product_Logins__c, Support_Stage__c, Onboarding_Stages__c,' + 
            'Onboard_Date__c, Live_Date__c FROM Account WHERE';

        for (const key of ['email', 'accountName', 'companyId']) {
          if (data[key]) {
            const sfKey = keyMatches[key];
            query += ` ${sfKey} = '${data[key]}'`;
            break;
          }
        }
        
        const sfAccount = await this.querySObjects(query);
        console.log('---sfAccount', sfAccount)
        const oneAccount = sfAccount.records ? sfAccount.records[0] : null;
        if (!oneAccount) {
          return Promise.reject(new Error('No salesforce account found'));
        }


        for (const key in data) {
          if (data[key]) {
            const sfKey = keyMatches[key];
            oneAccount[sfKey] = data[key];
          }
        }

        return await this.updateSobj('Account', oneAccount);
    } catch(error) {
        console.log(error);
        return Promise.reject(new Error('Error querying salesforce'));
    }
  }
  async querySObjects(soql) {
    try {
      const auth = await salesforceAuthHelper.init();

      if (!auth['status']) {
        return { status: false, error: auth['error'] };
      }

      const conn = auth['conn'];
      const records = await salesforceHelper.query(conn, soql);
      
      console.log(records);

      return { status: true, records: records };

    } catch(error) {
      return { status: false, error: error };
    }
  }

  async updateSobj(objName, sobjs)  {
    try {
      
      const result = await salesforceHelper.update(conn, objName, sobjs);
      
      return { status: true, result: result };

    } catch(error) {
      return { status: false, error: error };
    }
  }

  async handlePostReq() {
    try {
      const jsonObj = this.request.body.updates;
      if (!jsonObj) {
        throw new HttpException(
          'Error updating records',
          HttpStatus.BAD_REQUEST
        );
      }
      let count = 0;

      const objFields = [];
      for (const obj in jsonObj) {
        const objData = jsonObj[obj];
        const objName = objData.ObjName;

        salesforceHelper.describeSobJect(objName, function (result, err) {
          const fieldsData = result.fields;
          objFields[result.objName] = [];
          for (const i in fieldsData) {
            objFields[result.objName].push(fieldsData[i].name);
          }

          count++;
          if (count == jsonObj.length) {
            return this.upsertRecords(jsonObj, objFields);
          }

          return {
            title: 'Records updated sucessfully',
          };
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async uploadFile(fileObj: any) {
    try {
      //   const fileObj = this.request.file;

      salesforceHelper.uploadFile(
        this.request.body.recordId,
        fileObj.originalname,
        fileObj.buffer.toString('base64'),
        function (result, err) {
          return {
            title: 'File uploaded in sf',
            success: true,
          };
        }
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  upsertRecords = async (jsonObj, objFields) => {
    let errorMessage = '';
    for (const obj in jsonObj) {
      const objData = jsonObj[obj];
      const objName = objData.ObjName;

      const searchFields = objData.SearchByField;
      const fieldNames = objFields[objName];

      let arrayContains: boolean = true;
      let errorField = '';
      for (const i in searchFields) {
        if (!fieldNames.includes(searchFields[i])) {
          errorField = searchFields[i];
          arrayContains = false;
          break;
        }
      }
      if (!arrayContains) {
        errorMessage +=
          ',error in ' +
          objName +
          ' searchField ' +
          errorField +
          " doesn't exists on object";
      } else {
        if (objData.record) {
          let query = 'select id from ' + objName + ' where ';
          for (const i in searchFields) {
            query +=
              searchFields[i] +
              " = '" +
              objData.record[searchFields[i]] +
              "' and ";
          }
          query = query.substring(0, query.length - 4);
          salesforceHelper.queryAndUpsert(query, objData.record, objName);
        }
      }
    }

    if (errorMessage.length > 0) {
      throw new HttpException(
        'Error upserting records',
        HttpStatus.BAD_REQUEST
      );
    } else {
      return {
        title: 'Record upserted',
        success: true,
      };
    }
  };
}
