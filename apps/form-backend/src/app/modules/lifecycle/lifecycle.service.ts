import { Injectable, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Lifecycles } from './lifecycle.entity';
import { LifecycleDto } from './dto/lifecycle.dto';

@Injectable({ scope: Scope.REQUEST })
export class LifecycleService {
    constructor(
        @InjectRepository(Lifecycles)
        private lifecycleRepository: Repository<Lifecycles>,
        @Inject(REQUEST) private request: Request
    ) { }

    async listCompaniesNewClientLifecycle(id: number) {
        try {
            const lifecycle = await this.lifecycleRepository.findOne({
                where: {
                    companyLifecycleId: id,
                    isNewClient: true,
                }
            });
            if (!lifecycle) {
                throw new HttpException('There was an error finding lifecycle', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycle retrieved successfully',
                obj: lifecycle,
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listCompaniesQuotedLifecycle(id: number) {
        try {
            const lifecycle = await this.lifecycleRepository.findOne({
                where: {
                    companyLifecycleId: id,
                    isQuoted: true,
                }
            });
            if (!lifecycle) {
                throw new HttpException('There was an error finding lifecycle', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycle retrieved successfully',
                obj: lifecycle
            };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listCompaniesSoldLifecycle(id: number) {
        try {
            const lifecycle = await this.lifecycleRepository.findOne({
                where: {
                    companyLifecycleId: id,
                    isQuoted: true,
                }
            });
            if (!lifecycle) {
                throw new HttpException('There was an error finding lifecycle', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycle retrieved successfully',
                obj: lifecycle,
            };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listOne(id: number) {
        try {
            const lifecycle = await this.lifecycleRepository.findOne(id);
            if (!lifecycle) {
                throw new HttpException('No lifecycle found', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycle retrieved successfully',
                obj: lifecycle,
            }
        } catch (error) {
            throw new HttpException('There was an error finding lifecycle', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async list() {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycle = await this.lifecycleRepository.find({
                where: { companyLifecycleId: decoded.user.companyUserId },
            });
            if (!lifecycle) {
                throw new HttpException('No lifecycle found', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycles retrieved successfully',
                obj: lifecycle,
            }
        } catch (error) {
            throw new HttpException('There was an error finding lifecycles', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async listByCompanyForAgent() {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycle = await this.lifecycleRepository.find({
                where: { companyLifecycleId: decoded.agent.companyAgentId },
            });
            if (!lifecycle) {
                throw new HttpException('No lifecycle found', HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'Agents retrieved successfully',
                obj: lifecycle,
            }
        } catch (error) {
            throw new HttpException('There was an error retrieving Agents', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async listByCompanyForUser() {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycle = await this.lifecycleRepository.find({
                where: { companyLifecycleId: decoded.user.companyUserId },
            });
            if (!lifecycle) {
                throw new HttpException('No lifecycle found', HttpStatus.BAD_REQUEST);
            }
            return {
                    message: 'Lifecycles retrieved successfully',
                    obj: lifecycle
                }
        } catch (error) {
            throw new HttpException('There was an error retrieving Lifecycles', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async listByCompany() {
        try {
            const companyId = this.request.body.decodedUser.companyId;
            const lifecycles = await this.lifecycleRepository.createQueryBuilder("lifecycles")
                .where({ companyLifecycleId: companyId })
                .orderBy('lifecycles.sequenceNumber', 'ASC')
                .getMany();

            if (!lifecycles) {
                throw new HttpException('Error finding lifecycles. None found', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return  {
                title: 'Lifecycles found',
                obj: lifecycles
            };
        } catch (error) {
            throw new HttpException('Error finding lifecycles. Method failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id: number) {
        try {
            let lifecycle = await this.lifecycleRepository.findOne(id);
            if (!lifecycle) {
                throw new HttpException('Error finding Lifecycle', HttpStatus.BAD_REQUEST);
            }
            lifecycle = Object.assign({}, lifecycle, {
                isEnabled: (this.request.body.isEnabled !== null && typeof this.request.body.isEnabled !== 'undefined') ? this.request.body.isEnabled : lifecycle.isEnabled,
                isNewClient: (this.request.body.isNewClient !== null && typeof this.request.body.isNewClient !== 'undefined') ? this.request.body.isNewClient : lifecycle.isNewClient,
                isQuoted: (this.request.body.isQuoted !== null && typeof this.request.body.isQuoted !== 'undefined') ? this.request.body.isQuoted : lifecycle.isQuoted,
                isSold: (this.request.body.isSold !== null && typeof this.request.body.isSold !== 'undefined') ? this.request.body.isSold : lifecycle.isSold,
                name: this.request.body.name ? this.request.body.name : lifecycle.name,
                color: this.request.body.color ? this.request.body.color : lifecycle.color,
                sequenceNumber: this.request.body.sequenceNumber ? this.request.body.sequenceNumber : lifecycle.sequenceNumber,
                targetYear: this.request.body.targetYear ? this.request.body.targetYear : lifecycle.targetYear,
                targetMonth: this.request.body.targetMonth ? this.request.body.targetMonth : lifecycle.targetMonth,
                targetWeek: this.request.body.targetWeek ? this.request.body.targetWeek : lifecycle.targetWeek,
                targetDay: this.request.body.targetDay ? this.request.body.targetDay : lifecycle.targetDay
            });
            const updatedLifecycle = await this.lifecycleRepository.save(lifecycle);

            if (!updatedLifecycle) {
                throw new HttpException('Error updating Lifecycle', HttpStatus.BAD_REQUEST);
            }
            return {
                title: 'Lifecycle updated successfully',
                obj: updatedLifecycle,
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }

    async create(lifecycleBody: LifecycleDto) {
        const lifecycle = await this.lifecycleRepository.save(lifecycleBody);
        if (!lifecycle)
            throw new HttpException('Error creating lifecycle', HttpStatus.BAD_REQUEST);

        return { 
            title: 'Lifecycle created successfully',
            obj: lifecycle 
        };
    }

    async deleteLifecycle(id: number) {
        try {
            const lifecycle = this.lifecycleRepository.findOne(id);
            if (!lifecycle)
                throw new HttpException('No lifecycle found', HttpStatus.BAD_REQUEST);
            const deleteLifecycle = await this.lifecycleRepository.delete(id);
            if (!deleteLifecycle)
                throw new HttpException('There was an error removing lifecycle', HttpStatus.BAD_REQUEST);
            return { message: 'lifecycle removed successfully' }
        } catch (error) {
            throw new HttpException('There was an error finding lifecycle', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
