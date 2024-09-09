import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    return this.databaseService.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.databaseService.product.findMany();
  }
}
