import { IsNotEmpty } from 'class-validator';

export class JwtverifDto {
  @IsNotEmpty({ message: 'Id non vide' })
  id: string;
}
