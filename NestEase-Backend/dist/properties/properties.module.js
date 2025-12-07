"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const properties_controller_1 = require("./properties.controller");
const properties_service_1 = require("./properties.service");
const property_entity_1 = require("./property.entity");
const property_purchase_entity_1 = require("./entities/property-purchase.entity");
const property_booking_entity_1 = require("./property-booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
const stripe_module_1 = require("../payment/stripe.module");
const applink_module_1 = require("../applink/applink.module");
let PropertiesModule = class PropertiesModule {
};
exports.PropertiesModule = PropertiesModule;
exports.PropertiesModule = PropertiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([property_entity_1.Property, property_purchase_entity_1.PropertyPurchase, property_booking_entity_1.PropertyBooking, user_entity_1.User]),
            platform_express_1.MulterModule.register({
                dest: './uploads/properties',
            }),
            stripe_module_1.StripeModule,
            applink_module_1.ApplinkModule,
        ],
        controllers: [properties_controller_1.PropertiesController],
        providers: [properties_service_1.PropertiesService],
        exports: [properties_service_1.PropertiesService],
    })
], PropertiesModule);
//# sourceMappingURL=properties.module.js.map