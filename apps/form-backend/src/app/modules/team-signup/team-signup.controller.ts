import { Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { TeamSignupService } from './team-signup.service';
import { FormService } from '../form/form.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Request, Response } from 'express';

@Controller('team-signup')
export class TeamSignupController {
  constructor(
    private readonly teamsignupService: TeamSignupService,
    private readonly formService: FormService
  ) {}

  @Post('invite')
  @UseGuards(AuthGuard)
  async invite(@Req() req: Request, @Res() res: Response) {
    await this.teamsignupService.invite(req, res);
    return this.formService.duplicateForm();
  }

  @Post('resend-link-invitation')
  @UseGuards(AuthGuard)
  resendLinkInvitation() {
    return this.teamsignupService.resendLinkInvitation();
  }

  @Post('login-employee')
  loginAsEmployee() {
    return this.teamsignupService.loginAsEmployee();
  }

  @Get('validate-token')
  @UseGuards(AuthGuard)
  tokenValidation() {
    return this.teamsignupService.tokenValidation();
  }
}
