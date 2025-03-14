import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, NotFoundException, UnauthorizedException, Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { PatientService } from '../patient/patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ton guard JWT
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  async getPatient(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<Patient> {
    const user = (req as any).user;
    console.log("🔍 Utilisateur connecté :", user);

    // Vérifier si l'utilisateur est un docteur
    if (user.role === "doctor") {
      const patient = await this.patientService.findOne(id);
      if (!patient) {
        throw new NotFoundException(`Patient introuvable pour l'id ${id}`);
      }
      return patient;
    }

    // Vérifier si c'est le patient lui-même
    if (user.id === id) {
      return this.patientService.findByUserId(id);
    }

    throw new UnauthorizedException("Vous n'êtes pas autorisé à accéder à ces informations.");
  }


  @Post()
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(createPatientDto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  // Endpoint pour l'upload de l'image
  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/patients',
      filename: (req, file, callback) => {
        // Génère un nom de fichier unique en conservant l'extension originale
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = extname(file.originalname); // récupère l'extension (.jpg, .png, etc.)
        callback(null, `${uniqueSuffix}${extension}`);
      },
    }),
  }))
  async uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException('Aucun fichier reçu');
    }
  
    // Assurez-vous que l'URL correspond bien au chemin statique
    const imageUrl = `/uploads/patients/${file.filename}`;
  
    const updatedPatient = await this.patientService.updateImage(id, imageUrl);
    return { image: imageUrl };
  }
  
  // Vous pouvez aussi ajouter d'autres endpoints comme pour la suppression de l'image
  @Put(':id/image')
  async updateImage(
    @Param('id') id: number,
    @Body() body: { image: string },
  ) {
    const updatedPatient = await this.patientService.updateImage(id, body.image);
    return { image: updatedPatient.image };
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
