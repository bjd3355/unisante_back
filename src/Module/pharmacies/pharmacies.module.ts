import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy } from './pharmacy.entity';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesController } from './pharmacies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy])],
  providers: [PharmaciesService],
  controllers: [PharmaciesController],
  exports: [PharmaciesService],
})
export class PharmaciesModule {}
