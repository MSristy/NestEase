"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveAndSwapModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const save_and_swap_controller_1 = require("./save-and-swap.controller");
const save_and_swap_service_1 = require("./save-and-swap.service");
const save_and_swap_entity_1 = require("./entities/save-and-swap.entity");
let SaveAndSwapModule = class SaveAndSwapModule {
};
exports.SaveAndSwapModule = SaveAndSwapModule;
exports.SaveAndSwapModule = SaveAndSwapModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([save_and_swap_entity_1.SaveAndSwap])],
        controllers: [save_and_swap_controller_1.SaveAndSwapController],
        providers: [save_and_swap_service_1.SaveAndSwapService],
        exports: [save_and_swap_service_1.SaveAndSwapService],
    })
], SaveAndSwapModule);
//# sourceMappingURL=save-and-swap.module.js.map