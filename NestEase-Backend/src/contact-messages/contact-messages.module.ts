import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessagesController } from './contact-messages.controller';
import { ContactMessage } from './entities/contact-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  controllers: [ContactMessagesController],
  providers: [ContactMessagesService],
  exports: [ContactMessagesService],
})
export class ContactMessagesModule {} 