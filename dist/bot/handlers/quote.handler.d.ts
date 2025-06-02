import { MyContext } from '../bot.service';
import { QuotesService } from 'src/quotes/quotes.service';
import { Bot } from 'grammy';
import { RedisService } from 'src/redis/redis.service';
import { LikesService } from 'src/likes/likes.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
export declare class QuoteHandler {
    private readonly bot;
    private readonly quoteService;
    private readonly redis;
    private readonly reactionsService;
    private readonly scheduleService;
    constructor(bot: Bot<MyContext>, quoteService: QuotesService, redis: RedisService, reactionsService: LikesService, scheduleService: SchedulerService);
    private chatId;
    showTopMotivations(ctx: MyContext): Promise<void>;
    scheduleMsg(): Promise<void>;
    getRandomQuote(ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage | undefined>;
    current(ctx: MyContext): Promise<void>;
    getQuotes(ctx: MyContext): Promise<void | import("@grammyjs/types").Message.TextMessage>;
    pagination(ctx: MyContext): Promise<void>;
    addQuote(ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage | undefined>;
    declineQuote(ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage | undefined>;
    acceptQoute(ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage | undefined>;
    schedule(message: string, inline: {
        parse_mode: 'HTML';
        reply_markup: {
            inline_keyboard: [{
                text: string;
                callback_data: any;
            }[]];
        };
    }): Promise<void>;
    isAdmin(ctx: MyContext): true | undefined;
    painationQuote(ctx: MyContext, reactions: LikesService): Promise<void>;
}
