import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, Max, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  responseSlaHours: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  countryIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  serviceIds: number[];
}