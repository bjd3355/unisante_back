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
import { PharmaciesService } from './pharmacies.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

@Controller('pharmacies')
export class PharmaciesController {
  constructor(private readonly pharmaciesService: PharmaciesService) {}

  @Get()
  findAll() {
    return this.pharmaciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pharmaciesService.findOne(id);
  }

  @Post()
  create(@Body() createPharmacyDto: CreatePharmacyDto) {
    return this.pharmaciesService.create(createPharmacyDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ) {
    return this.pharmaciesService.update(id, updatePharmacyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmaciesService.remove(id);
  }
}
