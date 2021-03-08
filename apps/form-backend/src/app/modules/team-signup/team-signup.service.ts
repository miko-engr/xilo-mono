import { Injectable, Scope, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from "typeorm";
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as request from 'request-promise';
import { Users } from '../user/user.entity';
import { Agents } from '../agent/agent.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { XILO_COMPANY_ID, DASHBOARD_URL } from '../../constants/appconstant';
import { emailRegEx, sendInvitationMail } from '../../helpers/email.helper';
import * as sfQueue from '../../queues/salesforce';
import { Companies } from '../company/company.entity';
import { Lifecycles } from '../lifecycle/lifecycle.entity';
import { Clients } from '../client/client.entity';

@Injectable({ scope: Scope.REQUEST })
export class TeamSignupService {
    constructor(
        @Inject(REQUEST) private request: Request,
        @InjectRepository(Users) private userRepository: Repository<Users>,
        @InjectRepository(Agents) private agentRepository: Repository<Agents>,
        @InjectRepository(Companies) private companyRepository: Repository<Companies>,
        @InjectRepository(Lifecycles) private lifecycleRepository: Repository<Lifecycles>,
        @InjectRepository(Clients) private clientRepository: Repository<Clients>
    ) {}

    async invite(req, res) {
        try {
            const isValidRecipientEmail = emailRegEx.test(String(req.body.username).toLowerCase());
            if (!isValidRecipientEmail)
                throw new HttpException('Email not valid!', HttpStatus.BAD_REQUEST);
            const eUser = await this.userRepository.findOne({ where: { username: req.body.username } });
            if (eUser) {
                throw new HttpException('Email not valid!', HttpStatus.BAD_REQUEST);
            }
            const analyticsConfig = { "clientAttributes": [{ "column": "gender", "type": "Bar", "title": "Gender" }, { "column": "city", "type": "PieChart", "title": "City" }, { "column": "birthDate", "type": "Bar", "title": "Age" }, { "column": "maritalStatus", "type": "Bar", "title": "Marital Status" }, { "column": "stateCd", "type": "Bar", "title": "State" }, { "column": "occupation", "type": "PieChart", "title": "Occupation" }], "companyAttributes": ["company", "agent"] };
            const companyObj = req.body.company;
            delete companyObj.id;
            companyObj.tags = ['Auto', 'Home', 'Home Bundle', 'Trucking'];
            companyObj.analyticsPreferences = analyticsConfig;
            companyObj.taskTypes = ['Call', 'Email', 'Follow-up', 'Text', 'Work', 'Other'];
            companyObj.createdAt = new Date()
            companyObj.updatedAt = new Date()
            companyObj['contractDetails'] = {
                customer: {
                    firstName: req.body.customerFirstName || '',
                    lastName: req.body.customerLastName || '',
                    fullName: req.body.customerFullName || '',
                    title : req.body.customerTitle || '',
                },
                address: {
                    street : req.body.streetNumber || '',
                    city : req.body.city || '',
                    state : req.body.state || '',
                    unitNumber : req.body.unitNumber || '',
                    zip : req.body.zip || ''
                },
                contactEmail : req.body.customerFullName || '',
                phone : req.body.phone || '',
                email: req.body.username || '',
                subscriptionFees : req.body.subscriptionFees || '',
                implementationFess : req.body.implementationFees || '',
                users : req.body.users || '',
                ppu : req.body.ppu || '',
                discount : req.body.discount || '',
                xiloRep: {
                    fullName : req.body.xiloRep || '',
                    title : req.body.xiloRepTitle || '',
                    email: req.body.xiloRepEmail,
                },
            }
            companyObj.payment = req.body.payment;
            const newCompany = await this.companyRepository.save(companyObj);
            const userObj = {
                username: (req.body.username).toLowerCase(),
                name: req.body.customerFullName || '',
                firstName: req.body.customerFirstName || '',
                lastName: req.body.customerLastName || '',
                companyUserId: newCompany['id'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const user = await this.userRepository.save(userObj);
            const newLifecycle = {
                isEnabled: true, isNewClient: true, name: 'New Client', color: '#ffde7c', sequenceNumber: 0, targetYear: 360, targetMonth: 30, targetDay: 1, targetWeek: 7, companyLifecycleId: user.companyUserId, createdAt: new Date(), updatedAt: new Date()
            };
            const quotedLifecycle = {
                isEnabled: true, isQuoted: true, name: 'Quoted', color: '#bfbbb3', sequenceNumber: 1, targetYear: 180, targetMonth: 15, targetDay: 1, targetWeek: 6, companyLifecycleId: user.companyUserId, createdAt: new Date(), updatedAt: new Date()
            };
            const soldLifecycle = {
                isEnabled: true, isSold: true, name: 'Sold', color: '#7fff3a', sequenceNumber: 2, targetYear: 36, targetMonth: 3, targetDay: 1, targetWeek: 1, companyLifecycleId: user.companyUserId, createdAt: new Date(), updatedAt: new Date()
            };
            const lifecycleArray = [newLifecycle, quotedLifecycle, soldLifecycle];
            const newAgent = {
                username: (req.body.username).toLowerCase(),
                name: req.body.customerFullName || '',
                firstName: req.body.customerFirstName || '',
                lastName: req.body.customerLastName || '',
                email: user.username,
                password: user.password,
                companyAgentId: user.companyUserId,
                isPrimaryAgent: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const token = await jwt.sign({ user: { id: user.id, username: user.username, companyUserId: user.companyUserId ,sendBy: 'employee'} }, 'secret', { expiresIn: '48h' });
            const invitedEmail = encodeURIComponent(this.request.body.username);
            const createPasswordLink = `${this.request.body.url}auth/signup-flow/create-password?email=${invitedEmail}&invited=true&token=${token}`;
            const userType = 'user'
            const emailInfo = {
                userType: userType,
                createPasswordLink: createPasswordLink,
                customerFullName: this.request.body.customerFullName
            }
            const subject = 'Account create invitation link';
            await sendInvitationMail(req.body.username, subject, emailInfo);
            const agent = await this.agentRepository.save(newAgent);
            const adminName = `admin${newCompany['id']}`;
            const adminPassword = `xilo${newCompany['id']}!123@`;
            await this.userRepository.save({ 
                username: adminName,
                firstName: 'Admin',
                lastName: newCompany['name'],
                password: bcrypt.hashSync(adminPassword, 10),
                companyUserId: newCompany['id'],
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const newClientLifecycle = await this.lifecycleRepository.save(newLifecycle)
            const newClient = {
                firstName: 'Test',
                lastName: 'User',
                phone: '111-111-1111',
                postalCd: '92101',
                email: 'support@xilo.io',
                clientLifecycleId: newClientLifecycle.id,
                clientAgentId: agent.id,
                companyClientId: newCompany['id'],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const client = await this.clientRepository.save(newClient);
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Lifecycles)
                .values(lifecycleArray)
                .execute();
            const decodedToken = await jwt.verify(token, 'secret');
            const jobData = {
                companyId: newCompany['id'],
                email: user.username,
                accountName: newCompany['name'],
                supportStage: 'Onboarding',
                onboardingStage: 'Signed Up',
                onboardingDate: new Date()
            };
            const job = await sfQueue.addJob('findAndUpdateRecord', jobData);
            decodedToken['companyId'] = newCompany['id']
            if (companyObj.contractDetails) {
                const contractDetails = companyObj.contractDetails;
                const addressObj = contractDetails.address;
    
                const contractData = {
                    "activatedDate": new Date(),
                    "address": `${addressObj.streetNumber} ${addressObj.street}`,
                    "city": `${addressObj.city}`,
                    "state": `${addressObj.state}`,
                    "zipCode": `${addressObj.zipCode}`,
                    "companySignedDate": new Date(),
                    "contractEndDate": new Date(),
                    "contractName": `Software Agreement with XILO and ${newCompany['name']}`,
                    "contractStartDate": new Date(),
                    "contractTerm": "12",
                    "customerSignedBy": `${contractDetails.email}`,
                    "customerSignedDate": new Date(),
                    "customerSignedTitle": "Owner",
                    "description": `${contractDetails.servicesDescription}`
                }
    
                const options = {
                    method: 'PUT',
                    url: 'https://hooks.zapier.com/hooks/catch/5376950/ofcw201/',
                    body: contractData,
                    json: true,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                };

                await request(options);
            }
            res.send({ title: 'Account created'})
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async resendLinkInvitation() {
        try {
            const { email } = this.request.body;
            const user = await this.userRepository.findOne({
                where: { username: email },
            });
            if (!user)
                throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST)

            const token = await jwt.sign({ user: { id: user.id, username: email, companyUserId: user.companyUserId ,sendBy: 'employee'} }, 'secret', { expiresIn: '48h' });
            const invitedEmail = encodeURIComponent(email);
            const createPasswordLink = `${DASHBOARD_URL}/auth/signup-flow/create-password?email=${invitedEmail}&invited=true&token=${token}`;
            const userType = 'user'
            const emailInfo = {
                userType: userType,
                createPasswordLink: createPasswordLink,
            }
            const subject = 'Account create invitation link';
            await sendInvitationMail(email, subject, emailInfo);
            return {
                message: 'Invitation link sent successfully!',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginAsEmployee() {
        try {
        const username = this.request.body.username ? this.request.body.username.toLowerCase() : '';
        const user = await this.userRepository.findOne({
            where: {
                username: username,
                companyUserId: XILO_COMPANY_ID,
            },
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    company: 'user.company'
                }
            }
        })
        if (!user)
            throw new HttpException('Incorrect Credentials', HttpStatus.BAD_REQUEST)

        if (!bcrypt.compareSync(this.request.body.password, user.password))
            throw new HttpException('Incorrect Credentials', HttpStatus.BAD_REQUEST)

        const token = await jwt.sign({ user: { id: user.id, username: user.username, companyUserId: user.companyUserId } }, 'secret', { expiresIn: 7200 });
        return {
            message: 'User Logged In Successfully',
            token,
            userType: 'xilo_employee',
        };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async tokenValidation() {
        try {
            const decoded = this.request.body.decodedUser;
            let response;
            if(decoded.user.userType === 'agent') {
                const agent = await this.agentRepository.findOne({ where: { id:decoded.user.id }});
                if (!agent) throw new HttpException('No agent found with this email', HttpStatus.BAD_REQUEST);
                response = {
                    title: 'Token validate sucessfully',
                    obj: this.request.body.decodedUser,
                };
            }
            const user = await this.userRepository.findOne({ where: { id: decoded.user.id } });
            if (!user)
                throw new HttpException('No user found with this email', HttpStatus.BAD_REQUEST);

            response = {
                title: 'Token validate sucessfully',
                obj: this.request.body.decodedUser,
            };
            return response;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
