"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSwapModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const add_swap_controller_1 = require("./add-swap.controller");
const add_swap_service_1 = require("./add-swap.service");
const add_swap_entity_1 = require("../entities/add-swap.entity");
let AddSwapModule = class AddSwapModule {
};
exports.AddSwapModule = AddSwapModule;
exports.AddSwapModule = AddSwapModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([add_swap_entity_1.AddSwap])],
        controllers: [add_swap_controller_1.AddSwapController],
        providers: [add_swap_service_1.AddSwapService],
        exports: [add_swap_service_1.AddSwapService],
    })
], AddSwapModule);
//# sourceMappingURL=add-swap.module.js.map