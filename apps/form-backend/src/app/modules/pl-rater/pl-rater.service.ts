import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Integrations } from '../integration/Integrations.entity';
import { Answers } from '../../entities/Answers';
import { PlRaterHelper } from './helper/pl-rater.helper';
import { al3Parser } from '../../constants/appconstant';
import axios from 'axios';
import * as path from 'path';
@Injectable()
export class PlRaterService {
  constructor(
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(Integrations)
    private integrationsRepository: Repository<Integrations>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
    private plHelper: PlRaterHelper
  ) {}
  async createAL3File(clientId: number, type: string) {
    try {
      // Retrieve client with all possible data objects ordered by creation date
      const client = await this.clientsRepository
        .createQueryBuilder('client')
        .where({ id: clientId })
        .leftJoinAndSelect('client.drivers', 'drivers')
        .leftJoinAndSelect('client.vehicles', 'vehicles')
        .leftJoinAndSelect('client.homes', 'homes')
        .leftJoinAndSelect('client.business', 'business')
        .leftJoinAndSelect('client.company', 'company')
        .orderBy('drivers.createdAt', 'ASC')
        .addOrderBy('vehicles.createdAt', 'ASC')
        .getOne();

      // Reject if no client found
      if (!client) {
        throw new HttpException(
          'Error creating PL Rater. No client found',
          HttpStatus.BAD_REQUEST
        );
      }

      const plObj = await this.plHelper.returnData(client, type);

      // Reject if returnData method failed
      if (!plObj.status) {
        throw new HttpException(
          'Error creating PL Rater. Error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!plObj.data) {
        throw new HttpException(
          'Error preparing records. Error parsing client',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message: 'PL Rater file created successfully',
        obj: plObj.data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAL3Groups(pType: string) {
    try {
      const type =
        pType === 'Auto' ? 'AUTOP' : pType === 'Home' ? 'HOMEP' : pType;

      const query = `SELECT public.\"Groups\".\"GroupName\", public.\"Groups\".\"Level\", public.\"Groups\".\"ParentGroup\", 
                     public.\"Groups\".\"ParentLevel\", public.\"Groups\".\"Iterative\", public.\"Groups\".\"Required\", public.\"Groups\".\"AL3Group\",
                     public.\"Groups\".\"GroupLength\", public.\"Groups\".\"Sequence\", public.\"Groups\".\"HomeSequence\", \"GroupElement\", \"Description\",  \"ReferenceID\",
                     \"Start\", \"Class\", \"DataType\", \"AL3Length\", public.\"Groups\".\"isChild\"  FROM public.\"Elements\" as E INNER JOIN public.\"Groups\" 
                     ON E.\"AL3Group\" = public.\"Groups\".\"AL3Group\" WHERE E.\"LOB\" @> ARRAY['${type}']::varchar[] ORDER BY 
                     \"GroupName\" ASC, \"Description\" ASC`;

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
        throw new HttpException(
          'Error retrieving groups',
          HttpStatus.BAD_REQUEST
        );
      }

      const groupedData = [];

      for (let d of data) {
        if (d.GroupName && !groupedData.some((gD) => gD.type === d.GroupName)) {
          groupedData.push({
            type: d.GroupName,
            keys: [
              {
                key: d.GroupElement,
                label: d.Description,
                processLevel: d.Level,
                sequence: pType === 'Auto' ? d.Sequence : d.HomeSequence,
                lob: type,
                parentGroup: d.ParentGroup,
                required: d.Required,
                al3Length: d.AL3Length,
                al3GroupLength: d.GroupLength,
                parentProcessLevel: d.ParentLevel,
                iterative: d.Iterative,
                isChild: d.isChild,
                al3Start: d.Start,
                classType: d.Class,
                dataType: d.DataType,
                group: d.AL3Group,
                referenceId: d.ReferenceID,
              },
            ],
          });
        } else {
          const index = groupedData.findIndex((gd) => gd.type === d.GroupName);
          if (index > -1) {
            groupedData[index].keys.push({
              key: d.GroupElement,
              label: d.Description,
              processLevel: d.Level,
              sequence: d.Sequence,
              lob: type,
              required: d.Required,
              al3Length: d.AL3Length,
              al3GroupLength: d.GroupLength,
              parentProcessLevel: d.ParentLevel,
              parentGroup: d.ParentGroup,
              iterative: d.Iterative,
              al3Start: d.Start,
              isChild: d.isChild,
              classType: d.Class,
              dataType: d.DataType,
              group: d.AL3Group,
              referenceId: d.ReferenceID,
            });
          }
        }
      }

      return {
        message: 'Groups has been successfully retrieved',
        obj: groupedData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAL3Elements(group: string) {
    try {
      const query = `SELECT \\"Element\\", \\"LOB\\" FROM public.\\"Elements\\" WHERE \"Group\" = '${group}'`;
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
        throw new HttpException(
          'Error retrieving groups',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message: 'Elements has been successfully retrieved',
        obj: data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async setDefaults(formId: number, type: string) {
    try {
      const plSchema = require(path.join(
        __dirname,
        `../assets/schema/pl-${type}.js`
      ));
      const answers = await this.answersRepository.find({
        where: { formAnswerId: formId },
        select: ['id', 'propertyKey', 'objectName', 'formAnswer'],
      });

      const lob = type === 'auto' ? 'AUTOP' : 'HOMEP';

      const integrations = await this.integrationsRepository.find({
        where: { formIntegrationId: formId, lob: lob },
      });

      if (!answers) {
        throw new HttpException(
          'Error. No answers found',
          HttpStatus.BAD_REQUEST
        );
      }

      function isDuplicate(eInt, int) {
        return (
          eInt.vendorName === int.vendorName &&
          eInt.parentGroup === int.parentGroup &&
          eInt.group === int.group &&
          eInt.element === int.element &&
          eInt.xiloObject === int.xiloObject &&
          eInt.xiloKey === int.xiloKey &&
          JSON.stringify(eInt.transformation) ===
            JSON.stringify(int.transformation)
        );
      }

      let created = 0;

      for (let int of plSchema) {
        const existingInt = integrations.some((eInt) => isDuplicate(eInt, int));
        if (!existingInt) {
          const answerIndex = answers.findIndex(
            (ans) =>
              ans.propertyKey === int.xiloKey &&
              ans.objectName === int.xiloObject
          );
          if (answerIndex > -1) {
            const answer = answers[answerIndex];
            delete int.id;
            int.answerIntegrationId = answer.id;
            int.formIntegrationId = answer.formAnswerId;
            await this.integrationsRepository.save(int);
            created += 1;
          }
        }
      }

      return {
        title: 'Forms defaulted to PL Rater successfully',
        count: created,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
