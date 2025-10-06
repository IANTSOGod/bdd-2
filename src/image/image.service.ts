import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ImageCreate } from 'src/interfaces/utils/Imagecreate';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prismaservice: PrismaService) {}

  async getlist() {
    const images = await this.prismaservice.image.findMany({});
    if (images.length > 0) {
      return images;
    } else {
      throw new NotFoundException({ message: 'Aucune image actuellement' });
    }
  }

  async createimage(data: ImageCreate) {
    try {
      const newimage = await this.prismaservice.image.create({
        data: {
          url: data.url,
          tourid: data.tourid ? data.tourid : null,
        },
      });
      return newimage;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ message: 'Erreur upload' });
    }
  }
}
