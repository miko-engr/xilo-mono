import { Module } from '@nestjs/common';
import { IntegrationValidatorController } from './integration-validator.controller';
import { FormModule } from '../form/form.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    FormModule,
    ClientModule
  ],
  controllers: [IntegrationValidatorController],
})
export class IntegrationValidatorModule {}
