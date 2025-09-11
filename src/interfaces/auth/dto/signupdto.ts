import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class Signupdto {
  @IsNotEmpty({ message: 'User must have a name' })
  fname: string;
  @IsOptional()
  lname?: string;
  @IsNotEmpty({ message: 'Email is not empty' })
  @IsEmail({}, { message: 'Not a valid email' })
  email: string;
  @IsNotEmpty({ message: 'Password must be not null' })
  @IsStrongPassword(
    {},
    { message: 'Password must 8 letters long with Caps and Special chars' },
  )
  password: string;
}
