import {
  CallbackQuery,
  Command,
  Ctx,
  Hears,
  InjectBot,
  On,
  Start,
  Update,
} from '@grammyjs/nestjs';
import { MyContext } from '../bot.service';
import { QuotesService } from 'src/quotes/quotes.service';
import { Bot } from 'grammy';
import { RedisService } from 'src/redis/redis.service';
import { LikesService } from 'src/likes/likes.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Update()
export class QuoteHandler {
  constructor(
    @InjectBot() private readonly bot: Bot<MyContext>,
    private readonly quoteService: QuotesService,
    private readonly redis: RedisService,
    private readonly reactionsService: LikesService,
    private readonly scheduleService: SchedulerService,
  ) {}

  @Hears('📈Top Motivatsiyalar')
  async showTopMotivations(@Ctx() ctx: MyContext) {
    const topQuotes = await this.quoteService.topQuotes();
    let quotes = '';
    let count = 1;
    for (const i of topQuotes.slice(0, 5)) {
      quotes += `<i>${count}. ${i.Quote.text}</i>(👍 ${i.likesCount} likelar, 👎 ${i.dislikeCount} dislike)\n\n`;
      count++;
    }
    await ctx.reply(
      `<b>✨Top ${topQuotes.length} motivatsiyalari:</b> \n\n${quotes}`,
      {
        parse_mode: 'HTML',
      },
    );
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async scheduleMsg() {
    const randomQuote = await this.quoteService.findRandomQuote();
    if (!randomQuote)
      return this.bot.api.sendMessage(
        +((await this.redis.get('chatId')) as string),
        'Xatolik yuz berdi qayta urining!',
      );
    const reactions = await this.reactionsService.findById(randomQuote.id);
    await this.schedule(
      `"<i>${randomQuote.text}</i>"\n\n Edited by: <b>Telegram Bot</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `👍 ${reactions && reactions.likesCount !== 0 ? reactions.likesCount : 'Like'}`,
                callback_data: `like_${randomQuote.id}`,
              },
              {
                text: `👎 ${reactions && reactions.dislikeCount !== 0 ? reactions.dislikeCount : 'Dislike'}`,
                callback_data: `dislike_${randomQuote.id}`,
              },
            ],
          ],
        },
      },
    );
  }

  @Hears('🧬Motivatsiya!')
  async getRandomQuote(@Ctx() ctx: MyContext) {
    const randomQuote = await this.quoteService.findRandomQuote();
    if (!randomQuote) return ctx.reply('Xatolik yuz berdi qayta urining!');
    const reactions = await this.reactionsService.findById(randomQuote.id);
    await ctx.reply(
      `"<i>${randomQuote.text}</i>"\n\n Edited by: <b>Telegram Bot</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `👍 ${reactions && reactions.likesCount !== 0 ? reactions.likesCount : 'Like'}`,
                callback_data: `like_${randomQuote.id}`,
              },
              {
                text: `👎 ${reactions && reactions.dislikeCount !== 0 ? reactions.dislikeCount : 'Dislike'}`,
                callback_data: `dislike_${randomQuote.id}`,
              },
            ],
          ],
        },
      },
    );
  }

  @CallbackQuery('current')
  async current(@Ctx() ctx: MyContext) {
    await ctx.answerCallbackQuery();
  }
  @Command('adminGet')
  async getQuotes(@Ctx() ctx: MyContext) {
    const isAdmin = this.isAdmin(ctx);
    if (!isAdmin) return ctx.reply('Sizni bunga huquqingiz yoq!');
    const quotes = await this.quoteService.findAll();

    if (quotes.length === 0)
      return ctx.reply('Hech qanday quotelar topilmadi!');
    await this.redis.set('pages', 1);
    await this.redis.set('data', quotes);

    return await this.painationQuote(ctx, this.reactionsService);
  }

  @CallbackQuery(['preview', 'next'])
  async pagination(@Ctx() ctx: MyContext) {
    await ctx.answerCallbackQuery();
    const action = ctx.callbackQuery?.data;
    const page = Number(await this.redis.get('pages'));

    if (action === 'next') {
      await this.redis.set('pages', page + 1);
    } else if (action === 'preview') {
      await this.redis.set('pages', page - 1);
    }

    return await this.painationQuote(ctx, this.reactionsService);
  }

  @Command('adminAdd')
  async addQuote(@Ctx() ctx: MyContext) {
    const isAdmin = this.isAdmin(ctx);
    if (!isAdmin) return ctx.reply('Sizni bunga huquqingiz yoq!');
    await ctx.conversation.enter('createQuote');
  }

  @CallbackQuery('cancel')
  async declineQuote(@Ctx() ctx: MyContext) {
    const isAdmin = this.isAdmin(ctx);
    if (!isAdmin) return ctx.reply('Sizni bunga huquqingiz yoq!');
    ctx.answerCallbackQuery();
    ctx.deleteMessage();
    ctx.reply('✅Bekor qilindi');
  }
  @CallbackQuery('confirm')
  async acceptQoute(@Ctx() ctx: MyContext) {
    const isAdmin = this.isAdmin(ctx);
    if (!isAdmin) return ctx.reply('Sizni bunga huquqingiz yoq!');
    ctx.answerCallbackQuery();
    ctx.editMessageReplyMarkup();
    const text = await this.redis.get('text');
    await this.quoteService.create({
      text: text as string,
    });
    await ctx.reply('✅Muvaffaqiyatli saqlandi!');
  }

  async schedule(
    message: string,
    inline: {
      parse_mode: 'HTML';
      reply_markup: {
        inline_keyboard: [{ text: string; callback_data: any }[]];
      };
    },
  ) {
    const { message: msg, inline: inlineKeys } =
      await this.scheduleService.handleCron(message, inline);

    const chatId = +((await this.redis.get('chatId')) as string);
    return await this.bot.api.sendMessage(chatId, msg, inlineKeys);
  }

  isAdmin(ctx: MyContext) {
    if (ctx.from?.id === +(process.env.ADMIN_ID as string)) {
      return true;
    } else {
      false;
    }
  }

  async painationQuote(ctx: MyContext, reactions: LikesService) {
    const data = JSON.parse((await this.redis.get('data')) as string);
    const pages = +((await this.redis.get('pages')) as string);

    let currentPage = pages;
    let qoutesAll: string = '';
    const start = currentPage > 1 ? (currentPage - 1) * 5 : 0;
    const end = currentPage * 5;
    const totalPages = Math.ceil(data.length / 5);
    let count = start;
    for (const i of data.slice(start, end)) {
      const likes = await reactions.findById(i.id);
      qoutesAll += `<i>${count}.${i.text}</i>(👍 ${likes?.likesCount ? likes.likesCount : 0} likelar, 👎 ${likes?.dislikeCount ? likes.dislikeCount : 0} dislike)\n\n`;
      count++;
    }

    const buttons: any[] = [];

    if (currentPage > 1)
      buttons.push({ text: `⬅️${currentPage - 1}`, callback_data: 'preview' });
    buttons.push({ text: `--${currentPage}--`, callback_data: 'current' });
    if (currentPage < totalPages - 1)
      buttons.push({ text: `${currentPage + 1}➡️`, callback_data: 'next' });
    if (currentPage + 1 === totalPages)
      buttons.push({ text: `${totalPages}➡️`, callback_data: 'next' });

    try {
      await ctx.editMessageText(qoutesAll, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [buttons],
        },
      });
    } catch (error) {
      ctx.reply(qoutesAll, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [buttons],
        },
      });
    }
  }
}
