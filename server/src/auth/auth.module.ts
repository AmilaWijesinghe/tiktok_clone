import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AuthService, JwtService, DatabaseService, ConfigService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
