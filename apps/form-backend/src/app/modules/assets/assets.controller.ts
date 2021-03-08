import {
    Controller,
    Get,
    Res,
    HttpException,
    HttpStatus
} from '@nestjs/common';

import { Response } from 'express';
import { join } from 'path';

@Controller('assets')
export class AssetsController {
    constructor() { }
    @Get('/')
    get(@Res() res: Response) {
        try {
            return res.sendFile(join(__dirname, 'assets', 'xilo.js'));
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get('/v1')
    getV1(@Res() res: Response) {
        try {
            return res.sendFile(join(__dirname, 'assets', 'v1.xilo.js'));
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get('/forms')
    getForms(@Res() res: Response) {
        try {
            return res.sendFile(join(__dirname, 'assets', 'forms.js'));
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

}
