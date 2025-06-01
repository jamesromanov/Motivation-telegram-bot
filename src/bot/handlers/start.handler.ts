import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { Ctx, InjectBot, Start, Update } from '@grammyjs/nestjs';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service';

@Update()
export class StartHandler {
  constructor(
    @InjectBot() private readonly bot: Bot<MyContext>,
    private readonly userService: UsersService,
    private readonly redis: RedisService,
  ) {}

  @Start()
  async startBot(@Ctx() ctx: MyContext) {
    await this.redis.set('chatId', ctx.chat?.id);
    const chatId = ctx.from?.id.toString();
    if (chatId) await this.userService.create({ chatId });

    await ctx.reply(
      `<b>🎉Assalomu alaykum ${ctx.from?.first_name}! Botga xush kelibsiz. Bu botda siz har kuni 9:00 da hayotingiz uchun zarur bolgan <i>motivatsiya</i> olasiz Inshallah Bot sizga manzur bo'ladi degan umiddamiz!!</b>\n📕Yordam - /help`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: [['📈Top Motivatsiyalar'], ['🧬Motivatsiya!']],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      },
    );
  }
}
