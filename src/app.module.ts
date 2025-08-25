import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { entities } from './database/entities';
import { AuthModule, JwtGuard } from './auth';
import { ProjectsModule } from './projects/projects.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),

    // TypeORM Module - MySQL Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('config.database.host'),
        port: configService.get<number>('config.database.port'),
        username: configService.get<string>('config.database.username'),
        password: configService.get<string>('config.database.password'),
        database: configService.get<string>('config.database.name'),
        entities,
        synchronize: configService.get<boolean>('config.database.synchronize') || true,
        logging: configService.get<boolean>('config.database.logging') || false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Mongoose Module - MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('config.mongodb.uri'),
      }),
                 inject: [ConfigService],
         }),

             // Auth Module
    AuthModule,

    // Projects Module
    ProjectsModule,
  ],
       controllers: [AppController],
       providers: [
         AppService,
         // Global Validation Pipe - Validates all DTOs automatically
         {
           provide: APP_PIPE,
           useValue: new ValidationPipe({
             whitelist: true, // Strip unknown properties
             forbidNonWhitelisted: true, // Throw error on unknown properties
             transform: true, // Auto-transform payloads to DTO instances
             transformOptions: {
               enableImplicitConversion: true, // Auto-convert types
             },
           }),
         },
         
         // Global Class Serializer - Handles @Exclude() decorators
         {
           provide: APP_INTERCEPTOR,
           useClass: ClassSerializerInterceptor,
         },
       ],
     })
export class AppModule {}
