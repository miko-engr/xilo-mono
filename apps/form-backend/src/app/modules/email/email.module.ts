import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emails } from './emails.entity';
import { Clients } from '../client/client.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Emails, Clients])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
