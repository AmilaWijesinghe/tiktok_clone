import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createWriteStream } from 'fs';
import { extname } from 'path';
import { DatabaseService } from 'src/database/database.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from '@prisma/client';
import { PostDetails, PostType } from './post.type';

@Injectable()
export class PostService {
  constructor(private readonly prisma: DatabaseService) {}

  async saveVideo(video: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }): Promise<string> {
    if (!video || !['video/mp4'].includes(video.mimetype)) {
      throw new BadRequestException(
        'Invalid video file format. Only MP4 is allowed.',
      );
    }

    const videoName = `${Date.now()}${extname(video.filename)}`;
    const videoPath = `/files/${videoName}`;

    const stream = video.createReadStream();
    const outputPath = `public${videoPath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return videoPath;
  }

  async createPost(data: CreatePostInput): Promise<Post> {
    return await this.prisma.post.create({
      data: data,
    });
  }

  async getPostById(id: number): Promise<PostDetails> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: { user: true, likes: true, comments: true },
      });
      // get all other post ids of the user with the post above
      const postIds = await this.prisma.post.findMany({
        where: { userId: post.userId },
        select: { id: true },
      });

      return { ...post, otherPostIds: postIds.map((post) => post.id) };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // get posts
  async getPosts(skip: number, take: number): Promise<PostType[]> {
    try {
      return await this.prisma.post.findMany({
        skip,
        take,
        include: { user: true, likes: true, comments: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // get all the posts of a user
  async getPostsByUserId(userId: number): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.getPostById(id);

    if (post.video) {
      // Delete the video file from /files/ directory
      try {
        const fs = await import('fs');
        fs.unlinkSync(`public${post.video}`);
      } catch (err) {
        console.error(`Failed to delete video file: ${post.video}`, err);
      }
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
