import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class Logindto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  email: string;
  @IsNotEmpty({ message: 'Password non vide' })
  @IsStrongPassword({}, { message: 'Mot de passe trop faible' })
  password: string;
  @IsOptional()
  ip?: string;
}
