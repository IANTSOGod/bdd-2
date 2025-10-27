import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { RedisModule } from './redis/redis.module';
import { DestinationModule } from './destination/destination.module';
import { ImageModule } from './image/image.module';
import { TourModule } from './tour/tour.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    DestinationModule,
    ImageModule,
    TourModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
