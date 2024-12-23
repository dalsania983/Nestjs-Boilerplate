import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of log per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

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
    description: 'Sort by [module, action, created_at] fields.',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: `Search by [action, module, message] fields.`,
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
