import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdfs } from './pdfs.entity';
import { Clients } from '../client/client.entity';
import { Forms } from '../form/forms.entity';
import { Companies } from '../company/company.entity';
import { Locations } from '../location/location.entity';
import { Vehicles } from '../../entities/Vehicles';
import { Policies } from '../../entities/Policies';
import { Businesses } from '../business/businesses.entity';
import { Drivers } from '../driver/drivers.entity';
import { Homes } from '../home/homes.entity';
import { Incidents } from '../incident/incidents.entity';
import { Pages } from '../page/page.entity';
import { Answers } from '../../entities/Answers';
import { Questions } from '../../entities/Questions';
import { RecreationalVehicles } from '../recreational-vehicle/recreational-vehicles.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pdfs,
      Clients,
      Forms,
      Companies,
      Locations,
      Vehicles,
      Policies,
      Drivers,
      Businesses,
      Incidents,
      Homes,
      Pages,
      Answers,
      Questions,
      RecreationalVehicles,
    ]),
  ],
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
