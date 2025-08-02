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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const property_entity_1 = require("../../properties/property.entity");
const service_provider_entity_1 = require("../../service-providers/entities/service-provider.entity");
const save_and_swap_entity_1 = require("../../save-and-swap/entities/save-and-swap.entity");
const address_entity_1 = require("./address.entity");
const connected_account_entity_1 = require("./connected-account.entity");
const notification_entity_1 = require("./notification.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'user' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "emailNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "smsNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "showProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "customization", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, property => property.owner),
    __metadata("design:type", Array)
], User.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_provider_entity_1.ServiceProvider, serviceProvider => serviceProvider.owner),
    __metadata("design:type", Array)
], User.prototype, "serviceProviders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => save_and_swap_entity_1.SaveAndSwap, saveAndSwap => saveAndSwap.user),
    __metadata("design:type", Array)
], User.prototype, "saveAndSwaps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => address_entity_1.Address, address => address.user),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => connected_account_entity_1.ConnectedAccount, connectedAccount => connectedAccount.user),
    __metadata("design:type", Array)
], User.prototype, "connectedAccounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map