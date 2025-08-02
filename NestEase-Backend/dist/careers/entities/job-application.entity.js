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
exports.JobApplication = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["REVIEWING"] = "reviewing";
    ApplicationStatus["INTERVIEW"] = "interview";
    ApplicationStatus["HIRED"] = "hired";
    ApplicationStatus["REJECTED"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
let JobApplication = class JobApplication {
};
exports.JobApplication = JobApplication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobApplication.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobApplication.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], JobApplication.prototype, "coverLetter", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "resumeUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "portfolioUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "linkedinUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "githubUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "expectedSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "noticePeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING
    }),
    __metadata("design:type", String)
], JobApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobApplication.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobApplication.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobApplication.prototype, "updatedAt", void 0);
exports.JobApplication = JobApplication = __decorate([
    (0, typeorm_1.Entity)('job_applications')
], JobApplication);
//# sourceMappingURL=job-application.entity.js.map