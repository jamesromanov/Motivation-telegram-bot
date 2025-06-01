import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [QuotesService, PrismaService],
  exports: [QuotesService],
})
export class QuotesModule {}
