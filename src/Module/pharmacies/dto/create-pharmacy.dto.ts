import { IsString } from 'class-validator';

export class CreatePharmacyDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;
}
