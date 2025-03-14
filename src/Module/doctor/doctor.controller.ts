import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, NotFoundException, UnauthorizedException, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DoctorService } from '../doctor/doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './doctor.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ton guard JWT
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDoctorProfile(@Param('id') id: string, @Req() req: Request): Promise<Doctor> {
    const loggedUserId = (req as any).user?.id;
    console.log('ID passé dans l\'URL:', id, 'ID dans le token:', loggedUserId);
    if (+id !== loggedUserId) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à accéder à ces informations.");
    }
    const doctor2 = await this.doctorService.findByUserId(+id);
    if (!doctor2) {
      throw new NotFoundException(`doctor introuvable pour l'utilisateur d'id ${id}`);
    }
    return doctor2;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  // Endpoint pour l'upload de l'image
    @Post(':id/upload-image')
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/doctors',
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
      const imageUrl = `/uploads/doctors/${file.filename}`;
    
      const updatedDoctor = await this.doctorService.updateImage(id, imageUrl);
      return { image: imageUrl };
    }
    
    // Vous pouvez aussi ajouter d'autres endpoints comme pour la suppression de l'image
    @Put(':id/image')
    async updateImage(
      @Param('id') id: number,
      @Body() body: { image: string },
    ) {
      const updatedDoctor = await this.doctorService.updateImage(id, body.image);
      return { image: updatedDoctor.image };
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
