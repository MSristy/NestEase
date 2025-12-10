"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let StripeService = class StripeService {
    constructor(configService) {
        this.configService = configService;
        // A real secret key should be set in a .env file for production
        // This is a temporary fix to allow the application to start.
        const secretKey = this.configService.get('STRIPE_SECRET_KEY') || 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-08-27.basil',
        });
    }
    async createPaymentIntent(params) {
        return await this.stripe.paymentIntents.create({
            amount: params.amount,
            currency: params.currency,
            description: params.description,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }
    async refundPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: paymentIntent.amount,
        });
    }
    async createCustomer(params) {
        return await this.stripe.customers.create({
            email: params.email,
            name: params.name,
        });
    }
    async attachPaymentMethod(customerId, paymentMethodId) {
        return await this.stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
    }
    async listPaymentMethods(customerId) {
        return await this.stripe.customers.listPaymentMethods(customerId, {
            type: 'card',
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map