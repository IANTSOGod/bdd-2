import { IsNotEmpty } from 'class-validator';

export class Tourbasic {
  @IsNotEmpty({ message: 'Titre non vide' })
  title: string;
  @IsNotEmpty({ message: 'Prix non vide' })
  price: number;
  @IsNotEmpty({ message: 'Destination non vide' })
  destination: string;
}
