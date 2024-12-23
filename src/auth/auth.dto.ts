import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    default: 'user@example.com',
  })
  @IsString({ message: 'User name must be a string.' })
  @IsNotEmpty({ message: 'User name is required.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    default: 'password123',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

export class LogoutDto {
  @ApiProperty({
    example: 'token',
    description: 'The token of the user',
    default: 'token',
  })
  @IsString({ message: 'Token must be a string.' })
  @IsNotEmpty({ message: 'Token is required.' })
  token: string;
}
