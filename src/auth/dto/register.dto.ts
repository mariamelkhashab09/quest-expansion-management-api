import { IsEmail, IsString, MinLength, IsNumber, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  roleId: number;

  // Optional client fields - when provided, creates a client profile
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}