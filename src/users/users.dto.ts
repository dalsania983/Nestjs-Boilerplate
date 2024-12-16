import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;
}

export class GetAllUsersDto {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  pageSize: number;

  @IsString()
  @IsOptional()
  search: string;
}
