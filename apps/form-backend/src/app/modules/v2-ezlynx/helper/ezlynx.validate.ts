import Enjoi from 'enjoi';
import { V2EzlynxHelper } from '../helper/v2-ezlynx.helper';
import parser from 'xml2json';
import stringSimilarity from 'string-similarity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Clients } from '../../client/client.entity';
import { Homes } from '../../home/homes.entity';
import { Integrations } from '../../integration/Integrations.entity';

@Injectable()
export class EzlynxValidate {
  constructor(
    private ezHelper: V2EzlynxHelper,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Homes)
    private homesRepository: Repository<Homes>,
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>
  ) {}
  async validate(clientId, lob) {
    try {
      const schema = require(`../assets/schema/ez${lob.toLowerCase()}.json`);
      const jschema = Enjoi.schema(schema);
      const client = await this.clientsRepository.findOne({
        where: { id: clientId },
        relations: ['drivers', 'vehicles', 'business', , 'incidents'],
        order: { drivers: 'ASC', vehicles: 'ASC' },
      });
      const homes = await this.homesRepository.find({
        where: {
          clientHomeId: client.id,
          city: Not(IsNull()),
        },
        order: { createdAt: 'ASC' },
      });

      if (homes) {
        client.homes = homes;
      }

      const data = await this.ezHelper.returnData(client, lob);

      const xml = data.data;

      const json = JSON.parse(parser.toJson(xml));

      const lobUpper = lob.toUpperCase();

      const ezJson = json[`EZ${lobUpper}`];

      if (ezJson['xmlns']) {
        delete json[`EZ${lobUpper}`]['xmlns'];
      }

      if (ezJson && ezJson['Applicant'] && !ezJson['Applicant'].length) {
        json[`EZ${lobUpper}`]['Applicant'] = [
          json[`EZ${lobUpper}`]['Applicant'],
        ];
      }

      for (let app of json[`EZ${lobUpper}`]['Applicant']) {
        if (app['Address'] && !app['Address'].length) {
          app['Address'] = [app['Address']];
        }
      }

      if (lob === 'Auto') {
        const applicant = json[`EZAUTO`];
        if (
          applicant['Drivers'] &&
          applicant['Drivers']['Driver'] &&
          !applicant['Drivers']['Driver'].length
        ) {
          applicant['Drivers']['Driver'] = [applicant['Drivers']['Driver']];
        }
        if (
          applicant['Vehicles'] &&
          applicant['Vehicles']['Vehicle'] &&
          !applicant['Vehicles']['Vehicle'].length
        ) {
          applicant['Vehicles']['Vehicle'] = [applicant['Vehicles']['Vehicle']];
        }
        if (
          applicant['VehiclesUse'] &&
          applicant['VehiclesUse']['VehicleUse'] &&
          !applicant['VehiclesUse']['VehicleUse'].length
        ) {
          applicant['VehiclesUse']['VehicleUse'] = [
            applicant['VehiclesUse']['VehicleUse'],
          ];
        }
        if (
          applicant['VehicleAssignments'] &&
          applicant['VehicleAssignments']['VehicleAssignment']
        ) {
          if (!applicant['VehicleAssignments']['VehicleAssignment'].length) {
            applicant['VehicleAssignments']['VehicleAssignment'] = [
              applicant['VehicleAssignments']['VehicleAssignment'],
            ];
          }
          for (let vehAssign of applicant['VehicleAssignments'][
            'VehicleAssignment'
          ]) {
            if (
              vehAssign &&
              vehAssign['DriverAssignment'] &&
              !vehAssign['DriverAssignment'].length
            ) {
              vehAssign['DriverAssignment'] = [vehAssign['DriverAssignment']];
            }
          }
        }
        if (
          applicant['Coverages'] &&
          applicant['Coverages']['VehicleCoverage'] &&
          !applicant['Coverages']['VehicleCoverage'].length
        ) {
          applicant['Coverages']['VehicleCoverage'] = [
            applicant['Coverages']['VehicleCoverage'],
          ];
        }
      }

      // CO APPLICANT ADDRESS = EZHOME.Applicant[1].Address
      const validation = jschema.validate(json, { abortEarly: false });
      const integrations = await this.integrationsRepository
        .createQueryBuilder('integration')
        .where({ formIntegrationId: client.formClientId, vendorName: 'EZLYNX' })
        .leftJoinAndSelect('integration.answer', 'answer')
        .select([
          'id',
          'group',
          'element',
          'answer.id',
          'answer.placeholderText',
        ])
        .getMany();

      const newInts = integrations.map((int) => {
        const group =
          int.group === 'CoApplicant'
            ? 'Applicant[1]'
            : int.group === lob
            ? 'Address'
            : int.group;
        return {
          id: int.id,
          path: `EZ${lobUpper}.${group}.${int.element}`,
          text: int['answer'] ? int['answer'].placeholderText : 'Question',
          element: int.element,
        };
      });

      const possibleMatches = [];

      const errors = validation.error ? validation.error.details : [];

      function errorMessage(eM, text, context) {
        if (text === 'Question' && context.key) {
          text = context.key;
        }
        let message = `${text} is incorrect`;
        if (eM.includes('is required')) {
          message = `${text} is required`;
        } else if (eM.includes('must be a number')) {
          message = `${text} should be a number`;
        } else if (eM.includes('must be a string')) {
          message = `${text} should be a string`;
        } else if (eM.includes('must be one of')) {
          message = `${text} should be one of ${context['valids'].join(', ')}`;
        }
        return message;
      }

      for (let err of errors) {
        const context = err.context;
        if (context) {
          // Check for direct integration path
          const index = newInts.findIndex((int) => context.label === int.path);
          if (index > -1) {
            const int = newInts[index];
            const rating = stringSimilarity.compareTwoStrings(
              context.label,
              int.path
            );
            if (rating > 0.8) {
              const index = possibleMatches.findIndex(
                (item) => context.label === item.path
              );
              const errMess = errorMessage(err.message, int.text, context);
              if (index > -1) {
                possibleMatches[index].error = errMess;
                if (!possibleMatches[index].ids) {
                  possibleMatches[index].ids = [];
                }
                possibleMatches[index].ids.push(int.id);
              } else {
                possibleMatches.push({
                  ids: [int.id],
                  errorType: 'data',
                  path: int.path,
                  entered: context['value'],
                  expected: context['valids'],
                  error: errMess,
                });
              }
            } else if (
              !possibleMatches.some((item) => context.label === item.path)
            ) {
              const errMess = errorMessage(err.message, context.key, context);
              possibleMatches.push({
                ids: [],
                errorType: 'data',
                path: context.label,
                entered: context['value'],
                expected: context['valids'],
                error: errMess,
                fields: [context.key],
              });
            }
          } else {
            const keyText =
              err.message && err.message.includes('Applicant[1]')
                ? `Co-applicant ${context.key}`
                : context.key;
            let errMess = errorMessage(err.message, keyText, context);
            let expectedValues = context['valids'];
            let ids = [];
            let fields = [];
            if (!expectedValues) {
              const resp = await this.ezHelper.getFieldsMethod(
                lob,
                `${context.key}Type`
              );
              if (resp.status) {
                if (
                  resp.obj &&
                  resp.obj.type === 'object' &&
                  resp.obj.additionalProperties
                ) {
                  if (
                    resp.obj.properties[context.key] &&
                    resp.obj.properties[context.key]['$ref'].includes(
                      'definitions'
                    )
                  ) {
                    const list = resp.obj.properties[context.key]['$ref'].split(
                      '/'
                    );
                    const length = list.length;
                    const searchValue = list[length - 1];
                    const newType = await this.ezHelper.getFieldsMethod(
                      lob,
                      searchValue
                    );
                    const intIndex = newInts.findIndex(
                      (int) => int.element === searchValue
                    );
                    if (intIndex > -1) {
                      ids.push(newInts[intIndex].id);
                    }
                    if (newType.obj && newType.obj.enum) {
                      fields.push(searchValue);
                      expectedValues = newType.obj.enum;
                      errMess += `, should be one of ${expectedValues.join(
                        ', '
                      )}`;
                    } else if (newType.obj && newType.obj.type) {
                      fields.push(searchValue);
                      errMess += `, should contain the ${searchValue} ${newType.obj.type}`;
                    }
                  } else if (resp.obj.required) {
                    for (let item of resp.obj.required) {
                      const newType = await this.ezHelper.getFieldsMethod(
                        lob,
                        `${item}Type`
                      );
                      const intIndex = newInts.findIndex(
                        (int) => int.element === item
                      );
                      if (intIndex > -1) {
                        ids.push(newInts[intIndex].id);
                      }
                      if (newType.obj && newType.obj.enum) {
                        fields.push(item);
                        expectedValues = newType.obj.enum;
                        errMess += `, should contain ${item} which is one of ${expectedValues.join(
                          ', '
                        )}`;
                      } else if (newType.obj && newType.obj.type) {
                        fields.push(item);
                        errMess += `, should contain the ${item} ${newType.obj.type}`;
                      } else {
                        fields.push(item);
                        errMess += `, should contain ${item}`;
                      }
                    }
                  }
                }
              }
            }
            errMess += " and doesn't exist on form";
            possibleMatches.push({
              ids: ids,
              errorType: 'data',
              path: context.label,
              entered: context['value'],
              expected: expectedValues,
              error: errMess,
              fields: fields,
            });
          }
        }
      }

      return { status: true, data: possibleMatches };
    } catch (err) {
      return { status: false, error: err };
    }
  }
}
