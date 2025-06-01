import { InjectBot, Update } from '@grammyjs/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MyContext } from 'src/bot/bot.service';
import { LikesService } from 'src/likes/likes.service';
import { QuotesService } from 'src/quotes/quotes.service';

@Injectable()
export class SchedulerService {
  constructor() {}
  async handleCron(
    message: string,
    inline: {
      parse_mode: 'HTML';
      reply_markup: {
        inline_keyboard: [{ text: string; callback_data: any }[]];
      };
    },
  ) {
    return { message, inline };
  }
}
