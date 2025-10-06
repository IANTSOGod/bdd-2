import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  providers: [ImageService, PrismaService],
  controllers: [ImageController],
})
export class ImageModule {}
