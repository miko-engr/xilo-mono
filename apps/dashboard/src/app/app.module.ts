import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CarrierService } from './services/carrier.service';
import { ClientService } from './services/client.service';
import { VehicleApiService } from './services/vehicle-api.service';
import { UploadService } from './services/upload.service';
import { UnknownComponent } from './unknown.component';
import { AuthGuard } from './guards/auth.guard';
import { PaymentGuard } from './guards/payment.guard';
import { SubscriptionGuard } from './guards/subscription.guard';
import { AlertControllerService } from './services/alert.service';
import { AlertModule } from 'ngx-alerts';
import { MomentModule } from 'angular2-moment';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { VehicleService } from './services/vehicle.service';
import { DriverService } from './services/driver.services';
import { AgentService } from './services/agent.service';
import { ResetPasswordService } from './services/reset-password.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ApiService } from './services/api.service';
import { BoardService } from './services/board.service';
import { LifecycleService } from './services/lifecycle.service';
import { PlatformManagerService } from './services/platform-manager.service';
import { CompanyService } from './services/company.service';
import { LifecycleAnalyticService } from './services/lifecycle-analytic.service';
import { NoteService } from './services/note.serivce';
import { CommercialService } from './services/commercial.service';
import { SharedService } from './services/shared.services';
import { VinApiService } from './services/vin-api.service';
import { HomeService } from './services/home.services';
import { LandingPageService } from './services/landing-page.service';
import { CTAService } from './services/ctas.services';
import { MediumService } from './services/medium.service';
import { CronService } from './services/cron.service';
import { LogService } from './services/log.service';
import { environment } from '../environments/environment';
import { CityService } from './services/city.service';
import { StartPageService } from './services/start-page.service';
import { PageService } from './services/page.service';
import { FormService } from './services/form.service';
import { AnswerService } from './services/answer.service';
import { QuestionService } from './services/question.service';
import { DiscountService } from './services/discount.service';
import { CoverageService } from './services/coverage.service';
import { RateService } from './services/rate.service';
import { RaterService } from './services/rater.service';
import { ParameterService } from './services/parameter.service';
import { AgePipe } from './shared/pipes/age.pipe';
import { AppImageService } from './services/app-image.service';
import { DynamicRaterService } from './services/dynamic-rater.service';
import { DynamicRateConditionService } from './services/dynamic-rate-condition.service';
import { DynamicRateService } from './services/dynamic-rate.service';
import { DynamicCoverageService } from './services/dynamic-coverage.service';
import { IntegrationService } from './services/integration.service';
import { FileService } from './services/file.service';
import { TemplateService } from './services/template.service';
import { EmailService } from './services/email.service';
import { VendorService } from './services/vendor.service';
import { IntercomModule } from 'ng-intercom';
import { TextMessageService } from './services/text-message.service';
import { FlowService } from './services/flow.service';
import { BusinessService } from './services/business.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './httpconfig.interceptor';
import { HawksoftService } from './services/hawksoft.service';
import { InfusionsoftService } from './services/infusionsoft.service';
import { PdfService } from './services/pdf.service';
import { AnalyticsV2Service } from './services/analyticsv2.service';
import { LifecycleEmailService } from './services/lifecycle-email.service';
import { PipedriveService } from './services/pipedrive.service';
import { AgencyMatrixService } from './services/agency-matrix.service';
import { AppliedEpicService } from './services/applied-epic.service';
import { AgencySoftwareService } from './services/agency-software.service';
import { SalesforceService } from './services/salesforce.service';
import { MyEvoService } from './services/my-evo.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AMS360Service } from './services/ams360.service';
import { AppliedService } from './services/applied.service';
import { ConditionService } from './services/condition.service';
import { TaskService } from './services/task.service';
import { AcordService } from './services/acord.service';
import { StripeService } from './services/stripe.service';
import { IntegrationValidatorService } from './services/integration-validator.service';
import { EZLynxService } from './services/ezlynx.service';
import { PLRaterService } from './services/pl-rater.service';
import { FeedBackService } from './services/feedBack.service';
import { ToastService } from './services/toast.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { XanatekService } from './services/xanatek.service';
import { PosthogService } from './services/posthog.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUIModule } from '@swimlane/ngx-ui';
import {
  CustomSerializer,
  metaReducers,
  reducers,
  RouterEffects,
  FormBuilderEffects,
  treeReducers
} from './form-builder/store';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RatingModule } from 'ngx-bootstrap/rating';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FeatureFlagCanActivateGuard } from './guards/featureFlagCanActivate.guard';
import { FeatureFlagCanLoadGuard } from './guards/featureFlagCanLoad.guard';
import { AuthCanLoadGuard } from './guards/authCanLoad.guard';
import { AccountDetailsService } from './team-signup/account-details.service';
import { SupportService } from './support/support.service';
import { SocketioService } from './services/socket.service';
import { NgxStripeModule } from 'ngx-stripe';
import { FormContractModule, FormViewService, FormBuilderService, VehicleListService } from '@xilo-mono/form-contracts';
import { FormSubmissionsGuard } from './guards/form-submissions.guard';
import { FormViewerModule } from '@xilo-mono/form-viewer';
import { NgxZendeskWebwidgetModule, NgxZendeskWebwidgetConfig } from 'ngx-zendesk-webwidget';

export class ZendeskConfig extends NgxZendeskWebwidgetConfig {
  accountUrl = 'xilo-support.zendesk.com';
  callback(zE) {
    // You can call every command you want in here
    zE('webWidget', 'hide');
  }
}

// let apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
// window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl));
// apiUrl = apiUrl.replace('/api/', '');
// const config: SocketIoConfig = { url: apiUrl, options: {} };

@Injectable()
export class MyErrorHandler implements ErrorHandler {

  handleError(error) {
    const isProduction = (environment.production === true);
    const maxLength = 150;
    const errStr = error.toString();
    const str = errStr.length > maxLength ? errStr.substr(0, maxLength) + '...' : errStr;
    if (isProduction === true) {
      console.log(str);
    } else {
      console.log('Error: %o', error);
    }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    UnknownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // SocketIoModule.forRoot(config),
    HttpClientModule,
    NgxLoadingModule,
    NgxUIModule,
    MomentModule,
    BrowserAnimationsModule,
    FormViewerModule,
    FormContractModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, position: 'right' }),
    IntercomModule.forRoot({
      appId: 'umjri2q3',
      updateOnRouterChange: true
    }),
    Ng2SearchPipeModule,
    MatSnackBarModule,
    NgSelectModule,
    StoreModule.forRoot({ ...reducers, treeReducers }, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([
      RouterEffects,
      FormBuilderEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    ButtonsModule.forRoot(),
    RatingModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripePKey),
    NgxZendeskWebwidgetModule.forRoot(ZendeskConfig)
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: ErrorHandler, useClass: MyErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    AgentService,
    AlertControllerService,
    CarrierService,
    CompanyService,
    AuthGuard,
    AuthService,
    ClientService,
    DriverService,
    BusinessService,
    GoogleAnalyticsEventsService,
    LifecycleAnalyticService,
    LifecycleService,
    NoteService,
    PaymentGuard,
    ResetPasswordService,
    SubscriptionGuard,
    FeatureFlagCanActivateGuard,
    FeatureFlagCanLoadGuard,
    AuthCanLoadGuard,
    FormSubmissionsGuard,
    UploadService,
    UserService,
    VehicleService,
    VehicleApiService,
    ApiService,
    BoardService,
    VinApiService,
    PlatformManagerService,
    CommercialService,
    SharedService,
    HomeService,
    LandingPageService,
    CTAService,
    MediumService,
    CronService,
    LogService,
    CityService,
    StartPageService,
    PageService,
    FormService,
    AnswerService,
    QuestionService,
    DiscountService,
    CoverageService,
    RateService,
    RaterService,
    ParameterService,
    AgePipe,
    AppImageService,
    DynamicRaterService,
    DynamicRateConditionService,
    DynamicRateService,
    DynamicCoverageService,
    IntegrationService,
    FileService,
    TextMessageService,
    EmailService,
    TemplateService,
    VendorService,
    FlowService,
    HawksoftService,
    AnalyticsV2Service,
    PdfService,
    LifecycleEmailService,
    InfusionsoftService,
    PipedriveService,
    AgencyMatrixService,
    AppliedEpicService,
    AgencySoftwareService,
    SalesforceService,
    MyEvoService,
    AMS360Service,
    AppliedService,
    ConditionService,
    TaskService,
    AcordService,
    StripeService,
    IntegrationValidatorService,
    EZLynxService,
    PLRaterService,
    FeedBackService,
    ToastService,
    XanatekService,
    PosthogService,
    AccountDetailsService,
    SupportService,
    SocketioService,
    FormViewService,
    FormBuilderService,
    VehicleListService
  ],
  bootstrap: [AppComponent],
  exports: [MatSnackBarModule]
})
export class AppModule {
  constructor() {
  }
}
