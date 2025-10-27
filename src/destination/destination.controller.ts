import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DestinationService } from './destination.service';
@Controller('destination')
export class DestinationController {
  constructor(private readonly destinationservice: DestinationService) {}

  @Get('list')
  async getdestinationlist() {
    return this.destinationservice.getdestinations();
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createdestination(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description: string },
  ) {
    const { title, description } = body;
    return this.destinationservice.createbasisDestination({
      title: title,
      description: description,
      img: file,
    });
  }
}
