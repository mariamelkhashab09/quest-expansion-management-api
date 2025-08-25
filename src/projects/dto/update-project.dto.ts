import { IsNumber, IsPositive, IsArray, IsOptional, Min, Max } from 'class-validator';
import { MIN_BUDGET, MAX_BUDGET } from '../../config/constants';

export class UpdateProjectDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  countryId?: number;

  @IsOptional()
  @IsNumber()
  @Min(MIN_BUDGET, { message: `Budget must be at least $${MIN_BUDGET.toLocaleString()}` })
  @Max(MAX_BUDGET, { message: `Budget cannot exceed $${MAX_BUDGET.toLocaleString()}` })
  budget?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  statusId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];
}