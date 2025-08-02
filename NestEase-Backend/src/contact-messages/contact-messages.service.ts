import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage, ContactMessageStatus } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ReplyContactMessageDto } from './dto/reply-contact-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactMessagesService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactMessageRepository: Repository<ContactMessage>,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto): Promise<ContactMessage> {
    const contactMessage = this.contactMessageRepository.create(createContactMessageDto);
    return await this.contactMessageRepository.save(contactMessage);
  }

  async findAll(): Promise<ContactMessage[]> {
    return await this.contactMessageRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<ContactMessage> {
    const contactMessage = await this.contactMessageRepository.findOne({ where: { id } });
    if (!contactMessage) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
    return contactMessage;
  }

  async markAsRead(id: number): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    contactMessage.status = ContactMessageStatus.READ;
    return await this.contactMessageRepository.save(contactMessage);
  }

  async reply(id: number, replyDto: ReplyContactMessageDto, adminName: string): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    
    contactMessage.adminReply = replyDto.reply;
    contactMessage.repliedBy = adminName;
    contactMessage.repliedAt = new Date();
    contactMessage.status = ContactMessageStatus.REPLIED;

    // Send email to the user
    await this.sendReplyEmail(contactMessage);

    return await this.contactMessageRepository.save(contactMessage);
  }

  async close(id: number): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    contactMessage.status = ContactMessageStatus.CLOSED;
    return await this.contactMessageRepository.save(contactMessage);
  }

  async delete(id: number): Promise<void> {
    const result = await this.contactMessageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }
  }

  async getStats() {
    const total = await this.contactMessageRepository.count();
    const pending = await this.contactMessageRepository.count({ where: { status: ContactMessageStatus.PENDING } });
    const read = await this.contactMessageRepository.count({ where: { status: ContactMessageStatus.READ } });
    const replied = await this.contactMessageRepository.count({ where: { status: ContactMessageStatus.REPLIED } });
    const closed = await this.contactMessageRepository.count({ where: { status: ContactMessageStatus.CLOSED } });

    return {
      total,
      pending,
      read,
      replied,
      closed
    };
  }

  private async sendReplyEmail(contactMessage: ContactMessage): Promise<void> {
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
    } catch (error) {
      console.error('Failed to send reply email:', error);
      // Don't throw error to avoid breaking the reply functionality
    }
  }
} 