import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserResolver,
    UserService,
    AuthService,
    JwtService,
    ConfigService,
  ],
})
export class UserModule {}
