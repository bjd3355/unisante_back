import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':patientId')
  async getMessages(@Param('patientId') patientId: number) {
    return this.messagesService.getMessagesByPatient(patientId);
  }

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(createMessageDto);
  }
}
