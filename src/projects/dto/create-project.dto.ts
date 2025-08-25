import { IsNumber, IsPositive, IsArray, IsOptional, ArrayNotEmpty, Min, Max } from 'class-validator';
import { MIN_BUDGET, MAX_BUDGET } from '../../config/constants';

export class CreateProjectDto {
  @IsNumber()
  @IsPositive()
  countryId: number;

  @IsNumber()
  @Min(MIN_BUDGET, { message: `Budget must be at least $${MIN_BUDGET.toLocaleString()}` })
  @Max(MAX_BUDGET, { message: `Budget cannot exceed $${MAX_BUDGET.toLocaleString()}` })
  budget: number;

  @IsNumber()
  @IsPositive()
  statusId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  serviceIds: number[];
}