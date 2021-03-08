import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterDto, UpdateParameterDto } from './dto/parameter.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('parameter')
export class ParameterController {
    constructor(private readonly parameterService: ParameterService) {}

    /**
     * @returns list of parameters by company id
     */
    @Get('company')
    listByCompany(@Body() body: ParameterDto) {
        return this.parameterService.listByCompany(body.decodedUser)
    }

    /**
     * 
     * @param id : parameter id
     */
    @Get(':id')
    listOne(
        @Param('id') id: number,
        @Body() body: ParameterDto
    ) {
        return this.parameterService.listOne(id, body.decodedUser)
    }

    /**
     * 
     * @param id : parameter id
     * @param parameterDto : object which contains updated parameters
     */
    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param('id') id: number, @Body() parameterDto: UpdateParameterDto ) {
        return this.parameterService.update(id, parameterDto)
    }

    /**
     * 
     * @param parameterDto object which we need to store in parameter
     */
    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    create(@Body() parameterDto: ParameterDto) {
        return this.parameterService.create(parameterDto)
    }

    /**
     * 
     * @param id : parameter id
     * @returns message for success or error
     */
    @Delete(':id')
    deleteParameter(@Param('id') id: number) {
        return this.parameterService.deleteParameter(id)
    }

}
