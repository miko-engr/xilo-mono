import { Module } from '@nestjs/common';
import { TextMessagesService } from './text-messages.service';
import { TextMessagesController } from './text-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextMessages } from './TextMessages.entity';
import { FlowModule } from '../flow/flow.module';
import { Clients } from '../client/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextMessages, Clients]),
    FlowModule
  ],
  providers: [TextMessagesService],
  controllers: [TextMessagesController]
})
export class TextMessagesModule {}
