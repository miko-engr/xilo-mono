import { Module } from '@nestjs/common';
import { TextCallbackController } from './text-callback.controller';
import { TextCallbackService } from './text-callback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([
    Clients,
    Companies
  ])
  ],
  controllers: [TextCallbackController],
  providers: [TextCallbackService],
  exports: [TextCallbackService]
})
export class TextCallbackModule {}
