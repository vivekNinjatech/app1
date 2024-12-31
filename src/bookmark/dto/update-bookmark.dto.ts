import { PartialType } from '@nestjs/mapped-types';
import { CreateBookmarkDto } from './create-bookmark.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
