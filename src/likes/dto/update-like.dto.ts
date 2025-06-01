import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLikeDto {
  @IsNumber()
  @IsOptional()
  likesCount?: number;
  @IsNumber()
  @IsOptional()
  dislikeCount?: number;
}
