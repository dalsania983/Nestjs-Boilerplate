import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  Validate,
  isNumber,
  isString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'example',
    description: 'First name',
    required: true,
  })
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  first_name: string;

  @ApiProperty({ example: 'example', description: 'Last name', required: true })
  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  last_name: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email address',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'password',
    required: true,
  })
  @IsString({ message: 'Password must be a string.' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: '+918565527332',
    description: 'Phone number',
    required: true,
  })
  @IsString({ message: 'Phone number must be a string.' })
  @IsOptional()
  phone_number?: string;
}

export class GetAllUsersDto {
  @ApiProperty({ example: 1, description: 'Page Number', required: false })
  @IsOptional()
  @Validate((value) => isNumber(value) || isString(value), {
    message: 'page must be a string or a number.',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Number of users per page',
    required: false,
  })
  @IsOptional()
  @Validate((value) => isNumber(value) || isString(value), {
    message: 'pageSize must be a string or a number.',
  })
  pageSize: number;

  @ApiProperty({
    example: 'desc',
    description: 'Order of sorting',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    example: 'created_at',
    description: 'Sort by [first_name, last_name, email, created_at] fields.',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: `Search by [first_name, last_name, email, phone_number] fields.`,
    required: false,
  })
  @IsString()
  @IsOptional()
  search: string;
}
