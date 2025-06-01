import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLikeDto {
  @IsNumber()
  @IsOptional()
  likesCount?: number;
  @IsNumber()
  @IsOptional()
  dislikeCount?: number;
}
