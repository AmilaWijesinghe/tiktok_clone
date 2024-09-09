import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      role: 'user',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      password: 'password123',
      role: 'user',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      password: 'password123',
      role: 'admin',
    },
  ];

  findAllByQuery(role?: 'admin' | 'user') {
    if (role) {
      const roleArray = this.users.filter((user) => user.role === role);
      if (!roleArray.length) throw new NotFoundException('User not found');
      return roleArray;
    } else {
      return this.users;
    }
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(user: CreateUserDto) {
    const userHightId = this.users.reduce(
      (max, user) => Math.max(max, user.id),
      0,
    );
    const newUser = {
      id: userHightId + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updatedUser: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updatedUser };
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
