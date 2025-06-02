import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { RedisService } from 'src/redis/redis.service';
import { LikesService } from 'src/likes/likes.service';
import { QuotesService } from 'src/quotes/quotes.service';
export declare class LikeHandler {
    private redis;
    private reactionService;
    private qouteService;
    constructor(bot: Bot<MyContext>, redis: RedisService, reactionService: LikesService, qouteService: QuotesService);
    like(ctx: MyContext): Promise<void>;
    dislike(ctx: MyContext): Promise<void>;
    likedDisliked(ctx: MyContext): Promise<void>;
}
