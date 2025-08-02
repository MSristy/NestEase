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
exports.SaveAndSwapController = void 0;
const common_1 = require("@nestjs/common");
const save_and_swap_service_1 = require("./save-and-swap.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SaveAndSwapController = class SaveAndSwapController {
    constructor(saveAndSwapService) {
        this.saveAndSwapService = saveAndSwapService;
    }
    create(createSaveAndSwapDto) {
        return this.saveAndSwapService.create(createSaveAndSwapDto);
    }
    findAll() {
        return this.saveAndSwapService.findAll();
    }
    findOne(id) {
        return this.saveAndSwapService.findOne(+id);
    }
    update(id, updateSaveAndSwapDto) {
        return this.saveAndSwapService.update(+id, updateSaveAndSwapDto);
    }
    remove(id) {
        return this.saveAndSwapService.remove(+id);
    }
    completeSaveAndSwap(id) {
        return this.saveAndSwapService.completeSaveAndSwap(+id);
    }
    getSaveAndSwapsByUser(userId) {
        return this.saveAndSwapService.getSaveAndSwapsByUser(+userId);
    }
    getSaveAndSwapsByProperty(propertyId) {
        return this.saveAndSwapService.getSaveAndSwapsByProperty(propertyId);
    }
};
exports.SaveAndSwapController = SaveAndSwapController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "completeSaveAndSwap", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "getSaveAndSwapsByUser", null);
__decorate([
    (0, common_1.Get)('property/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SaveAndSwapController.prototype, "getSaveAndSwapsByProperty", null);
exports.SaveAndSwapController = SaveAndSwapController = __decorate([
    (0, common_1.Controller)('save-and-swap'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [save_and_swap_service_1.SaveAndSwapService])
], SaveAndSwapController);
//# sourceMappingURL=save-and-swap.controller.js.map