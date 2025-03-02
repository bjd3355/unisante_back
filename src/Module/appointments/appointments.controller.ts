import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
  } from '@nestjs/common';
  import { AppointmentsService } from './appointments.service';
  import { CreateAppointmentDto } from './dto/create-appointment.dto';
  import { UpdateAppointmentDto } from './dto/update-appointment.dto';
  
  @Controller('appointments')
  export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}
  
    @Get()
    findAll() {
      return this.appointmentsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.appointmentsService.findOne(id);
    }
  
    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
      return this.appointmentsService.create(createAppointmentDto);
    }
  
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
      return this.appointmentsService.update(id, updateAppointmentDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.appointmentsService.remove(id);
    }
  }
  