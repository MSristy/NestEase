"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_message_entity_1 = require("./entities/contact-message.entity");
const nodemailer = __importStar(require("nodemailer"));
let ContactMessagesService = class ContactMessagesService {
    constructor(contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }
    async create(createContactMessageDto) {
        const contactMessage = this.contactMessageRepository.create(createContactMessageDto);
        return await this.contactMessageRepository.save(contactMessage);
    }
    async findAll() {
        return await this.contactMessageRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const contactMessage = await this.contactMessageRepository.findOne({ where: { id } });
        if (!contactMessage) {
            throw new common_1.NotFoundException(`Contact message with ID ${id} not found`);
        }
        return contactMessage;
    }
    async markAsRead(id) {
        const contactMessage = await this.findOne(id);
        contactMessage.status = contact_message_entity_1.ContactMessageStatus.READ;
        return await this.contactMessageRepository.save(contactMessage);
    }
    async reply(id, replyDto, adminName) {
        const contactMessage = await this.findOne(id);
        contactMessage.adminReply = replyDto.reply;
        contactMessage.repliedBy = adminName;
        contactMessage.repliedAt = new Date();
        contactMessage.status = contact_message_entity_1.ContactMessageStatus.REPLIED;
        // Send email to the user
        await this.sendReplyEmail(contactMessage);
        return await this.contactMessageRepository.save(contactMessage);
    }
    async close(id) {
        const contactMessage = await this.findOne(id);
        contactMessage.status = contact_message_entity_1.ContactMessageStatus.CLOSED;
        return await this.contactMessageRepository.save(contactMessage);
    }
    async delete(id) {
        const result = await this.contactMessageRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Contact message with ID ${id} not found`);
        }
    }
    async getStats() {
        const total = await this.contactMessageRepository.count();
        const pending = await this.contactMessageRepository.count({ where: { status: contact_message_entity_1.ContactMessageStatus.PENDING } });
        const read = await this.contactMessageRepository.count({ where: { status: contact_message_entity_1.ContactMessageStatus.READ } });
        const replied = await this.contactMessageRepository.count({ where: { status: contact_message_entity_1.ContactMessageStatus.REPLIED } });
        const closed = await this.contactMessageRepository.count({ where: { status: contact_message_entity_1.ContactMessageStatus.CLOSED } });
        return {
            total,
            pending,
            read,
            replied,
            closed
        };
    }
    async sendReplyEmail(contactMessage) {
        try {
            // Create a test account for development (replace with real SMTP config for production)
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            const mailOptions = {
                from: '"NestEase Support" <support@nestease.com>',
                to: contactMessage.email,
                subject: `Re: ${contactMessage.subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">NestEase Support</h2>
            <p>Dear ${contactMessage.name},</p>
            <p>Thank you for contacting us. Here is our response to your inquiry:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Original Message:</h3>
              <p><strong>Subject:</strong> ${contactMessage.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${contactMessage.message}</p>
            </div>
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Our Response:</h3>
              <p>${contactMessage.adminReply}</p>
            </div>
            <p>If you have any further questions, please don't hesitate to contact us again.</p>
            <p>Best regards,<br>The NestEase Team</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated response to your inquiry submitted on ${contactMessage.createdAt.toLocaleDateString()}.
            </p>
          </div>
        `,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log('Reply email sent:', info.messageId);
        }
        catch (error) {
            console.error('Failed to send reply email:', error);
            // Don't throw error to avoid breaking the reply functionality
        }
    }
};
exports.ContactMessagesService = ContactMessagesService;
exports.ContactMessagesService = ContactMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_message_entity_1.ContactMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactMessagesService);
//# sourceMappingURL=contact-messages.service.js.map