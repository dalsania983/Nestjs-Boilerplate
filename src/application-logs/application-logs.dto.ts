import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLogsDto {
  @IsString({ message: 'User Id must be a string.' })
  @IsNotEmpty({ message: 'User Id is required.' })
  user_id: string;

  @IsString({ message: 'Action must be a string.' })
  @IsNotEmpty({ message: 'Action is required.' })
  action: string;

  @IsString({ message: 'Ip must be a string.' })
  @IsNotEmpty({ message: 'Ip is required.' })
  ip: string;

  @IsString({ message: 'Message be a string.' })
  @IsNotEmpty({ message: 'Message is required.' })
  message?: string;

  @IsString({ message: 'Module must be a string.' })
  @IsOptional()
  module?: string;
}

export class GetLogsByUserIdDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
