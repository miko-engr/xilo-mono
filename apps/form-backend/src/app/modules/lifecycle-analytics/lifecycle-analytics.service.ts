import { Injectable, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Companies } from '../company/company.entity';
import { LifecycleAnalytics } from './LifecycleAnalytics.entity';
import * as moment from 'moment';
import { LifecycleAnalyticsDto } from './dto/lifecycleAnalytics.dto'
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Request } from 'express';
@Injectable({ scope: Scope.REQUEST })
export class LifecycleAnalyticsService {
    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(Companies)
        private companyRepository: Repository<Companies>,
        @InjectRepository(LifecycleAnalytics)
        private lifecycleAnalyticsRepository: Repository<LifecycleAnalytics>,
        @InjectRepository(Lifecycles)
        private lifecyclesRepository: Repository<Lifecycles>
    ) { }


    async listById(lifecycleAnalyticsId) {
        try {
            const decoded = this.request.body.decodedUser;
            const id = decoded.agent ? decoded.agent.companyAgentId : decoded.user.companyUserId;

            const company = await this.companyRepository.findOne({ id: id });
            if (!company) throw new HttpException('Company not found', HttpStatus.BAD_REQUEST);

            const lifecycleAnalytic = await this.lifecycleAnalyticsRepository
                .findOne({ id: lifecycleAnalyticsId, companyLifecycleAnalyticId: company.id });
            if (!lifecycleAnalytic) throw new HttpException('Lifecycle analytics not found', HttpStatus.BAD_REQUEST)
            return lifecycleAnalytic;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByCompany() {
        try {
            const decoded = this.request.body.decodedUser;
            const today = new Date();
            const sevenMonthsAgo = new Date();
            sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.find({
                where: {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    date: Between(sevenMonthsAgo, today)
                },
                join: {
                    alias: "lifecycleanalytics",
                    leftJoinAndSelect: {
                        client: "lifecycleanalytics.clientLifecycleAnalytic",
                        lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle",
                    }
                },
                order: { date: "DESC" }
            });

            if (!lifecycleAnalytics || !lifecycleAnalytics[0])
                throw new HttpException('Error finding lifecycle analytics. No lifecycle analytics found', HttpStatus.BAD_REQUEST)

            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByCompanyPlatformManager(id) {
        try {
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.find({
                where: {
                    companyLifecycleAnalyticId: id,
                },
                join: {
                    alias: "lifecycleanalytics",
                    leftJoinAndSelect: {
                        client: "lifecycleanalytics.clientLifecycleAnalytic",
                        agent: "lifecycleanalytics.agentLifecycleAnalytic",
                        lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle",
                        company: "lifecycleanalytics.companies"
                    }
                },
            })
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByAgent(id) {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        agentLifecycleAnalyticId: id,
                        companyLifecycleAnalyticId: decoded.user.companyUserId
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByClient(id) {
        try {
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: id
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByMonth(month) {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: decoded.user.companyUserId,
                        month: month,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByDay(day) {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: decoded.user.companyUserId,
                        day: day,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByYear(year) {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: decoded.user.companyUserId,
                        year: year,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByLifecycle(id) {
        try {
            const decoded = this.request.body.decodedUser;
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: decoded.user.companyUserId,
                        lifecycleLifecycleAnalyticId: id,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleLifecycleAnalytic",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByMonthPlatformManager(id, month) {
        try {
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: id,
                        month: month,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByDayPlatformManager(id, day) {
        try {
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: id,
                        day: day,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByLifecycleAndDate(req, res) {
        try {
            const decoded = req.body.decodedUser;
            const whereClause = {};
            const includeClause = {
                client: "lifecycleanalytics.clientLifecycleAnalytic",
                agent: "lifecycleanalytics.agentLifecycleAnalytic",
            };
            if (req.params.lifecycle === 'new-client') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isNewClient: true};
            } else if (req.params.lifecycle === 'quoted') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isQuoted: true };
            } else if (req.params.lifecycle === 'sold') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isSold: true };
            }
            if (req.params.year && ((typeof req.params.month !== 'undefined') && req.params.month !== 'undefined')
                && ((typeof req.params.day !== 'undefined') && req.params.day != 'undefined')) {
                whereClause['companyLifecycleAnalyticId'] = decoded.user.companyUserId;
                whereClause['year'] = req.params.year
                whereClause['month'] = req.params.month
                whereClause['day'] = req.params.day
            } else if (((typeof req.params.day === 'undefined') || req.params.day === 'undefined') && req.params.month) {
                whereClause['companyLifecycleAnalyticId'] = decoded.user.companyUserId;
                whereClause['year'] = req.params.year
                whereClause['month'] = req.params.month;
            } else if (((typeof req.params.day === 'undefined') || req.params.day === 'undefined')
                && ((typeof req.params.month === 'undefined') || req.params.month === 'undefined')) {
                whereClause['companyLifecycleAnalyticId'] = decoded.user.companyUserId;
                whereClause['year'] = req.params.year
            }

            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.find({
                join: {
                    alias: "lifecycleanalytics",
                    leftJoinAndSelect: includeClause
                },
                where: whereClause,
            });
            res.send(lifecycleAnalytics);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByLifecycleDateRangeMedium(req, res) {
        try {
            const decoded = req.body.decodedUser;
            let whereClause = {};
            const includeClause = {};
            if (req.params.lifecycle === 'new-client') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isNewClient: true};
            } else if (req.params.lifecycle === 'quoted') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isQuoted: true};
            } else if (req.params.lifecycle === 'sold') {
                includeClause['lifecycle'] = 'lifecycleanalytics.lifecycleAnalyticLifecycle';
                whereClause['lifecycleAnalyticLifecycle'] = { isSold: true};
            }
            if (req.params.date === '30daysAgo') {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    date: MoreThan(moment().subtract(30, 'days').toDate()),
                }
            } else if (req.params.date === '7daysAgo') {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    date: MoreThan(moment().subtract(7, 'days').toDate()),
                }
            } else if (req.params.date === '24hoursAgo') {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    date: MoreThan(moment().subtract(1, 'days').toDate()),
                };
            }

            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.find({
                where: whereClause,
                join: {
                    alias: "lifecycleanalytics",
                    leftJoinAndSelect: includeClause
                },
            })
            res.send(lifecycleAnalytics)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByLifecycleDateMedium(req, res) {
        try {
            const decoded = req.body.decodedUser;
            let whereClause = {};
            const includeClause = {
                lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle"
            };
            if (req.params.lifecycle === 'new-client') {
                whereClause['lifecycleAnalyticLifecycle'] = { isNewClient: true};
            } else if (req.params.lifecycle === 'quoted') {
                whereClause['lifecycleAnalyticLifecycle'] = { isQuoted: true};
            } else if (req.params.lifecycle === 'sold') {
                whereClause['lifecycleAnalyticLifecycle'] = { isSold: true};
            }
            if (req.params.year && ((typeof req.params.month !== 'undefined') && req.params.month !== 'undefined')
                && ((typeof req.params.day !== 'undefined') && req.params.day != 'undefined')) {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    year: req.params.year,
                    month: req.params.month,
                    day: req.params.day,
                };
            } else if (((typeof req.params.day === 'undefined') || req.params.day === 'undefined') && req.params.month) {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    year: req.params.year,
                    month: req.params.month,
                };
            } else if (((typeof req.params.day === 'undefined') || req.params.day === 'undefined')
                && ((typeof req.params.month === 'undefined') || req.params.month === 'undefined')) {
                whereClause = {
                    companyLifecycleAnalyticId: decoded.user.companyUserId,
                    year: req.params.year,
                };
            }

            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.find({
                where: whereClause,
                join: {
                    alias: "lifecycleanalytics",
                    leftJoinAndSelect: includeClause
                },
            });
            res.send(lifecycleAnalytics);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async listByLifecyclePlatformManager(id, companyId) {
        try {
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository
                .find({
                    where: {
                        companyLifecycleAnalyticId: companyId,
                        lifecycleLifecycleAnalyticId: id,
                    },
                    join: {
                        alias: "lifecycleanalytics",
                        leftJoinAndSelect: {
                            client: "lifecycleanalytics.clientLifecycleAnalytic",
                            agent: "lifecycleanalytics.agentLifecycleAnalytic",
                            lifecycle: "lifecycleanalytics.lifecycleAnalyticLifecycle",
                        }
                    },
                });
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async create(lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
        try {
            this.request.body.agentLifecycleAnalyticId = this.request.body.agentLifecycleAnalyticId > 0 ? this.request.body.agentLifecycleAnalyticId : null
            const lifecycleAnalytic = await this.lifecycleAnalyticsRepository.create(lifecycleAnalyticsDto);

            if (!this.request.query.internal) return lifecycleAnalytic;
            return;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createNewClient(lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
        try {
            const newClientLifecycle = await this.lifecyclesRepository.findOne({
                where: {
                    companyLifecycleId: lifecycleAnalyticsDto.companyLifecycleAnalyticId,
                    isNewClient: true
                }
            });
            lifecycleAnalyticsDto.lifecycleLifecycleAnalyticId = newClientLifecycle.id;
            const lifecycleAnalytic = await this.lifecycleAnalyticsRepository.create(lifecycleAnalyticsDto);
            return lifecycleAnalytic;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async returnExists(value) {
        if (value && value != 'undefined' && value !== 'undefined' && value !== null) {
            return true;
        }
        return false;
    }

    async createLifecycleByMedium(lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
        try {
            const decoded = this.request.body.decodedUser;
            const tokenId = decoded.user ? decoded.user.companyUserId : decoded.client
                ? decoded.client.companyClientId : decoded.agent ? decoded.agent.companyAgentId : 0;

            const company = await this.companyRepository.findOne({ where: { id: tokenId } })
            if (!company) throw new HttpException('No company found', HttpStatus.INTERNAL_SERVER_ERROR);

            const lifecycleAnalyticsObj = {
                date: lifecycleAnalyticsDto.date,
                month: lifecycleAnalyticsDto.month,
                day: lifecycleAnalyticsDto.day,
                year: lifecycleAnalyticsDto.year,
                medium: this.returnExists(this.request.query.medName) ? this.request.query.medName as string : null,
                landingPage: this.returnExists(this.request.query.medName) ? this.request.query.medName as string : null,
                insuranceType: lifecycleAnalyticsDto.insuranceType,
                clientLifecycleAnalyticId: lifecycleAnalyticsDto.clientLifecycleAnalyticId,
                lifecycleLifecycleAnalyticId: lifecycleAnalyticsDto.lifecycleLifecycleAnalyticId,
                agentLifecycleAnalyticId: lifecycleAnalyticsDto.agentLifecycleAnalyticId > 0 ? lifecycleAnalyticsDto.agentLifecycleAnalyticId : null,
                companyLifecycleAnalyticId: company.id,
            }

            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.save(lifecycleAnalyticsObj)
            if (!lifecycleAnalytics) {
                throw new HttpException('Creating error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createLifecycleByMediumClient(lifecycleAnalyticsDto: LifecycleAnalyticsDto) {
        try {
            const company = await this.companyRepository.findOne({
                where: {
                    companyId: this.request.query.companyId
                }
            });

            if (!company) throw new HttpException('Error creating LA. No company found', HttpStatus.INTERNAL_SERVER_ERROR)

            const newLifecycleAnalyticsObj = {
                date: lifecycleAnalyticsDto.date,
                month: lifecycleAnalyticsDto.month,
                day: lifecycleAnalyticsDto.day,
                year: lifecycleAnalyticsDto.year,
                medium: this.returnExists(this.request.query.medName) ? this.request.query.medName as string : null,
                landingPage: this.returnExists(this.request.query.medName) ? this.request.query.medName as string : null,
                insuranceType: lifecycleAnalyticsDto.insuranceType,
                clientLifecycleAnalyticId: lifecycleAnalyticsDto.clientLifecycleAnalyticId,
                lifecycleLifecycleAnalyticId: lifecycleAnalyticsDto.lifecycleLifecycleAnalyticId,
                agentLifecycleAnalyticId: lifecycleAnalyticsDto.agentLifecycleAnalyticId,
                companyLifecycleAnalyticId: lifecycleAnalyticsDto.companyLifecycleAnalyticId,
            }
            const lifecycleAnalytics = await this.lifecycleAnalyticsRepository.save(newLifecycleAnalyticsObj);
            if (!lifecycleAnalytics) {
                throw new HttpException('Creating error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return lifecycleAnalytics;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
