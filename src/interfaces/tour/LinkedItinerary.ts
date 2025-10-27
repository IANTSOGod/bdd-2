import { IsNotEmpty, IsOptional } from 'class-validator';

export class LinkedItinerary {
  @IsNotEmpty({ message: 'Id tour non vide' })
  tour_id: string;
  @IsNotEmpty({ message: 'Itinerary id non vide' })
  itinerary_id: string;
  @IsOptional()
  day: number;
  @IsOptional()
  night: number;
  @IsOptional()
  hours: number;
}
