import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { Conversation } from '@grammyjs/conversations';
import { QuotesService } from 'src/quotes/quotes.service';
import { RedisService } from 'src/redis/redis.service';
export declare class QuoteServiceCon {
    private readonly quoteService;
    private readonly redis;
    constructor(bot: Bot<MyContext>, quoteService: QuotesService, redis: RedisService);
    createQuote(conversation: Conversation<MyContext>, ctx: MyContext): Promise<import("@grammyjs/types").Message.TextMessage | undefined>;
}
