import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, NotFoundException, UnauthorizedException, Req } from '@nestjs/common';
import { DoctorService } from '../doctor/doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './doctor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ton guard JWT
import { Request } from 'express';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getPatientProfile(@Param('id') id: string, @Req() req: Request): Promise<Doctor> {
      // Optionnel : vérifier que l'utilisateur connecté correspond à l'id passé
      const loggedUserId = (req as any).user?.id; // Le guard doit ajouter req.user
      if (+id !== loggedUserId) {
        throw new UnauthorizedException("Vous n'êtes pas autorisé à accéder à ces informations.");
      }
      const patient = await this.doctorService.findByUserId(+id);
      if (!patient) {
        throw new NotFoundException(`Patient introuvable pour l'utilisateur d'id ${id}`);
      }
      return patient;
    }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.doctorService.remove(id);
  }
}
