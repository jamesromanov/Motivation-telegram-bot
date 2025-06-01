import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLikeDto: CreateLikeDto) {
    const { quoteId, ...rest } = createLikeDto;
    const qoute = await this.prisma.quotes.findUnique({
      where: { id: quoteId },
    });
    if (!qoute) throw new NotFoundException('No qoutes found');
    const reaction = await this.prisma.reactions.create({
      data: { ...createLikeDto, quoteId: qoute.id },
    });
    return reaction;
  }

  async update(id: string, updateLikeDto: UpdateLikeDto) {
    const reactionExists = (
      await this.prisma.reactions.findMany({
        where: { quoteId: id },
      })
    )[0];
    const reaction = await this.prisma.reactions.update({
      where: { id: reactionExists.id },
      data: updateLikeDto,
    });
    return reaction;
  }

  async findById(quoteId: string) {
    const reaction = await this.prisma.reactions.findMany({
      where: { quoteId },
    });
    if (!reaction.length) return;
    return reaction[0];
  }
}
