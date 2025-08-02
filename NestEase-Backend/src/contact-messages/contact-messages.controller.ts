import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ReplyContactMessageDto } from './dto/reply-contact-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('contact-messages')
export class ContactMessagesController {
  constructor(private readonly contactMessagesService: ContactMessagesService) {}

  // Public endpoint for submitting contact form
  @Post()
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactMessagesService.create(createContactMessageDto);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.contactMessagesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats')
  getStats() {
    return this.contactMessagesService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactMessagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactMessagesService.markAsRead(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/reply')
  reply(
    @Param('id') id: string,
    @Body() replyDto: ReplyContactMessageDto,
    @Request() req: any
  ) {
    const adminName = req.user.name || 'Admin';
    return this.contactMessagesService.reply(+id, replyDto, adminName);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/close')
  close(@Param('id') id: string) {
    return this.contactMessagesService.close(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactMessagesService.delete(+id);
  }
} 