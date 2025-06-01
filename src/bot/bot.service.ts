import { Bot, Context, LazySessionFlavor, SessionFlavor } from 'grammy';
import {
  ConversationControls,
  ConversationFlavor,
} from '@grammyjs/conversations';
import { Command, Ctx, Help, InjectBot, Update } from '@grammyjs/nestjs';

interface SessionData {
  text?: string;
}
export type MyContext = Context &
  ConversationFlavor<Context> &
  LazySessionFlavor<SessionData> & {
    conversation: ConversationControls;
  } & SessionFlavor<SessionData>;
@Update()
export class BotService {
  constructor(@InjectBot() private readonly bot: Bot<MyContext>) {}
  @Command('help')
  async getHelp(@Ctx() ctx: MyContext) {
    if (ctx.from?.id === +(process.env.ADMIN_ID as string)) {
      await ctx.reply(
        `<b>Botdan foydalanish uchun quyidagi commandalardan foydalaning(adminlar uchun):</b>\n\n/start - <b>Botdan foydalanish</b>\n\n/adminAdd - <b>✍️Yangi Quote qoshish</b>\n\n/adminGet - <b>📄Barcha qoutelarni olish</b>\n\n📈Top Motivatsiyalar - <b>Top 5 ta eng zor motivatsiyalar</b>\n\n🧬Motivatsiya! - <b>Motivatsiya olish</b>\n\n<i>🖇Bundan tashqari foydalanuvchilar like bosish yoki dislike bosish huquqiga ega!\n🏆Botdan foydalanganingiz uchun tashakkur!</i>`,
        { parse_mode: 'HTML' },
      );
    } else {
      await ctx.reply(
        `<b>Botdan foydalanish uchun quyidagi commandalardan foydalaning:</b>\n\n/start - <b>Botdan foydalanish</b>\n\n📈Top Motivatsiyalar - <b>Top 5 ta eng zor motivatsiyalar</b>\n\n🧬Motivatsiya! - <b>Motivatsiya olish</b>\n\n<i>🖇Bundan tashqari foydalanuvchilar like bosish yoki dislike bosish huquqiga ega!\n🏆Botdan foydalanganingiz uchun tashakkur!</i>`,
        { parse_mode: 'HTML' },
      );
    }
  }
}
