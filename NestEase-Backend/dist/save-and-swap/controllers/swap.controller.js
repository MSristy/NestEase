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
exports.SwapController = void 0;
const common_1 = require("@nestjs/common");
const swap_service_1 = require("../services/swap.service");
const create_swap_item_dto_1 = require("../dto/create-swap-item.dto");
const create_swap_request_dto_1 = require("../dto/create-swap-request.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const role_enum_1 = require("../../users/role.enum");
let SwapController = class SwapController {
    constructor(swapService) {
        this.swapService = swapService;
    }
    createSwapItem(createDto, req) {
        const userId = req.user.id;
        return this.swapService.createSwapItem(createDto, userId);
    }
    findAllSwapItems() {
        return this.swapService.findAllSwapItems();
    }
    findOneSwapItem(id) {
        return this.swapService.findOneSwapItem(id);
    }
    createSwapRequest(createDto, req) {
        const userId = req.user.id;
        return this.swapService.createSwapRequest(createDto, userId);
    }
    acceptSwapRequest(id, req) {
        const userId = req.user.id;
        return this.swapService.acceptSwapRequest(id, userId);
    }
    rejectSwapRequest(id, req) {
        const userId = req.user.id;
        return this.swapService.rejectSwapRequest(id, userId);
    }
    findAllSwapRequests(req) {
        const userId = req.user.id;
        return this.swapService.findAllSwapRequests(userId);
    }
    completeSwap(id, req) {
        const userId = req.user.id;
        return this.swapService.completeSwap(id, userId);
    }
};
exports.SwapController = SwapController;
__decorate([
    (0, common_1.Post)('items'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_swap_item_dto_1.CreateSwapItemDto, Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "createSwapItem", null);
__decorate([
    (0, common_1.Get)('items'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "findAllSwapItems", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "findOneSwapItem", null);
__decorate([
    (0, common_1.Post)('requests'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_swap_request_dto_1.CreateSwapRequestDto, Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "createSwapRequest", null);
__decorate([
    (0, common_1.Patch)('requests/:id/accept'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "acceptSwapRequest", null);
__decorate([
    (0, common_1.Patch)('requests/:id/reject'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "rejectSwapRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "findAllSwapRequests", null);
__decorate([
    (0, common_1.Patch)('requests/:id/complete'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.USER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SwapController.prototype, "completeSwap", null);
exports.SwapController = SwapController = __decorate([
    (0, common_1.Controller)('swap'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [swap_service_1.SwapService])
], SwapController);
//# sourceMappingURL=swap.controller.js.map