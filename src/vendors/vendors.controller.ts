import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VendorsService } from './services';
import { CreateVendorDto, UpdateVendorDto, VendorQueryDto } from './dto';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { 
  ApiCreateVendor, 
  ApiGetVendors, 
  ApiGetVendor, 
  ApiUpdateVendor, 
  ApiDeleteVendor 
} from './decorators';
import { Vendor } from '../database/entities';

@ApiTags('vendors')
@Controller('vendors')
@UseGuards(RolesGuard)
@Roles('admin')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiCreateVendor()
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiGetVendors()
  async findAll(
    @Query() query: VendorQueryDto,
  ): Promise<{ vendors: Vendor[]; total: number; page: number; limit: number }> {
    const { vendors, total } = await this.vendorsService.findAll(query);
    
    return {
      vendors,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }



  @Get(':id')
  @ApiGetVendor()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vendor> {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateVendor()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @ApiDeleteVendor()
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.vendorsService.remove(id);
    return { message: 'Vendor deleted successfully' };
  }
}