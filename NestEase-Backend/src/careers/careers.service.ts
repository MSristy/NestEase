import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { NotificationService } from '../users/notification.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    private notificationService: NotificationService,
    private usersService: UsersService,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto): Promise<JobApplication> {
    const application = this.jobApplicationRepository.create(createJobApplicationDto);
    return await this.jobApplicationRepository.save(application);
  }

  async findAll(): Promise<JobApplication[]> {
    return await this.jobApplicationRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException(`Job application with ID ${id} not found`);
    }
    return application;
  }

  async updateStatus(id: number, status: ApplicationStatus, adminNotes?: string, rejectionReason?: string): Promise<JobApplication> {
    const application = await this.findOne(id);
    application.status = status;
    if (adminNotes) application.adminNotes = adminNotes;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    const updated = await this.jobApplicationRepository.save(application);

    // Send interview notification if status is set to 'interview'
    if (status === ApplicationStatus.INTERVIEW) {
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
        await this.notificationService.createInterviewNotification(
          user.id,
          application.position,
          application.department,
          interviewDate,
          interviewTime,
          interviewLocation,
          interviewType,
          adminNotes
        );
      }
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const application = await this.findOne(id);
    await this.jobApplicationRepository.remove(application);
  }

  async getStats() {
    const [total, pending, reviewing, interview, hired, rejected] = await Promise.all([
      this.jobApplicationRepository.count(),
      this.jobApplicationRepository.count({ where: { status: ApplicationStatus.PENDING } }),
      this.jobApplicationRepository.count({ where: { status: ApplicationStatus.REVIEWING } }),
      this.jobApplicationRepository.count({ where: { status: ApplicationStatus.INTERVIEW } }),
      this.jobApplicationRepository.count({ where: { status: ApplicationStatus.HIRED } }),
      this.jobApplicationRepository.count({ where: { status: ApplicationStatus.REJECTED } }),
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
} 