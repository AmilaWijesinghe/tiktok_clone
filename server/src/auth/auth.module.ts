import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [AuthService, JwtService, DatabaseService, ConfigService],
})
export class AuthModule {}
