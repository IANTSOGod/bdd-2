import { IsNotEmpty, IsOptional } from 'class-validator';

export class ImageCreate {
  @IsNotEmpty({ message: 'url non vide' })
  url: string;
  @IsOptional({})
  tourid?: string;
}
