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
    const newimage = await this.prismaservice.image.create({
      data: {
        url: `http://localhost:3000/data/images/${data.file.filename}`,
      },
    });
    if (newimage) {
      return newimage;
    } else {
      throw new InternalServerErrorException({ message: "erreur d'upload" });
    }
  }
}
