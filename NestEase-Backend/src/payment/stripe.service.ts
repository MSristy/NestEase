import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    // A real secret key should be set in a .env file for production
    // This is a temporary fix to allow the application to start.
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';
    
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    description: string;
  }): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: paymentIntent.amount,
    });
  }

  async createCustomer(params: {
    email: string;
    name: string;
  }): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email: params.email,
      name: params.name,
    });
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async listPaymentMethods(customerId: string): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.stripe.customers.listPaymentMethods(customerId, {
      type: 'card',
    });
  }
} 