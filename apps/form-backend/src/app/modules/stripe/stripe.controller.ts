import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('customer')
  async storeCustomer(@Body() bodyObj: any) {
    try {
      const company = await this.stripeService.findCompany();
      const customer = await this.stripeService.stripeCreateCustomer(bodyObj);
      return await this.stripeService.storeCustomer();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('customer/exist')
  async existStripeCustomer() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.existStripeCustomer();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('customer/details')
  async stripeRetrieveCustomerDetails() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeRetrieveCustomerDetails();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('customer/payment-methods')
  async stripeRetrievePaymentMethods() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeRetrievePaymentMethods();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('customer/payment-methods/show')
  showPaymentMethod() {
    return this.stripeService.showPaymentMethod();
  }
  @Post('customer/payment-methods/create')
  async storeCardDetails(@Body() bodyObj: any) {
    try {
      const company = await this.stripeService.findCompany();
      const paymentData = await this.stripeService.stripeCreatePaymentMethods(
        bodyObj
      );
      const updateResponse = await this.stripeService.setDefaultPaymentMethod(
        bodyObj
      );
      return await this.stripeService.storeCardDetails();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('customer/payment-methods/update')
  async stripeUpdatePaymentMethods(@Body() bodyObj: any) {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeUpdatePaymentMethods(bodyObj);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('customer/payment-methods/card/:id')
  stripeRetrieveCardById() {
    return this.stripeService.stripeRetrieveCardById();
  }
  @Get('products')
  stripeRetrieveProducts() {
    return this.stripeService.stripeRetrieveProducts();
  }
  @Get('plans')
  stripeRetrievePlans() {
    return this.stripeService.stripeRetrievePlans();
  }
  @Post('plans')
  stripeCreatePlan() {
    return this.stripeService.stripeCreatePlan();
  }
  @Get('plans/:id')
  stripeRetrievePlanById() {
    return this.stripeService.stripeRetrievePlanById();
  }
  @Get('coupons')
  stripeRetrieveCoupons() {
    return this.stripeService.stripeRetrieveCoupons();
  }
  @Post('subscription')
  async storeSubscription() {
    try {
      const company = await this.stripeService.findCompany();
      const subscriptionData = await this.stripeService.stripeSubscription();
      return await this.stripeService.storeSubscription();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Delete()
  async deleteSubscription() {
    try {
      const company = await this.stripeService.findCompany();
      const subscriptionData = await this.stripeService.stripeDeleteSubscription();
      return await this.stripeService.deleteSubscription();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('subscription/retrieve')
  async stripeRetrieveSubscription() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeRetrieveSubscription();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('subscription/add-plan')
  async stripeSubscriptionAddPlan() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeSubscriptionAddPlan();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('subscription/delete-plan')
  async stripeSubscriptionDeletePlan() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeSubscriptionDeletePlan();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('setup-intent')
  stripeSetupIntent() {
    return this.stripeService.stripeSetupIntent();
  }
  @Post('invoice/immediate')
  async stripeInvoiceImmediate() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeInvoiceImmediate();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('invoice/due-date')
  async stripeInvoiceDueDate() {
    try {
      const company = await this.stripeService.findCompany();
      return await this.stripeService.stripeInvoiceDueDate();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('invoice/retrieve')
  stripeRetrieveInvoice() {
    return this.stripeService.stripeRetrieveInvoice();
  }

  @Post('customer-add-payment')
  async customerAddPayment(@Body() bodyObj: any) {
    try {
      const stripeByCustomer= await this.stripeService.listStripeCustomerByEmail(bodyObj);
      const paymentData = await this.stripeService.stripeCreatePaymentMethods(bodyObj);
      return await this.stripeService.storeCustomer();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
