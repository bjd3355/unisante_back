import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './messages.entity';
import { Patient } from '../patient/patient.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Message, Patient])],
    providers: [MessagesService],
    controllers: [MessagesController],
    exports: [MessagesService]
})
export class MessagesModule {}
