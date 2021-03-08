import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
