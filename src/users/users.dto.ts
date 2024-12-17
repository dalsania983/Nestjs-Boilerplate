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
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  first_name: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  last_name: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsOptional()
  password?: string;

  @IsString({ message: 'Phone number must be a string.' })
  @IsOptional()
  phone_number?: string;
}

export class GetAllUsersDto {
  @IsOptional()
  @Validate((value) => isNumber(value) || isString(value), {
    message: 'page must be a string or a number.',
  })
  page: string | number;

  @IsOptional()
  @Validate((value) => isNumber(value) || isString(value), {
    message: 'pageSize must be a string or a number.',
  })
  pageSize: string | number;

  @IsString()
  @IsOptional()
  search: string;
}
