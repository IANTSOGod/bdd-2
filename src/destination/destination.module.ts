import { Module } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';

@Module({
  providers: [DestinationService, PrismaService, ImageService],
  controllers: [DestinationController],
})
export class DestinationModule {}
