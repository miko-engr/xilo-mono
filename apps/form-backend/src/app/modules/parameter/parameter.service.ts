import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parameters } from './Parameters.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ParameterService {
    constructor(
        @InjectRepository(Parameters)
        private parameterRepository: Repository<Parameters>,
    ) {}

    async listByCompany(decoded): Promise<Parameters[]> {
        try {
            const parameters = await this.parameterRepository.find({ 
                where: {
                    companyParameterId: decoded.user.companyUserId
                } 
            });
            if (!parameters) throw new HttpException('No parameters found', HttpStatus.BAD_REQUEST)
            return parameters;
        } catch (error) {
           throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

    async listOne(id, decoded) {
        try {
            const parameters = await this.parameterRepository.findOne({ 
                where: {
                    companyParameterId: decoded.user.companyUserId,
                    id: id,
                } 
            });
            if (!parameters) throw new HttpException('No parameters found', HttpStatus.BAD_REQUEST)
            return parameters;
        } catch (error) {
           throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id, parameterDto) {
        try {
            const parameter = await this.parameterRepository.findOne({
                where: {
                    companyParameterId: parameterDto.decodedUser.user.companyUserId,
                    id: id
                }
            })
            if (!parameter) throw new HttpException('No parameters found', HttpStatus.BAD_REQUEST)
            const updatedParameter = await this.parameterRepository.update(parameter.id, {
                    title: (parameterDto.title !== null && typeof parameterDto.title !== 'undefined') ? parameterDto.title : parameter.title,
                    isDriver: (parameterDto.isDriver !== null && typeof parameterDto.isDriver !== 'undefined') ? (parameterDto.isDriver === true) : parameter.isDriver,
                    isVehicle: (parameterDto.isVehicle !== null && typeof parameterDto.isVehicle !== 'undefined') ? (parameterDto.isVehicle === true) : parameter.isVehicle,
                    propertyKey: (parameterDto.propertyKey !== null && typeof parameterDto.propertyKey !== 'undefined') ? parameterDto.propertyKey : parameter.propertyKey,
                    conditionalValue: (parameterDto.conditionalValue !== null && typeof parameterDto.conditionalValue !== 'undefined') ? parameterDto.conditionalValue : parameter.conditionalValue,
                    percentChange: (parameterDto.percentChange !== null && typeof parameterDto.percentChange !== 'undefined') ? parameterDto.percentChange : parameter.percentChange,
                    answerParameterId: (parameterDto.answerParameterId !== null && typeof parameterDto.answerParameterId !== 'undefined') ? parameterDto.answerParameterId : parameter.answerParameterId,    
            })
            return updatedParameter;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST); 
        }
    }

    async create(parameterDto) {
        try {
            const parameter = await this.parameterRepository.save(parameterDto);
            return parameter;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteParameter(id) {
        try {
            const parameter = await this.parameterRepository.delete(id);
            if(parameter.affected === 0) 
                throw new HttpException('Parameter not deleted!', HttpStatus.BAD_REQUEST);
            return { message: 'Parameter deleted successfully' }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);            
        }
    }
}
