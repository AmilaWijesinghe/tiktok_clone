import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreatePostInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsString()
  video: string;
}
