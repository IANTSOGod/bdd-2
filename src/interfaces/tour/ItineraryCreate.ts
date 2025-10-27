import { IsNotEmpty } from 'class-validator';

export class ItineraryCreate {
  @IsNotEmpty({ message: 'Nom itineraire non vide' })
  name: string;
}
