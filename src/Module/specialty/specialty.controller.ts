import { Controller, Get, Post, Put, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SpecialtyService } from '../specialty/specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Specialty } from './specialty.entity';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get()
  async findAll(): Promise<Specialty[]> {
    return this.specialtyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Specialty> {
    return this.specialtyService.findOne(id);
  }

  @Post()
  async create(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty> {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty> {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.specialtyService.remove(id);
  }
}
