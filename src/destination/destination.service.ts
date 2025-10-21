import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ImageService } from 'src/image/image.service';
import { DestinationCreate } from 'src/interfaces/destination/Destinationcreate';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DestinationService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly imageservice: ImageService,
  ) {}

  async getdestinations() {
    const destinations = await this.prismaservice.destination.findMany({
      select: {
        title: true,
        description: true,
        has_img: {
          select: {
            url: true,
          },
        },
        has_tour: {
          select: {
            id: false,
            title: true,
            description: true,
            price: true,
            discount: true,
            rating: true,
            destination: false,
          },
        },
      },
    });

    if (destinations.length > 0) {
      return destinations;
    } else {
      throw new NotFoundException({ message: 'Aucune destination' });
    }
  }

  async createbasisDestination(data: DestinationCreate) {
    const { title, description, img } = data;
    const image = await this.imageservice.createimage({ url: img });
    if (image) {
      const destination = await this.prismaservice.destination.create({
        data: {
          title: title,
          description: description,
          has_img: {
            connect: {
              id: image.id,
            },
          },
        },
      });
      if (destination) {
        return destination;
      } else {
        throw new InternalServerErrorException({
          message: 'Erreur création destination',
        });
      }
    } else {
      throw new InternalServerErrorException({
        message: 'Erreur upload image',
      });
    }
  }
}
