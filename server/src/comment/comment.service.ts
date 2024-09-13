import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { DatabaseService } from 'src/database/database.service';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DatabaseService) {}

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: true,
        post: true,
      },
    });
  }

  async createComment(data: CreateCommentInput): Promise<Comment> {
    console.log(data);

    return this.prisma.comment.create({
      data,
      include: {
        user: true,
        post: true,
      },
    });
  }
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NotFoundException(
        `Comment with ID ${commentId} does not exist`,
      );
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to delete this comment",
      );
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
