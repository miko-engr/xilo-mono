import { TypeOrmModule } from '@nestjs/typeorm'
import { Locations } from '../modules/location/location.entity'
import { Parameters } from '../modules/parameter/Parameters.entity'
import { Answers } from '../entities/Answers'
import { Clients } from '../modules/client/client.entity'
import { Companies } from '../modules/company/company.entity'
import { DynamicRaters } from '../modules/dynamic-rater/dynamic-raters.entity'
import { Raters } from '../modules/rater/raters.entity'
import { Businesses } from '../modules/business/businesses.entity'
import { Documents } from '../entities/Documents'
import { Drivers } from '../modules/driver/drivers.entity'
import { Feedback } from '../entities/Feedback'
import { Flows } from '../modules/flow/flows.entity'
import { DynamicRateConditions } from '../modules/dynamic-rate-condition/dynamic-rate-condition.entity'
import { Rates } from '../modules/rate/Rates.entity'
import { Coverages } from '../modules/coverage/coverages.entity'
import { Forms } from '../modules/form/forms.entity'
import { Emails } from '../modules/email/emails.entity'
import { Agents } from '../modules/agent/agent.entity'
import { FormAnalytics } from '../modules/analyticsv2/FormAnalytics.entity'
import { Conditions } from '../modules/condition/conditions.entity'
import { DynamicCoverages } from '../modules/dynamic-coverage/dynamic-coverages.entity'
import { Notes } from '../modules/note/note.entity'
import { DynamicRates } from '../modules/dynamic-rate/dynamic-rates.entity'
import { Homes } from '../modules/home/homes.entity'
import { Crons } from '../modules/cron/crons.entity'
import { Incidents } from '../modules/incident/incidents.entity'
import { Integrations } from '../modules/integration/Integrations.entity'
import { LifecycleAnalytics } from '../modules/lifecycle-analytics/LifecycleAnalytics.entity'
import { TextMessages } from '../modules/text-messages/TextMessages.entity'
import { Vehicles } from '../entities/Vehicles'
import { Zapiersyncs } from '../modules/zapier/zapiersyncs.entity'
import { Questions } from '../entities/Questions'
import { Users } from '../modules/user/user.entity'
import { Pdfs } from '../modules/pdf/pdfs.entity'
import { Pages } from '../modules/page/page.entity'
import { Partners } from '../entities/Partners'
import { Policies } from '../entities/Policies'
import { Templates } from '../modules/template/template.entity'
import { Lifecycles } from '../modules/lifecycle/lifecycle.entity'
import { RecreationalVehicles } from '../modules/recreational-vehicle/recreational-vehicles.entity'
import { Tasks } from '../modules/task/tasks.entity'
import { DynamicParameters } from '../modules/dynamic-parameter/dynamic-parameters.entity'
import { AppImages } from '../modules/app-image/app-images.entity'
import { File } from '../modules/file/file.entity'

export const createDbConnection = () => {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'ec2-23-22-156-110.compute-1.amazonaws.com',
    port: 5432,
    username: 'mbqghbcqnwadgr',
    password:
      '99d8e45edcc7d60398358cab381012c7b6896f9149fdef1a84efd7bf781be0f6',
    database: 'dc93hgqeve30ed',
    ssl: true,
    synchronize: false,
    extra: { ssl: { rejectUnauthorized: false } },
    entities: [
      Locations,
      Parameters,
      Answers,
      Clients,
      Companies,
      DynamicRaters,
      Raters,
      Businesses,
      Documents,
      Drivers,
      Feedback,
      Flows,
      Coverages,
      Forms,
      Rates,
      Agents,
      Emails,
      Conditions,
      Crons,
      DynamicCoverages,
      DynamicParameters,
      DynamicRateConditions,
      DynamicRates,
      Flows,
      Homes,
      FormAnalytics,
      Incidents,
      Integrations,
      LifecycleAnalytics,
      Locations,
      Notes,
      Pages,
      Parameters,
      Pdfs,
      Users,
      Questions,
      Zapiersyncs,
      TextMessages,
      Vehicles,
      Partners,
      Policies,
      Tasks,
      Templates,
      Lifecycles,
      RecreationalVehicles,
      AppImages,
      File
    ]
  })
}
