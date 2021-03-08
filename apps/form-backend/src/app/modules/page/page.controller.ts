import {
    Get,
    Post,
    Patch,
    Delete,
    Controller,
    Param,
    Body,
    UseGuards
} from '@nestjs/common';
import { PageService } from './page.service';
import { PageDto } from './dto/page.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('page')
export class PageController {
    constructor(private readonly pageService: PageService) { }

    /**
     * @param {number} formId the FormpageId of Page
     * @returns pages based on companyPageId and FormpageId
     */
    @Get('/company/:formId')
    listByCompanyFormUser(@Param('formId') formId: number) {
        return this.pageService.listByCompanyFormUser(formId);
    }
    
    /**
     * @returns pages with Answers and Questions 
     */
    @Get('/templates/all/dashboard')
    listTemplates() {
        return this.pageService.listTemplates();
    }

    /**
     * @param {number} formId the FormpageId of Page
     * @param {number} pageId the Id of Page
     * @returns pages based on companyPageId, FormpageId, and pageId
     */
    @Get('/:formId/:pageId')
    listOne(@Param('formId') formId: number, @Param('pageId') pageId: number) {
        return this.pageService.listOne(formId, pageId);
    }

    /**
     * @param {number} formId the FormpageId of Page
     * @param {number} pageId the Id of Page
     * @returns updated Page
     */
    @Patch('/:formId/:pageId')
    update(@Param('formId') formId: number, @Param('pageId') pageId: number, @Body() pageBody: PageDto) {
        return this.pageService.update(formId, pageId, pageBody);
    }

    /**
     * @Body {PageDto} pageBody body of new page
     * @returns created Page
     */
    @Post('/')
    create(@Body() pageBody: PageDto) {
        return this.pageService.create(pageBody);
    }

    /**
     * @Body {PageDto} pageBody body of new page
     * @returns duplicate created Page
     */
    @Post('/duplicate')
    duplicate(@Body() pageBody: PageDto) {
        return this.pageService.duplicate(pageBody);
    }
    
    /**
     * @param {number} formId the FormpageId of Page
     * @param {number} pageId the Id of Page
     * @returns status of deleted Page
     */
    @Delete('/:formId/:pageId')
    delete(@Param('formId') formId: number, @Param('pageId') pageId: number) {
        return this.pageService.delete(formId, pageId);
    }
}