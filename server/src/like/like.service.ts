import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: DatabaseService) {}

  async likePost(data: CreateLikeDto) {
    return this.prisma.like.create({ data });
  }

  async unlikePost(postId: number, userId: number) {
    return this.prisma.like.delete({
      where: { userId_postId: { postId, userId } },
    });
  }
}
