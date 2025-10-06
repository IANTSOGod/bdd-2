import { IsNotEmpty } from 'class-validator';

export class DestinationCreate {
  @IsNotEmpty({ message: 'Titre non vide' })
  title: string;
  @IsNotEmpty({ message: 'Description non vide' })
  description: string;
  @IsNotEmpty({ message: 'Image non vide' })
  img: string;
}
