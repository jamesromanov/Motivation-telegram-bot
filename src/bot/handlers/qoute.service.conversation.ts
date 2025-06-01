import { InjectBot } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { Conversation, createConversation } from '@grammyjs/conversations';
import { QuotesService } from 'src/quotes/quotes.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class QuoteServiceCon {
  constructor(
    @InjectBot() bot: Bot<MyContext>,
    private readonly quoteService: QuotesService,
    private readonly redis: RedisService,
  ) {
    bot.use(createConversation(this.createQuote.bind(this), 'createQuote'));
  }

  async createQuote(conversation: Conversation<MyContext>, ctx: MyContext) {
    await ctx.reply("Qo'shmoqchi bolgan quote kiriting:");
    const { message } = await conversation.wait();
    if (!message?.text)
      return await ctx.reply("Quote bo'sh bolishi mumkin emas");
    await this.redis.set('text', message.text);
    await ctx.reply(
      `Quote muvaffaqiyatli saqlandi!✅\n\n <i>${message.text}</i>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '❌Bekor qilish', callback_data: 'cancel' },
              { text: '✅Tasdiqlash', callback_data: 'confirm' },
            ],
          ],
        },
      },
    );
  }
}
