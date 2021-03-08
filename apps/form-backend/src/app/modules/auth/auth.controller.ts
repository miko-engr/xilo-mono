import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { CreateAgentDto } from '../agent/dto/create-agent-dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() signupBody: any) {
    //  TODO should be replaced to User create DTO
    return this.authService.signup(signupBody);
  }
  @Post('signup/platform-manager')
  signupAsPlatformManager(@Body() platformBody: any) {
    //  TODO should be replaced to Platform create DTO
    return this.authService.signinAsPlatformManager(platformBody);
  }
  @Post('login-user')
  signinAsUser(@Body() userBody: any) {
    //  TODO should be replaced to User create DTO
    return this.authService.signinAsUser(userBody);
  }
  @Post('login-agent')
  signinAsAgent(@Body() agentBody: CreateAgentDto) {
    return this.authService.signinAsAgent(agentBody);
  }
  @Post('login/platform-manager')
  signinAsPlatformManager(@Body() platformBody: CreateAgentDto) {
    //  TODO should be replaced to Platform create DTO

    return this.authService.signinAsPlatformManager(platformBody);
  }
  @Post('reset-user')
  resetUser(@Body() username: string) {
    return this.authService.resetUser(username);
  }
  @Post('reset-agent')
  resetAgent(@Body() email: string) {
    return this.authService.resetAgent(email);
  }

  @Get('expire-check')
  expireCheck(@Req() req: Request) {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    //   TODO should be added jwt package
     jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return {
          status: false,
        };
      }
      return {
        status: true,
      };
    });
  }
}
