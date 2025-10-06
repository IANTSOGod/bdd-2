import { Body, Controller, Get, Post } from '@nestjs/common';
import { ImageCreate } from 'src/interfaces/utils/Imagecreate';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageservice: ImageService) {}

  @Get('list')
  async getimages() {
    return this.imageservice.getlist();
  }

  @Post('create')
  async createimg(@Body() body: ImageCreate) {
    return this.imageservice.createimage(body);
  }
}
