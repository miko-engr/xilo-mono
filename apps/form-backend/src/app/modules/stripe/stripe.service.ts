import {
  Injectable,
  Scope,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Companies } from '../company/company.entity';
import * as _ from 'lodash';
@Injectable({ scope: Scope.REQUEST })
export class StripeService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @InjectRepository(Companies)
    private companiesRepository: Repository<Companies>,
    @Inject(REQUEST) private request: Request
  ) {}
  async findCompany() {
    try {
      const decoded = this.request.body.decodedUser;

      const companyStore = await this.companiesRepository.findOne({
        where: { id: decoded.companyId },
      });
      if (!companyStore) {
        throw new HttpException('No company', HttpStatus.BAD_REQUEST);
      }
      this.request['companyStore'] = companyStore;
      return companyStore;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async stripeCreateCustomer(bodyObj: any) {
    const decoded = this.request.body.decodedUser;
    try {
      if (!bodyObj.name) {
        throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
      }
      if (!bodyObj.email) {
        throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
      }
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Empty request parameters',
          HttpStatus.BAD_REQUEST
        );
      }
      if (this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer already exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const customerData = {
        name: bodyObj.name,
        email: bodyObj.email,
      };
      const customer = await this.stripeClient.customers.create(customerData);
      if (_.isEmpty(customer) || !customer.id) {
        throw new HttpException('CustomerId not found', HttpStatus.BAD_REQUEST);
      }
      this.request['customerStore'] = customer;
      return customer;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async storeCustomer() {
    const decoded = this.request.body.decodedUser;
    try {
      if (
        _.isEmpty(this.request['customerStore']) ||
        !this.request['customerStore'].id
      ) {
        throw new HttpException('Customer not found', HttpStatus.BAD_REQUEST);
      }
      const whereCondition = {
        id: decoded.companyId,
      };
      const updateOptions = {
        where: whereCondition,
      };
      const companyData = {
        customerId: this.request['customerStore'].id,
      };

      const updatedCompany = await this.companiesRepository.update(
        { id: decoded.companyId },
        companyData
      );
      if (updatedCompany.affected === 0) {
        throw new HttpException('Company not updated', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Customer Created',
        obj: {
          customerId: this.request['customerStore'].id,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async existStripeCustomer() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const customerData = await this.stripeClient.customers.retrieve(
        this.request['companyStore'].customerId
      );
      if (_.isEmpty(customerData) || !customerData.id) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Customer exist',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async stripeRetrieveCustomerDetails() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const customerData = await this.stripeClient.customers.retrieve(
        this.request['companyStore'].customerId
      );
      return {
        title: 'Customer Details',
        obj: {
          customerDetails: customerData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async stripeRetrievePaymentMethods() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const paymentMethodsData = await this.stripeClient.paymentMethods.list({
        customer: this.request['companyStore'].customerId,
        type: 'card',
      });
      return {
        title: 'Payment methods',
        obj: {
          paymentMethods: paymentMethodsData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async stripeCreatePaymentMethods(bodyObj: any) {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!bodyObj.paymentMethodId) {
        throw new HttpException(
          'No paymentMethodId passed',
          HttpStatus.BAD_REQUEST
        );
      }
      const paymentMethodsData = await this.stripeClient.paymentMethods.attach(
        bodyObj.paymentMethodId,
        { customer: this.request['companyStore'].customerId }
      );
      this.request['paymentMethodStore'] = paymentMethodsData;
      return paymentMethodsData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async setDefaultPaymentMethod(bodyObj: any) {
    try {
      const params = {
        invoice_settings: {
          default_payment_method: bodyObj.paymentMethodId,
        },
      };
      const updateResponse = await this.stripeClient.customers.update(
        this.request['companyStore'].customerId,
        params
      );
      this.request['updateResponse'] = updateResponse;
      return updateResponse;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async storeCardDetails() {
    const decoded = this.request.body.decodedUser;
    try {
      if (
        _.isEmpty(this.request['paymentMethodStore']) ||
        !this.request['paymentMethodStore'].id ||
        _.isEmpty(this.request['paymentMethodStore'].card) ||
        !this.request['paymentMethodStore'].card.last4
      ) {
        throw new HttpException(
          'paymentMethod not found',
          HttpStatus.BAD_REQUEST
        );
      }
      const companyData = {
        cardId: this.request['paymentMethodStore'].id,
        cardLast4: this.request['paymentMethodStore'].card.last4,
        addedPayment: true,
      };
      const whereCondition = {
        id: decoded.companyId,
      };
      const updateOptions = {
        where: whereCondition,
      };
      const updatedCompany = await this.companiesRepository.update(
        { id: decoded.companyId },
        companyData
      );
      if (updatedCompany.affected === 0) {
        throw new HttpException('No updated company', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Payment Method Created',
        obj: {
          subscription: this.request['paymentMethodStore'],
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async showPaymentMethod() {
    try {
      const decoded = this.request.body.decodedUser;
      const companyData = await this.companiesRepository.findOne({
        where: { id: decoded.companyId },
      });
      if (_.isEmpty(companyData)) {
        throw new HttpException('Company not found', HttpStatus.BAD_REQUEST);
      } else if (!companyData.cardId) {
        throw new HttpException(
          'Payment method details not found',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        title: 'Payment method details',
        obj: {
          paymentMethodId: companyData.cardId,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async stripeUpdatePaymentMethods(bodyObj: any) {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const isPaymentMethodDataPassed =
        _.isEmpty(bodyObj.paymentMethodData) ||
        !bodyObj.paymentMethodData.paymentMethodId ||
        !bodyObj.paymentMethodData.name ||
        !bodyObj.paymentMethodData.email ||
        !bodyObj.paymentMethodData.exp_month ||
        !bodyObj.paymentMethodData.exp_year;

      if (isPaymentMethodDataPassed) {
        throw new HttpException(
          'Payment Method Data not passed',
          HttpStatus.BAD_REQUEST
        );
      }
      const paymentMethodData = {
        billing_details: {
          name: bodyObj.paymentMethodData.name,
          email: bodyObj.paymentMethodData.email,
        },
        card: {
          exp_month: bodyObj.paymentMethodData.exp_month,
          exp_year: bodyObj.paymentMethodData.exp_year,
        },
      };
      const paymentMethodsData = await this.stripeClient.paymentMethods.update(
        bodyObj.paymentMethodData.paymentMethodId,
        paymentMethodData
      );
      return {
        title: 'Payment method updated',
        obj: {
          paymentMethods: paymentMethodsData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrive card details from specified card id
   */
  async stripeRetrieveCardById() {
    try {
      if (_.isEmpty(this.request.params) || !this.request.params.id) {
        throw new HttpException(
          'Empty request parameters',
          HttpStatus.BAD_REQUEST
        );
      }
      const cardData = await this.stripeClient.paymentMethods.retrieve(
        this.request.params.id
      );
      return {
        title: 'Card details',
        obj: {
          card: cardData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrieve all the products from stripe
   */
  async stripeRetrieveProducts() {
    try {
      const productsData = await this.stripeClient.products.list({
        limit: 100,
      });
      return {
        title: 'Products',
        obj: {
          products: productsData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrieve all plans from stripe
   */
  async stripeRetrievePlans() {
    try {
      const plansData = await this.stripeClient.plans.list({ limit: 100 });
      return {
        title: 'Plans',
        obj: {
          plans: plansData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrieve all coupons from stripe
   */
  async stripeRetrieveCoupons() {
    try {
      const couponsData = await this.stripeClient.coupons.list({ limit: 100 });
      return {
        title: 'Coupons',
        obj: {
          products: couponsData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This fumction will retrieve specified subscription
   */
  async stripeRetrieveSubscription() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].subscriptionId) {
        throw new HttpException(
          'Subscription does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const subscriptionData = await this.stripeClient.subscriptions.retrieve(
        this.request['companyStore'].subscriptionId
      );
      return {
        title: 'Subscription retrieved',
        obj: {
          subscription: subscriptionData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will create a subscription
   */
  async stripeSubscription() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      let couponData = null;
      if (_.isEmpty(this.request.body.plans)) {
        throw new HttpException('Empty plans array', HttpStatus.BAD_REQUEST);
      } else if (!this.request.body.coupon) {
        couponData = null;
      } else {
        couponData = this.request.body.coupon;
      }
      const plansData = this.request.body.plans;
      const subscriptionData = await this.stripeClient.subscriptions.create({
        customer: this.request['companyStore'].customerId,
        items: plansData,
        coupon: couponData,
      });
      this.request['subscriptionStore'] = subscriptionData;
      return subscriptionData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will store subscription in database
   */
  async storeSubscription() {
    const decoded = this.request.body.decodedUser;
    try {
      if (_.isEmpty(this.request['subscriptionStore'])) {
        throw new HttpException(
          'No subscription found',
          HttpStatus.BAD_REQUEST
        );
      }
      const companyData = {
        subscriptionId: this.request['subscriptionStore'].id,
        hasActiveSubscription: true,
      };
      const whereCondition = {
        id: decoded.companyId,
      };
      const updateOptions = {
        where: whereCondition,
      };
      const updatedCompany = await this.companiesRepository.update(
        { id: decoded.companyId },
        companyData
      );
      if (updatedCompany.affected === 0) {
        throw new HttpException('No company updated', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Subscription created',
        obj: {
          subscription: this.request['subscriptionStore'],
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will cancel the sunscription
   */
  async stripeDeleteSubscription() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].subscriptionId) {
        throw new HttpException(
          'Subscription does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const subscriptionData = await this.stripeClient.subscriptions.del(
        this.request['companyStore'].subscriptionId
      );
      this.request['subscriptionStore'] = subscriptionData;
      return subscriptionData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will remove the canceled subscription from database
   */
  async deleteSubscription() {
    const decoded = this.request.body.decodedUser;
    try {
      if (_.isEmpty(this.request['subscriptionStore'])) {
        throw new HttpException(
          'No subscription found',
          HttpStatus.BAD_REQUEST
        );
      }
      const companyData = {
        subscriptionId: null,
        hasActiveSubscription: false,
      };
      const whereCondition = {
        id: decoded.companyId,
      };
      const updateOptions = {
        where: whereCondition,
      };
      const updatedCompany = await this.companiesRepository.update(
        { id: decoded.companyId },
        companyData
      );
      return {
        title: 'Subscription deleted',
        obj: {
          subscription: this.request['subscriptionStore'],
          hasActiveSubscription: 'false',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will add specified plan to current subscription
   */
  async stripeSubscriptionAddPlan() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].subscriptionId) {
        throw new HttpException(
          'Subscription does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      if (_.isNull(this.request.body.plan)) {
        throw new HttpException('Empty plans array', HttpStatus.BAD_REQUEST);
      }
      const plansData = this.request.body.plan;
      const subscription = await this.stripeClient.subscriptions.retrieve(
        this.request['companyStore'].subscriptionId
      );
      if (_.isEmpty(subscription)) {
        throw new HttpException(
          'No subscription exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const subscriptionItemData = await this.stripeClient.subscriptionItems.create(
        {
          subscription: subscription.id,
          plan: plansData,
        }
      );
      return {
        title: 'Added Plan',
        obj: {
          subscriptionItem: subscriptionItemData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will delete specified plan to current subscription
   */
  async stripeSubscriptionDeletePlan() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].subscriptionId) {
        throw new HttpException(
          'Subscription does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      const subscription = await this.stripeClient.subscriptions.retrieve(
        this.request['companyStore'].subscriptionId
      );
      if (
        _.isEmpty(subscription) ||
        _.isEmpty(subscription.items) ||
        _.isEmpty(subscription.items.data)
      ) {
        throw new HttpException(
          'No subscription exist or No subscription data found',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!this.request.body.plan) {
        throw new HttpException('Empty plans array', HttpStatus.BAD_REQUEST);
      }
      const subscriptionItemId = _.result(
        _.find(subscription.items.data, (element) => {
          return element['plan']['name'] === this.request.body.plan;
        }),
        'id'
      );
      const subscriptionItemDeletedData = await this.stripeClient.subscriptionItems.del(
        subscriptionItemId as any
      );
      return {
        title: 'Plan deleted',
        obj: {
          subscriptionItemDeleted: subscriptionItemDeletedData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will create an invoice and charge it immediately
   */
  async stripeInvoiceImmediate() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!this.request.body.amount && this.request.body.amount !== 0) {
        throw new HttpException(
          'Please pass the amount',
          HttpStatus.BAD_REQUEST
        );
      }
      const invoiceOptions: Stripe.InvoiceCreateParams = {
        customer: this.request['companyStore'].customerId,
        collection_method: 'charge_automatically',
      };
      await this.stripeClient.invoiceItems.create({
        customer: this.request['companyStore'].customerId,
        amount: this.request.body.amount,
        currency: 'usd',
      });
      const invoiceData = await this.stripeClient.invoices.create(
        invoiceOptions
      );
      if (_.isEmpty(invoiceData) || !invoiceData.id) {
        throw new HttpException('No invoice created', HttpStatus.BAD_REQUEST);
      }
      await this.stripeClient.invoices.pay(invoiceData.id);
      return {
        title: 'Invoice created',
        obj: {
          subscription: invoiceData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrieve all the subscriptions from stripe
   */
  async stripeRetrieveInvoice() {
    try {
      const invoiceData = await this.stripeClient.invoices.list({ limit: 100 });
      if (_.isEmpty(invoiceData)) {
        throw new HttpException('No invoice found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Invoices Retrieved',
        obj: {
          subscription: invoiceData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will create an invoice and send it to customer to pay
   */
  async stripeInvoiceDueDate() {
    try {
      if (_.isEmpty(this.request['companyStore'])) {
        throw new HttpException(
          'Company does not exist',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request['companyStore'].customerId) {
        throw new HttpException(
          'Customer does not exist',
          HttpStatus.BAD_REQUEST
        );
      }
      if (!this.request.body.date) {
        throw new HttpException(
          'Date parameter not passed',
          HttpStatus.BAD_REQUEST
        );
      } else if (!this.request.body.amount) {
        throw new HttpException(
          'Please pass the amount',
          HttpStatus.BAD_REQUEST
        );
      }
      const invoiceOptions: Stripe.InvoiceCreateParams = {
        customer: this.request['companyStore'].customerId,
        collection_method: 'send_invoice',
        due_date: new Date(this.request.body.date).getTime() / 1000,
      };
      await this.stripeClient.invoiceItems.create({
        customer: this.request['companyStore'].customerId,
        amount: this.request.body.amount,
        currency: 'usd',
      });
      const invoiceData = await this.stripeClient.invoices.create(
        invoiceOptions
      );
      if (_.isEmpty(invoiceData) || !invoiceData.id) {
        throw new HttpException('No invoice created', HttpStatus.BAD_REQUEST);
      }
      await this.stripeClient.invoices.finalizeInvoice(invoiceData.id);
      return {
        title: 'Invoice created',
        obj: {
          subscription: invoiceData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will create a setup intent to add a payment method
   */
  async stripeSetupIntent() {
    try {
      const setupIntentData = await this.stripeClient.setupIntents.create({
        payment_method_types: ['card'],
      });
      return {
        title: 'SetupIntent created',
        obj: {
          setupIntent: setupIntentData,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will create a new plan in stripe
   */

  async stripeCreatePlan() {
    try {
      if (!this.request.body.amount) {
        throw new HttpException('amount is required', HttpStatus.BAD_REQUEST);
      } else if (!this.request.body.interval) {
        throw new HttpException('interval is required', HttpStatus.BAD_REQUEST);
      } else if (!this.request.body.productName) {
        throw new HttpException(
          'productName is required',
          HttpStatus.BAD_REQUEST
        );
      }
      const planData = await this.stripeClient.plans.create({
        amount: this.request.body.amount,
        currency: 'usd',
        interval: this.request.body.interval,
        product: { name: this.request.body.productName },
      });
      return {
        title: 'Plan Created',
        obj: planData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   * This function will retrieve plan of specified plan Id
   */
  async stripeRetrievePlanById() {
    try {
      if (_.isEmpty(this.request.params) || !this.request.params.id) {
        throw new HttpException(
          'Empty request parameters',
          HttpStatus.BAD_REQUEST
        );
      }
      const planData = await this.stripeClient.plans.retrieve(
        this.request.params.id
      );
      return {
        title: 'Plan retrieved',
        obj: planData,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * This function will check if customer exist by email
   */
  async listStripeCustomerByEmail (bodyObj) {
    try {
      if (_.isEmpty(bodyObj.email)) {
        return {
          title: 'Need email parameter to check customers'
        }
      }
      const customers = await this.stripeClient.customers.list({
        limit: 1, email: bodyObj.email
      })
      
      if (customers.data && customers.data.length > 0) {
        this.request['customerStore'] = customers.data[0];
        this.request['customerStore'].customerExists = true;
      } else {
        const response = await this.handleCreateCustomer(bodyObj.email, bodyObj.name);
        
        if (!response.status) throw new HttpException(response.error, HttpStatus.BAD_REQUEST );
        this.request['customerStore'] = response.response;
        this.request['customerStore'].customerExists = true;
      }      
    } catch (error) {
      throw new HttpException('Check customer exist failed', HttpStatus.BAD_REQUEST );
    }
  }

  async handleCreateCustomer(email, name) {
    try {
      if (!name) throw new HttpException('Name is required', HttpStatus.BAD_REQUEST );
      if (!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST );
      const customerData = {
        name, email
      };
      const customer = await this.stripeClient.customers.create(customerData);
      if (_.isEmpty(customer) || !customer.id) {
        throw new HttpException('CustomerId not found', HttpStatus.BAD_REQUEST );
      }

      return { status: true, response: customer };
    } catch (error) {
      return { status: false, error: error };
    }
  }
}
