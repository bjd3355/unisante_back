import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, NotFoundException, UnauthorizedException, Req } from '@nestjs/common';
import { PatientService } from '../patient/patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ton guard JWT
import { Request } from 'express';
import { Patient } from './patient.entity';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPatientProfile(@Param('id') id: string, @Req() req: Request): Promise<Patient> {
    // Optionnel : vérifier que l'utilisateur connecté correspond à l'id passé
    const loggedUserId = (req as any).user?.id; // Le guard doit ajouter req.user
    if (+id !== loggedUserId) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à accéder à ces informations.");
    }
    const patient = await this.patientService.findByUserId(+id);
    if (!patient) {
      throw new NotFoundException(`Patient introuvable pour l'utilisateur d'id ${id}`);
    }
    return patient;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(createPatientDto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patientService.remove(id);
  }
}
