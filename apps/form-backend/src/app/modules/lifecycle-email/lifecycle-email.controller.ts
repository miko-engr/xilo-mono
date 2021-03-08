import { Controller, Post, Body, Param } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateEmailDto } from '../email/dto/create-email.dto';
import { PdfService } from '../pdf/pdf.service';

@Controller('lifecycle-email')
export class LifecycleEmailController {
    constructor(
    private readonly emailService: EmailService,
    private readonly pdfService: PdfService
    ) {}

    /**
     * @param createEmailDto : email object
     */
    @Post(':clientId/:companyId/:emailType/:agentId?')
    sendEmail(@Body() createEmailDto: CreateEmailDto) {
        return this.emailService.sendEmail(createEmailDto)
    }

    @Post('pdf/:clientId/:companyId/:emailType/:agentId?')
    async filledForm(@Body() createEmailDto: CreateEmailDto,  @Param('clientId') clientId: number) {
        const filledPDFInfo = await this.pdfService.filledForm();
        await this.pdfService.uploadPDFAWS(filledPDFInfo, clientId);
        return this.emailService.sendEmail(createEmailDto)
    }

}
