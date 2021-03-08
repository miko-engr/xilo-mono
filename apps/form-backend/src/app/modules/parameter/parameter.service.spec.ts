import { Test, TestingModule } from '@nestjs/testing'
import { ParameterService } from './parameter.service'
import { ParameterController } from './parameter.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parameters } from './Parameters.entity';
import { HttpException } from '@nestjs/common';
import { createDbConnection } from '../../helpers/db.helper';
import { getConnection } from 'typeorm';

describe('ParameterService', () => {
  let parameterController;
  let parameterService: ParameterService
  let parameterId
  const bodyData = {
    title: 'parameter',
    isDriver: true,
    isVehicle: false,
    propertyKey: 'test',
    conditionalValue: 'test',
    percentChange: 5,
    createdAt: '2020-08-20T11:35:12.879Z',
    updatedAt: '2020-08-20T11:35:12.879Z',
    answerParameterId: null,
    companyParameterId: 1,
    decodedUser: {
      user: { id: 1, username: 'team@xilo.io', companyUserId: 1 },
      companyId: 1
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createDbConnection(),
        TypeOrmModule.forFeature([Parameters])
      ],
      controllers: [ParameterController],
      providers: [
        ParameterService,
        {
          provide: Parameters,
          useClass: Parameters
        },
      ],
    }).compile();
    parameterController = await module.resolve<ParameterController>(ParameterController);
    parameterService = await module.resolve<ParameterService>(ParameterService)
  })

  afterAll(async () => {
    getConnection().close()
  })

  it('should be defined', () => {
    expect(parameterController).toBeDefined()
    expect(parameterService).toBeDefined()
  })

  describe('create', () => {
    let response;
    it('should save parameter and return it', async () => {
      response = await parameterService.create(bodyData)
      parameterId = response.id
      expect(response.id).toBeDefined();
      expect(typeof response.id).toBe('number')
    });

    it('should throw error if body data is not passed', async () => {
      await expect(parameterService.create({})).rejects.toThrowError(HttpException)
    })
  })

  describe('update', () => {
    it('should update parameter', async () => {
      const cloneBodyData = Object.assign({}, bodyData)
      cloneBodyData['id'] = parameterId
      cloneBodyData.isDriver = true;
      const parameter = await parameterService.update(parameterId, cloneBodyData)
      expect(1).toEqual(parameter.affected);
    });

    it('should throw an error when id not passed for update parameter', async () => {
      const cloneBodyData = Object.assign({}, bodyData)
      cloneBodyData['id'] = parameterId
      cloneBodyData.isDriver = true;
      await expect(parameterService.update(null, cloneBodyData)).rejects.toThrowError(HttpException);
    });
  })

  describe('getParameterByCompany', () => {
    it(`should return the parameter's list`, async () => {
      const parameters = await parameterService.listByCompany(bodyData.decodedUser)
      expect(await parameterService.listByCompany(bodyData.decodedUser)).toHaveLength(parameters.length);
    });

    it('should throw error if company Id is not passed', async () => {
      await expect(parameterService.listByCompany({})).rejects.toThrowError(HttpException)
    })
  })
    
  describe('listOne', () => {
    it('should return parameter with id', async () => {
      const parameter = await parameterService.listOne(parameterId, bodyData.decodedUser)
      expect(bodyData.decodedUser.companyId).toEqual(parameter.companyParameterId);
    });

    it('should throw an error if parameter id not found', async () => {
      expect(parameterService.listOne(null, bodyData['decodedUser'])).rejects.toThrowError(HttpException);
    });
  })

  describe('delete', () => {
      it('should delete parameter', async () => {
        const parameter = await parameterService.deleteParameter(parameterId)
        expect(parameter).toEqual({ message: 'Parameter deleted successfully' });
      })

      it('should throw an error if called with an null parameter id', async () => {
        await expect(parameterService.deleteParameter(null)).rejects.toThrowError(HttpException) 
      })
  }) 
})
