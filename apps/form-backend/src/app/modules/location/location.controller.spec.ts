import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clients } from '../client/client.entity'
import { Locations } from '../location/location.entity'
import { LocationService } from './location.service'
import { LocationController } from './location.controller'
import { HttpException } from '@nestjs/common'
import { createDbConnection } from '../../helpers/db.helper'
import { getConnection } from 'typeorm'

describe('LocationService', () => {
  let service
  let locationId
  const bodyData = {
    createdAt: '2016-06-22 19:10:25-07',
    updatedAt: '2016-06-22 19:10:25-07',
    streetNumber: '9697',
    streetAddress: '969 Market Street',
    city:  'San Diego',
    county: 'San Diego County',
    state: 'CA',
    zipCode:  '969 Market Street, San Diego, CA, 92101 ',
    companyLocationId: 1,
    coverageAmount: '500',
    decodedUser: {
      user: { id: 1, username: 'team@xilo.io', companyUserId: 1 },
      companyId: 1
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createDbConnection(),
        TypeOrmModule.forFeature([Locations, Clients])
      ],
      controllers: [LocationController],
      providers: [
        LocationService,
        { 
          provide: Locations,
          useClass: Locations
        }
      ],
    }).compile()
    service = await module.resolve<LocationService>(LocationService)
  })

  afterAll(async () => {
    getConnection().close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should return location data along with location Id', async () => {
      const response = await service.create(bodyData)
      locationId = response.id
      expect(response.id).toBeDefined()
      expect(response.companyLocationId).toEqual(1)
    })

    it('should throw error if body data is not passed', async () => {
      await expect(service.create({})).rejects.toThrowError(HttpException)
    })
  })

  describe('getLocationByCompanyId', () => {
    it('should return location by company Id', async () => {
      const response = await service.getLocationByCompanyId(bodyData)
      expect(response.companyLocationId).toEqual(bodyData.decodedUser.user.companyUserId)
    })

    it('should throw error if company Id is not passed', async () => {
      await expect(service.getLocationByCompanyId({})).rejects.toThrowError(HttpException)
    })
  })

  describe('findOne', () => {
    it('should return location by company Id', async () => {
      const response = await service.findOne(locationId)
      expect(response.id).toEqual(locationId)
    })

    it('should throw error if parameter id is not passed', async () => {
      await expect(service.findOne(null)).rejects.toThrowError(HttpException)
    })
  })

  describe('update', () => {
    it('should return updated location data', async () => {
      const cloneBodyData = Object.assign({}, bodyData)
      cloneBodyData['id'] = locationId
      cloneBodyData['streetNumber'] = '3000'
      const response = await service.update(cloneBodyData)
      expect(response.streetNumber).toEqual('3000')
    })

    it('should throw error if id is not passed with body data', async () => {
      await expect(service.update(null)).rejects.toThrowError(HttpException)
    })
  })

  describe('delete', () => {
    it('should return the success delete message ', async () => {
      const response = await service.delete(locationId)
      expect(response.message).toEqual('Location deleted successfully')
    })

    it('should throw error if id is passed with a null value', async () => {
      await expect(service.delete(null)).rejects.toThrowError(HttpException)
    })
  })
})
