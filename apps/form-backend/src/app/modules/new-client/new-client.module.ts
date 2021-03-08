import { Module } from '@nestjs/common';
import { NewClientController } from './new-client.controller';
import { BusinessModule } from '../business/business.module';
import { LocationModule } from '../location/location.module';
import { IncidentModule } from '../incident/incident.module';
import { RecreationalVehicleModule } from '../recreational-vehicle/recreational-vehicle.module';
import { AgentModule } from '../agent/agent.module';
import { ClientModule } from '../client/client.module';
import { DriverModule } from '../driver/driver.module';
import { HomeModule } from '../home/home.module';
import { FormModule } from '../form/form.module';
import { DynamicRateModule } from '../dynamic-rate/dynamic-rate.module';
import { DynamicCoverageModule } from '../dynamic-coverage/dynamic-coverage.module';
import { PageModule } from '../page/page.module';
import { PdfModule } from '../pdf/pdf.module';
import { CompanyModule } from '../company/company.module';
import { UsDotIntegrationModule } from '../us-dot-integration/us-dot-integration.module';
@Module({
  imports: [
    BusinessModule,
    LocationModule,
    IncidentModule,
    RecreationalVehicleModule,
    AgentModule,
    ClientModule,
    DriverModule,
    HomeModule,
    FormModule,
    DynamicRateModule,
    DynamicCoverageModule,
    PageModule,
    PdfModule,
    CompanyModule,
    UsDotIntegrationModule,
  ],
  controllers: [NewClientController],
})
export class NewClientModule {}
