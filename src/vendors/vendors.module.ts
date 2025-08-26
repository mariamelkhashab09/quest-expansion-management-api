import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService, VendorsValidationService } from './services';
import { Vendor, Country, Service } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Country, Service])],
  controllers: [VendorsController],
  providers: [VendorsService, VendorsValidationService],
  exports: [VendorsService],
})
export class VendorsModule {}