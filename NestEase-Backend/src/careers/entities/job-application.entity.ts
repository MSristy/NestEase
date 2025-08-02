import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEW = 'interview',
  HIRED = 'hired',
  REJECTED = 'rejected'
}

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column('text')
  coverLetter: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  skills: string;

  @Column({ nullable: true })
  expectedSalary: string;

  @Column({ nullable: true })
  noticePeriod: string;

  @Column({ nullable: true })
  availability: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  adminNotes: string;

  @Column({ nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 