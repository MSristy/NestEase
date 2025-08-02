"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const properties_module_1 = require("./properties/properties.module");
const service_provider_module_1 = require("./service-providers/service-provider.module");
const save_and_swap_module_1 = require("./save-and-swap/save-and-swap.module");
const admin_module_1 = require("./admin/admin.module");
const bookings_module_1 = require("./bookings/bookings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const contact_messages_module_1 = require("./contact-messages/contact-messages.module");
const user_entity_1 = require("./users/entities/user.entity");
const address_entity_1 = require("./users/entities/address.entity");
const connected_account_entity_1 = require("./users/entities/connected-account.entity");
const notification_entity_1 = require("./users/entities/notification.entity");
const property_entity_1 = require("./properties/property.entity");
const property_booking_entity_1 = require("./properties/property-booking.entity");
const service_provider_entity_1 = require("./service-providers/entities/service-provider.entity");
const save_and_swap_entity_1 = require("./save-and-swap/entities/save-and-swap.entity");
const booking_entity_1 = require("./bookings/entities/booking.entity");
const contact_message_entity_1 = require("./contact-messages/entities/contact-message.entity");
const path_1 = require("path");
const add_swap_module_1 = require("./add-swap/add-swap.module");
const add_swap_entity_1 = require("./add-swap/entities/add-swap.entity");
const sell_module_1 = require("./sell/sell.module");
const upload_module_1 = require("./upload/upload.module");
const sell_entity_1 = require("./sell/sell.entity");
const offer_module_1 = require("./offer/offer.module");
const item_offer_entity_1 = require("./offer/entities/item-offer.entity");
const exchange_module_1 = require("./exchange/exchange.module");
const exchange_product_entity_1 = require("./exchange/entities/exchange-product.entity");
const property_purchase_entity_1 = require("./properties/entities/property-purchase.entity");
const recommendations_module_1 = require("./recommendations/recommendations.module");
const careers_module_1 = require("./careers/careers.module");
const job_application_entity_1 = require("./careers/entities/job-application.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE || 'nestease',
                entities: [
                    user_entity_1.User,
                    address_entity_1.Address,
                    connected_account_entity_1.ConnectedAccount,
                    notification_entity_1.Notification,
                    property_entity_1.Property,
                    property_booking_entity_1.PropertyBooking,
                    service_provider_entity_1.ServiceProvider,
                    save_and_swap_entity_1.SaveAndSwap,
                    add_swap_entity_1.AddSwap,
                    sell_entity_1.SellProduct,
                    item_offer_entity_1.ItemOffer,
                    exchange_product_entity_1.ExchangeProduct,
                    booking_entity_1.Booking,
                    property_purchase_entity_1.PropertyPurchase,
                    job_application_entity_1.JobApplication,
                    contact_message_entity_1.ContactMessage,
                ],
                migrations: [(0, path_1.join)(__dirname, 'migrations', '*.{ts,js}')],
                migrationsRun: false,
                synchronize: true,
                autoLoadEntities: false,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            properties_module_1.PropertiesModule,
            service_provider_module_1.ServiceProviderModule,
            save_and_swap_module_1.SaveAndSwapModule,
            admin_module_1.AdminModule,
            bookings_module_1.BookingsModule,
            notifications_module_1.NotificationsModule,
            contact_messages_module_1.ContactMessagesModule,
            add_swap_module_1.AddSwapModule,
            sell_module_1.SellModule,
            upload_module_1.UploadModule,
            offer_module_1.OfferModule,
            exchange_module_1.ExchangeModule,
            recommendations_module_1.RecommendationsModule,
            careers_module_1.CareersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map