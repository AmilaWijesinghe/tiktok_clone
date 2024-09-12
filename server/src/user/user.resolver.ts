import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { BadRequestException, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { User } from './user.model';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }

    const { user } = await this.authService.register(registerDto, context.res);
    console.log('user!', user);
    return { user };
  }

  @Mutation(() => LoginResponse) // Adjust this return type as needed
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Query(() => String)
  async hello() {
    return 'hello world';
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
