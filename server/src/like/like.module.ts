import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [
    LikeResolver,
    LikeService,
    GraphqlAuthGuard,
    ConfigService,
    JwtService,
  ],
})
export class LikeModule {}
