import {
  CallbackQuery,
  Command,
  Ctx,
  InjectBot,
  Update,
} from '@grammyjs/nestjs';
import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { RedisService } from 'src/redis/redis.service';
import { LikesService } from 'src/likes/likes.service';
import { QuotesService } from 'src/quotes/quotes.service';

@Update()
export class LikeHandler {
  constructor(
    @InjectBot() bot: Bot<MyContext>,
    private redis: RedisService,
    private reactionService: LikesService,
    private qouteService: QuotesService,
  ) {}

  @CallbackQuery(/^like_/)
  async like(@Ctx() ctx: MyContext) {
    await ctx.answerCallbackQuery();
    const quoteId = ctx.callbackQuery?.data?.split('_')[1] as string;
    const quote = await this.qouteService.findById(quoteId);
    let reaction = await this.reactionService.findById(quoteId);
    if (reaction)
      reaction = await this.reactionService.update(quoteId, {
        likesCount: reaction.likesCount + 1,
      });
    else
      reaction = await this.reactionService.create({
        likesCount: 1,
        dislikeCount: 0,
        quoteId: quote.id,
      });
    ctx.editMessageReplyMarkup({
      reply_markup: {
        inline_keyboard: [
          [
            { text: `👍 ${reaction.likesCount}`, callback_data: 'liked' },
            {
              text: `👎 ${reaction.dislikeCount === 0 ? 'Dislike' : reaction.dislikeCount}`,
              callback_data: `disliked`,
            },
          ],
        ],
      },
    });
  }
  @CallbackQuery(/^dislike_/)
  async dislike(@Ctx() ctx: MyContext) {
    await ctx.answerCallbackQuery();
    const quoteId = ctx.callbackQuery?.data?.split('_')[1] as string;
    const quote = await this.qouteService.findById(quoteId);
    let reaction = await this.reactionService.findById(quoteId);
    if (reaction)
      reaction = await this.reactionService.update(quoteId, {
        dislikeCount: reaction.dislikeCount + 1,
      });
    else
      reaction = await this.reactionService.create({
        likesCount: 0,
        dislikeCount: 1,
        quoteId: quote.id,
      });

    ctx.editMessageReplyMarkup({
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `👍 ${reaction.likesCount === 0 ? 'Like' : reaction.likesCount}`,
              callback_data: 'liked',
            },
            {
              text: `👎 ${reaction.dislikeCount}`,
              callback_data: `disliked`,
            },
          ],
        ],
      },
    });
  }
  @CallbackQuery(['liked', 'disliked'])
  async likedDisliked(@Ctx() ctx: MyContext) {
    await ctx.answerCallbackQuery();
    const action = ctx.callbackQuery?.data;

    if (action === 'disliked' || action === 'liked') {
      await ctx.reply('Oldin reacsiya bosilgan❗️');
    }
  }
}
