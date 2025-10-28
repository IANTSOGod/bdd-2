import { IsNotEmpty } from 'class-validator';
import { FunctionnalityAvailability } from './Functionnality_availability';

export class LinkedFunctionnality {
  @IsNotEmpty({ message: 'Tour non vide' })
  tour_id: string;
  @IsNotEmpty({ message: 'Functionnalité non vide' })
  functionnality_id: string;
  @IsNotEmpty({ message: 'Disponibilité non vide' })
  availability: FunctionnalityAvailability;
}

// en nestjs comment faire un service dont on obtient par dto un champ qui dans prisma correspond a un enum Functionnality_availability{
//   Limited_free
//   Unlimited_free
//   Paying
// }
