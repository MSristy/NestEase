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
exports.ContactMessage = exports.ContactMessageStatus = void 0;
const typeorm_1 = require("typeorm");
var ContactMessageStatus;
(function (ContactMessageStatus) {
    ContactMessageStatus["PENDING"] = "pending";
    ContactMessageStatus["READ"] = "read";
    ContactMessageStatus["REPLIED"] = "replied";
    ContactMessageStatus["CLOSED"] = "closed";
})(ContactMessageStatus || (exports.ContactMessageStatus = ContactMessageStatus = {}));
let ContactMessage = class ContactMessage {
};
exports.ContactMessage = ContactMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContactMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactMessage.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ContactMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContactMessageStatus,
        default: ContactMessageStatus.PENDING
    }),
    __metadata("design:type", String)
], ContactMessage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], ContactMessage.prototype, "adminReply", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactMessage.prototype, "repliedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ContactMessage.prototype, "repliedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactMessage.prototype, "updatedAt", void 0);
exports.ContactMessage = ContactMessage = __decorate([
    (0, typeorm_1.Entity)('contact_form_messages')
], ContactMessage);
//# sourceMappingURL=contact-message.entity.js.map