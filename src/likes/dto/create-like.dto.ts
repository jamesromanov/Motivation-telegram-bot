import { IsNumber, IsString } from 'class-validator';
import { Quotes, User } from 'generated/prisma';

export class CreateLikeDto {
  @IsNumber()
  likesCount: number;

  @IsNumber()
  dislikeCount: number;

  @IsString()
  quoteId: string;
}
