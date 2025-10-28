import { IsNotEmpty } from 'class-validator';

export class FunctionnalityCreate {
  @IsNotEmpty({ message: 'Nom non vide' })
  name: string;
}
