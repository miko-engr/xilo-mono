import { Controller, Post, Patch, UseGuards, Delete, Param, Get, Body } from '@nestjs/common';
import { TextMessagesService } from './text-messages.service';
import { AuthGuard } from '../../guards/auth.guard';
import { TextMessageDto } from './dto/text-messages.dto';

@Controller('text-messages')
export class TextMessagesController {
    constructor(private readonly textMessagesService: TextMessagesService) {}


    @Post('/')
    @UseGuards(AuthGuard)
    create(@Body() textMessageDto: TextMessageDto) {
        return this.textMessagesService.create(textMessageDto)
    }

    @Patch('edit/:id')
    @UseGuards(AuthGuard)
    update(
        @Param('id') id: number,
        @Body() textMessageDto: TextMessageDto) {
        return this.textMessagesService.update(id, textMessageDto)
    }

    @Delete('/:id')
    deleteMessages(@Param('id') id: number) {
        return this.textMessagesService.delete(id)
    }

    @Get('')
    @UseGuards(AuthGuard)
    listByCompany() {
        return this.textMessagesService.listByCompany()
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    listOneById(@Param('id') id: number) {
        return this.textMessagesService.listOneById(id)
    }

}
