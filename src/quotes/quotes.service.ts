import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createQuoteDto: CreateQuoteDto) {
    const quote = await this.prisma.quotes.create({ data: createQuoteDto });
    return quote;
  }

  async findAll() {
    const quotes = await this.prisma.quotes.findMany({
      include: { Reactions: true },
    });
    return quotes;
  }

  async findRandomQuote() {
    const qoutes = await this.findAll();
    const randomQuote = Math.floor(Math.random() * qoutes.length);
    return qoutes[randomQuote];
  }

  async findById(id: string) {
    const qoute = await this.prisma.quotes.findUnique({ where: { id } });
    if (!qoute) throw new NotFoundException('No quotes found');
    return qoute;
  }

  async topQuotes() {
    const quotes = await this.prisma.reactions.findMany({
      orderBy: {
        likesCount: 'desc',
      },
      include: { Quote: true },
    });
    return quotes;
  }
}
