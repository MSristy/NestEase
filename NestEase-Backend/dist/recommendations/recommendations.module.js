"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recommendations_controller_1 = require("./recommendations.controller");
const recommendations_service_1 = require("./recommendations.service");
const property_entity_1 = require("../properties/property.entity");
const property_booking_entity_1 = require("../properties/property-booking.entity");
const property_purchase_entity_1 = require("../properties/entities/property-purchase.entity");
const user_entity_1 = require("../users/entities/user.entity");
let RecommendationsModule = class RecommendationsModule {
};
exports.RecommendationsModule = RecommendationsModule;
exports.RecommendationsModule = RecommendationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                property_entity_1.Property,
                property_booking_entity_1.PropertyBooking,
                property_purchase_entity_1.PropertyPurchase,
                user_entity_1.User,
            ]),
        ],
        controllers: [recommendations_controller_1.RecommendationsController],
        providers: [recommendations_service_1.RecommendationsService],
        exports: [recommendations_service_1.RecommendationsService],
    })
], RecommendationsModule);
//# sourceMappingURL=recommendations.module.js.map