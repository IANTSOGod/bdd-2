import { IsNotEmpty } from 'class-validator';

export class sessiondto {
  @IsNotEmpty({ message: 'Token non vide' })
  token: string;
  @IsNotEmpty({ message: 'Ip non null' })
  ipAddress: string;
  userId: string;
}
