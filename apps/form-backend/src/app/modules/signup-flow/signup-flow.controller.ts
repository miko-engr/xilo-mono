import { Controller, Post, Body } from '@nestjs/common';
import { SignupFlowService } from './signup-flow.service';
@Controller('signup-flow')
export class SignupFlowController {
  constructor(private readonly signupFlowService: SignupFlowService) {}
  @Post('create-password')
  createPassword(@Body() bodyObj: any) {
    return this.signupFlowService.createPassword(bodyObj);
  }
}
