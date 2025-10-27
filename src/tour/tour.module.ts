import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  providers: [TourService, PrismaService],
  controllers: [TourController],
})
export class TourModule {}
