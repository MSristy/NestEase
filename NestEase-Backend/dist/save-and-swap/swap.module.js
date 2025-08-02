"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const swap_item_entity_1 = require("./entities/swap-item.entity");
const swap_request_entity_1 = require("./entities/swap-request.entity");
const swap_controller_1 = require("./controllers/swap.controller");
const swap_service_1 = require("./services/swap.service");
const stripe_module_1 = require("../payment/stripe.module");
let SwapModule = class SwapModule {
};
exports.SwapModule = SwapModule;
exports.SwapModule = SwapModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([swap_item_entity_1.SwapItem, swap_request_entity_1.SwapRequest]),
            stripe_module_1.StripeModule
        ],
        controllers: [swap_controller_1.SwapController],
        providers: [swap_service_1.SwapService],
        exports: [swap_service_1.SwapService]
    })
], SwapModule);
//# sourceMappingURL=swap.module.js.map