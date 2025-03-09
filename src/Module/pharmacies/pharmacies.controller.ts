import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PharmacyService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { Pharmacy } from './pharmacy.entity';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get()
  async findAll(): Promise<Pharmacy[]> {
    return this.pharmacyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pharmacy> {
    return this.pharmacyService.findOne(id);
  }

  @Post()
  async create(@Body() createPharmacyDto: CreatePharmacyDto): Promise<Pharmacy> {
    return this.pharmacyService.create(createPharmacyDto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePharmacyDto: UpdatePharmacyDto): Promise<Pharmacy> {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Get("first-two")
  async getFirstTwoPharmacies(): Promise<Pharmacy[]> {
    return this.pharmacyService.getFirstTwoPharmacies();
  }

  @Patch(':id')
  async partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() updatePharmacyDto: UpdatePharmacyDto): Promise<Pharmacy> {
    return this.pharmacyService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pharmacyService.remove(id);
  }
}
