import { Bot } from 'grammy';
import { MyContext } from '../bot.service';
import { UsersService } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service';
export declare class StartHandler {
    private readonly bot;
    private readonly userService;
    private readonly redis;
    constructor(bot: Bot<MyContext>, userService: UsersService, redis: RedisService);
    startBot(ctx: MyContext): Promise<void>;
}
