import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Public, CurrentUser, Roles, ApiRegister, ApiLogin } from './decorators';
import { RolesGuard } from './guards';
import { User, Client } from '../database/entities';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiRegister()
  async register(@Body() registerDto: RegisterDto): Promise<{ user: User; client?: Client }> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const token = await this.authService.login(loginDto);
    return { accessToken: token };
  }

}
