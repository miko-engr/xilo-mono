import { Injectable, HttpException, HttpStatus, Scope, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rates } from './Rates.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class RateService {
    constructor(
        @InjectRepository(Rates)
        private rateRepository: Repository<Rates>,
        @Inject(REQUEST) private request: Request
    ) { }

    async listByClient(companyId, clientId) {
        try {
            const rates = await this.rateRepository.find({
                where: {
                    companyRateId: companyId,
                    clientRateId: clientId,
                },
            });
            if (!rates) throw new HttpException('Error finding rates. No rates found', HttpStatus.BAD_REQUEST)
            return {
             title: 'Rates retrieved successfully',
             obj: rates
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listOne(id) {
        try {
            const decoded = this.request.body.decodedUser;
            const rate = await this.rateRepository.findOne({
                where: {
                    companyRateId: decoded.user.companyUserId,
                    id: id
                }
            })
            if (!rate) throw new HttpException('No rate found', HttpStatus.BAD_REQUEST)
            return {
                title: 'Rates retrieved successfully',
                obj: rate
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update(id, rateDto) {
        try {
            const decoded = this.request.body.decodedUser;
            const rate = await this.rateRepository.findOne({
                where: {
                    companyRateId: decoded.user.companyUserId,
                    id: id
                }
            })
            if (!rate) throw new HttpException('No rate found', HttpStatus.BAD_REQUEST)
            const updatedRate = await this.rateRepository.update(id, rateDto);
            return {
                title: 'Rate updated successfully',
                obj: updatedRate
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create(rateDto) {
        try {
            const rate = await this.rateRepository.insert(rateDto)
            return {
                title: 'Rate created successfully',
                obj: rate
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteRate(id) {
        try {
            const deletedRecord = await this.rateRepository.delete(id)
            if (deletedRecord.affected === 0) throw new HttpException('Rate not deleted!', HttpStatus.BAD_REQUEST);
            return { message: 'Rate deleted successfully' }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
