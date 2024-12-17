import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'User name must be a string.' })
  @IsNotEmpty({ message: 'User name is required.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
