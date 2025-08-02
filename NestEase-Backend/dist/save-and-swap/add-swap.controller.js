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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSwapController = exports.CreateAddSwapDto = void 0;
const common_1 = require("@nestjs/common");
const add_swap_service_1 = require("./add-swap.service");
// src/swap/dto/create-add-swap.dto.ts
class CreateAddSwapDto {
}
exports.CreateAddSwapDto = CreateAddSwapDto;
let AddSwapController = class AddSwapController {
    constructor(addSwapService) {
        this.addSwapService = addSwapService;
    }
    async create(createAddSwapDto) {
        try {
            // Validate required fields
            const requiredFields = [
                'title',
                'category',
                'item_condition',
                'description',
                'location'
            ];
            for (const field of requiredFields) {
                if (!createAddSwapDto[field]) {
                    throw new common_1.BadRequestException(`Missing required field: ${field}`);
                }
            }
            return await this.addSwapService.create(createAddSwapDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message || 'Failed to create swap item');
        }
    }
};
exports.AddSwapController = AddSwapController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAddSwapDto]),
    __metadata("design:returntype", Promise)
], AddSwapController.prototype, "create", null);
exports.AddSwapController = AddSwapController = __decorate([
    (0, common_1.Controller)('add-swap'),
    __metadata("design:paramtypes", [add_swap_service_1.AddSwapService])
], AddSwapController);
//# sourceMappingURL=add-swap.controller.js.map