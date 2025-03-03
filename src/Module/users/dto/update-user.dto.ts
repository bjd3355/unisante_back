import { IsOptional, IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
