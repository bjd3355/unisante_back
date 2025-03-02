import { IsString, IsOptional } from 'class-validator';

export class UpdateSpecialtyDto {
  @IsOptional()
  @IsString()
  name?: string;
}
