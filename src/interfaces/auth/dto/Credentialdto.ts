import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class Credentialdto {
  @IsNotEmpty({ message: 'nom non vide' })
  name: string;
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  email: string;
  @IsOptional()
  image?: string;
}
