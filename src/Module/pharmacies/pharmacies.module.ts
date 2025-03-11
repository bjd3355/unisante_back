import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy } from './pharmacy.entity';
import { PharmacyService } from './pharmacies.service';
import { PharmacyController } from './pharmacies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy])],
  providers: [PharmacyService],
  controllers: [PharmacyController],
  exports: [PharmacyService],
})
export class PharmaciesModule {}
