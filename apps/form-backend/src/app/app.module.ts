import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { LocationModule } from './modules/location/location.module';
import { AgencyMatrixModule } from './modules/agency-matrix/agency-matrix.module';
import { AgencySoftwareModule } from './modules/agency-software/agency-software.module';
import { CommonModule, MetricsModule } from '@xilo-mono/backend-core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModule } from './modules/agent/agent.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { Analyticsv2Module } from './modules/analyticsv2/analyticsv2.module';
import { Ams360Module } from './modules/ams360/ams360.module';
import { DynamicCoverageModule } from './modules/dynamic-coverage/dynamic-coverage.module';
import { DynamicParameterModule } from './modules/dynamic-parameter/dynamic-parameter.module';
import { AppliedModule } from './modules/applied/applied.module';
import { AppliedEpicModule } from './modules/applied-epic/applied-epic.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConditionModule } from './modules/condition/condition.module';
import { CoverageModule } from './modules/coverage/coverage.module';
import { ClientModule } from './modules/client/client.module';
import { CronModule } from './modules/cron/cron.module';
import { AssetsModule } from './modules/assets/assets.module';
import { DocuSignModule } from './modules/docu-sign/docu-sign.module';
import { EmailModule } from './modules/email/email.module';
import { DynamicRateModule } from './modules/dynamic-rate/dynamic-rate.module';
import { DynamicRaterModule } from './modules/dynamic-rater/dynamic-rater.module';
import { EzlynxModule } from './modules/ezlynx/ezlynx.module';
import { EstatedModule } from './modules/estated/estated.module';
import { FileModule } from './modules/file/file.module';
import { FormModule } from './modules/form/form.module';
import { GoogleModule } from './modules/google/google.module';
import { DynamicRateConditionModule } from './modules/dynamic-rate-condition/dynamic-rate-condition.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { NoteModule } from './modules/note/note.module';
import { HawksoftModule } from './modules/hawksoft/hawksoft.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { PipedriveModule } from './modules/pipedrive/pipedrive.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LifecycleAnalyticsModule } from './modules/lifecycle-analytics/lifecycle-analytics.module';
import { PlRaterModule } from './modules/pl-rater/pl-rater.module';
import { IntegrationValidatorModule } from './modules/integration-validator/integration-validator.module';
import { RaterModule } from './modules/rater/rater.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { SignupFlowModule } from './modules/signup-flow/signup-flow.module';
import { LifecycleEmailModule } from './modules/lifecycle-email/lifecycle-email.module';
import { ParameterModule } from './modules/parameter/parameter.module';
import { UploadModule } from './modules/upload/upload.module';
import { RateModule } from './modules/rate/rate.module';
import { TeamSignupModule } from './modules/team-signup/team-signup.module';
import { QuoteRushModule } from './modules/quote-rush/quote-rush.module';
import { ZillowModule } from './modules/zillow/zillow.module';
import { V2IntegrationModule } from './modules/v2-integration/v2-integration.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { AppImageModule } from './modules/app-image/app-image.module';
import { Answers } from './entities/Answers';
import { Businesses } from './modules/business/businesses.entity';
import { Documents } from './entities/Documents';
import { Drivers } from './modules/driver/drivers.entity';
import { Feedback } from './entities/Feedback';
import { Flows } from './modules/flow/flows.entity';
import { Partners } from './entities/Partners';
import { Policies } from './entities/Policies';
import { Questions } from './entities/Questions';
import { RecreationalVehicles } from './modules/recreational-vehicle/recreational-vehicles.entity';
import { Tasks } from './modules/task/tasks.entity';
import { Templates } from './modules/template/template.entity';
import { Vehicles } from './entities/Vehicles';
import { NewClientModule } from './modules/new-client/new-client.module';
import { V2EzlynxModule } from './modules/v2-ezlynx/v2-ezlynx.module';
import { LifecycleModule } from './modules/lifecycle/lifecycle.module';
import { TriggerModule } from './modules/trigger/trigger.module';
import { PageModule } from './modules/page/page.module';
import { BusinessModule } from './modules/business/business.module';
import { DriverModule } from './modules/driver/driver.module';
import { FlowModule } from './modules/flow/flow.module';
import { HomeModule } from './modules/home/home.module';
import { RecreationalVehicleModule } from './modules/recreational-vehicle/recreational-vehicle.module';
import { AppulateModule } from './modules/appulate/appulate.module';
import { ZapierModule } from './modules/zapier/zapier.module';
import { HubspotModule } from './modules/hubspot/hubspot.module';
import { CityDistanceModule } from './modules/city-distance/city-distance.module';
import { MyEvoModule } from './modules/my-evo/my-evo.module';
import { IncidentModule } from './modules/incident/incident.module';
import { OutlookModule } from './modules/outlook/outlook.module';
import { PartnerXeModule } from './modules/partner-xe/partner-xe.module';
import { NowCertsModule } from './modules/now-certs/now-certs.module';
import { TextMessagesModule } from './modules/text-messages/text-messages.module';
import { TextCallbackModule } from './modules/text-callback/text-callback.module';
import { ReportModule } from './modules/report/report.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { RicochetModule } from './modules/ricochet/ricochet.module';
import { SalesforceDynamicModule } from './modules/salesforce-dynamic/salesforce-dynamic.module';
import { TemplateModule } from './modules/template/template.module';
import { TaskModule } from './modules/task/task.module';
import { XanatekModule } from './modules/xanatek/xanatek.module';
import { WealthboxModule } from './modules/wealthbox/wealthbox.module';
import { UsDotIntegrationModule } from './modules/us-dot-integration/us-dot-integration.module';

@Module({
  imports: [
    MetricsModule.forRoot({
      // data available at http://localhost:{restPort}/api/v1/metrics
      defaultLabels: {
        // app: AppConfig.APP_NAME
        app: 'XILO_BACKEND',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-23-22-156-110.compute-1.amazonaws.com',
      port: 5432,
      username: 'mbqghbcqnwadgr',
      password:
        '99d8e45edcc7d60398358cab381012c7b6896f9149fdef1a84efd7bf781be0f6',
      database: 'dc93hgqeve30ed',
      ssl: true,
      synchronize: false,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: [
        Answers,
        Businesses,
        Documents,
        Drivers,
        Feedback,
        Flows,
        Partners,
        Policies,
        Questions,
        RecreationalVehicles,
        Tasks,
        Vehicles,
      ],
      autoLoadEntities: true,
      // logging: true,
    }),
    CommonModule,
    AssetsModule,
    UserModule,
    CompanyModule,
    LocationModule,
    AgencyMatrixModule,
    AgencySoftwareModule,
    AgentModule,
    AnalyticsModule,
    Analyticsv2Module,
    ClientModule,
    Ams360Module,
    LifecycleAnalyticsModule,
    IntegrationModule,
    IntegrationValidatorModule,
    LifecycleEmailModule,
    ParameterModule,
    TeamSignupModule,
    QuoteRushModule,
    LifecycleModule,
    DynamicCoverageModule,
    DynamicParameterModule,
    AppliedModule,
    AppliedEpicModule,
    AuthModule,
    ConditionModule,
    CoverageModule,
    CronModule,
    DocuSignModule,
    EmailModule,
    DynamicRateModule,
    DynamicRaterModule,
    EzlynxModule,
    EstatedModule,
    FileModule,
    DynamicRateConditionModule,
    NoteModule,
    FormModule,
    HawksoftModule,
    GoogleModule,
    PdfModule,
    PipedriveModule,
    NotificationsModule,
    PlRaterModule,
    ZillowModule,
    RaterModule,
    V2IntegrationModule,
    UploadModule,
    StripeModule,
    RateModule,
    SignupFlowModule,
    VendorModule,
    AppImageModule,
    NewClientModule,
    V2EzlynxModule,
    TriggerModule,
    PageModule,
    BusinessModule,
    DriverModule,
    FlowModule,
    HomeModule,
    RecreationalVehicleModule,
    AppulateModule,
    ZapierModule,
    HubspotModule,
    CityDistanceModule,
    MyEvoModule,
    IncidentModule,
    OutlookModule,
    PartnerXeModule,
    NowCertsModule,
    TextMessagesModule,
    TextCallbackModule,
    ReportModule,
    ResetPasswordModule,
    RicochetModule,
    SalesforceDynamicModule,
    TemplateModule,
    TaskModule,
    XanatekModule,
    WealthboxModule,
    UsDotIntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
