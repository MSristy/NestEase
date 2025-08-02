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
exports.CareersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_application_entity_1 = require("./entities/job-application.entity");
const notification_service_1 = require("../users/notification.service");
const users_service_1 = require("../users/users.service");
let CareersService = class CareersService {
    constructor(jobApplicationRepository, notificationService, usersService) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.notificationService = notificationService;
        this.usersService = usersService;
    }
    async create(createJobApplicationDto) {
        const application = this.jobApplicationRepository.create(createJobApplicationDto);
        return await this.jobApplicationRepository.save(application);
    }
    async findAll() {
        return await this.jobApplicationRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const application = await this.jobApplicationRepository.findOne({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException(`Job application with ID ${id} not found`);
        }
        return application;
    }
    async updateStatus(id, status, adminNotes, rejectionReason) {
        const application = await this.findOne(id);
        application.status = status;
        if (adminNotes)
            application.adminNotes = adminNotes;
        if (rejectionReason)
            application.rejectionReason = rejectionReason;
        const updated = await this.jobApplicationRepository.save(application);
        // Send interview notification if status is set to 'interview'
        if (status === job_application_entity_1.ApplicationStatus.INTERVIEW) {
            // Find user by email
            const user = await this.usersService.findByEmail(application.email);
            if (user) {
                // Parse interview details from adminNotes (or extend to accept structured details)
                // For now, assume adminNotes contains details in a simple format
                let interviewDate = '', interviewTime = '', interviewLocation = '', interviewType = '';
                if (adminNotes) {
                    // Example: "Date: 2024-07-01, Time: 10:00 AM, Location: Office, Type: In-person"
                    const dateMatch = adminNotes.match(/Date:\s*([^,]+)/i);
                    const timeMatch = adminNotes.match(/Time:\s*([^,]+)/i);
                    const locationMatch = adminNotes.match(/Location:\s*([^,]+)/i);
                    const typeMatch = adminNotes.match(/Type:\s*([^,]+)/i);
                    interviewDate = dateMatch ? dateMatch[1].trim() : '';
                    interviewTime = timeMatch ? timeMatch[1].trim() : '';
                    interviewLocation = locationMatch ? locationMatch[1].trim() : '';
                    interviewType = typeMatch ? typeMatch[1].trim() : '';
                }
                await this.notificationService.createInterviewNotification(user.id, application.position, application.department, interviewDate, interviewTime, interviewLocation, interviewType, adminNotes);
            }
        }
        return updated;
    }
    async delete(id) {
        const application = await this.findOne(id);
        await this.jobApplicationRepository.remove(application);
    }
    async getStats() {
        const [total, pending, reviewing, interview, hired, rejected] = await Promise.all([
            this.jobApplicationRepository.count(),
            this.jobApplicationRepository.count({ where: { status: job_application_entity_1.ApplicationStatus.PENDING } }),
            this.jobApplicationRepository.count({ where: { status: job_application_entity_1.ApplicationStatus.REVIEWING } }),
            this.jobApplicationRepository.count({ where: { status: job_application_entity_1.ApplicationStatus.INTERVIEW } }),
            this.jobApplicationRepository.count({ where: { status: job_application_entity_1.ApplicationStatus.HIRED } }),
            this.jobApplicationRepository.count({ where: { status: job_application_entity_1.ApplicationStatus.REJECTED } }),
        ]);
        return {
            total,
            pending,
            reviewing,
            interview,
            hired,
            rejected,
        };
    }
};
exports.CareersService = CareersService;
exports.CareersService = CareersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_application_entity_1.JobApplication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService,
        users_service_1.UsersService])
], CareersService);
//# sourceMappingURL=careers.service.js.map