"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const public_stats_controller_1 = require("./public-stats.controller");
const admin_service_1 = require("./admin.service");
const user_entity_1 = require("../users/entities/user.entity");
const property_entity_1 = require("../properties/property.entity");
const service_provider_entity_1 = require("../service-providers/entities/service-provider.entity");
const save_and_swap_entity_1 = require("../save-and-swap/entities/save-and-swap.entity");
const add_swap_entity_1 = require("../add-swap/entities/add-swap.entity");
const sell_entity_1 = require("../sell/sell.entity");
const item_offer_entity_1 = require("../offer/entities/item-offer.entity");
const job_application_entity_1 = require("../careers/entities/job-application.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                property_entity_1.Property,
                service_provider_entity_1.ServiceProvider,
                save_and_swap_entity_1.SaveAndSwap,
                add_swap_entity_1.AddSwap,
                sell_entity_1.SellProduct,
                item_offer_entity_1.ItemOffer,
                job_application_entity_1.JobApplication,
            ]),
        ],
        controllers: [admin_controller_1.AdminController, public_stats_controller_1.PublicStatsController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map