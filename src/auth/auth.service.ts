import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Role, Client } from '../database/entities';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from './interfaces';
import { saltRounds } from '../config/constants';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; client?: Client }> {
    const { email, password, roleId, companyName, contactEmail } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Use transaction to ensure atomicity
    return await this.dataSource.transaction(async (manager) => {
      // Create user within transaction
      const user = manager.create(User, {
        email,
        password: hashedPassword,
        roleId,
        isActive: true,
      });

      const savedUser = await manager.save(User, user);

      // If user is registering as a client role, create client profile
      let savedClient: Client | undefined;
      if (role.name === 'client') {
        const client = manager.create(Client, {
          userId: savedUser.id,
          companyName: companyName || '',
          contactEmail: contactEmail || '',
        });

        savedClient = await manager.save(Client, client);
      }

      return { user: savedUser, client: savedClient };
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    // Find user with role
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    return this.jwtService.sign(payload);

  }

  async validateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

}