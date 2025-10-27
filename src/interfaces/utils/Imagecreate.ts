import { IsNotEmpty } from 'class-validator';

export class ImageCreate {
  @IsNotEmpty({ message: 'Fichier non vide' })
  file: Express.Multer.File;
}
