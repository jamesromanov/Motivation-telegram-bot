import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LikesService, PrismaService],
  exports: [LikesService],
})
export class LikesModule {}
