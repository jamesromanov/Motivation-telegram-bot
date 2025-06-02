"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const bot_service_1 = require("./bot.service");
const users_module_1 = require("../users/users.module");
const quotes_module_1 = require("../quotes/quotes.module");
const likes_module_1 = require("../likes/likes.module");
const start_handler_1 = require("./handlers/start.handler");
const grammy_1 = require("grammy");
const nestjs_1 = require("@grammyjs/nestjs");
const config_1 = require("@nestjs/config");
const quote_handler_1 = require("./handlers/quote.handler");
const conversations_1 = require("@grammyjs/conversations");
const prisma_service_1 = require("../prisma/prisma.service");
const qoute_service_conversation_1 = require("./handlers/qoute.service.conversation");
const prisma_module_1 = require("../prisma/prisma.module");
const redis_service_1 = require("../redis/redis.service");
const like_handler_1 = require("./handlers/like.handler");
const schedule_1 = require("@nestjs/schedule");
const schedule_module_1 = require("../scheduler/schedule.module");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            quotes_module_1.QuotesModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            nestjs_1.NestjsGrammyModule.forRootAsync({
                imports: [config_1.ConfigModule, prisma_module_1.PrismaModule],
                useFactory: async (config) => {
                    return {
                        token: config.get('BOT_TOKEN'),
                        middlewares: [
                            async (ctx, next) => {
                                await next();
                            },
                            (0, conversations_1.conversations)(),
                            (0, grammy_1.session)({
                                initial: () => {
                                    return { text: '' };
                                },
                            }),
                        ],
                    };
                },
                inject: [config_1.ConfigService],
            }),
            grammy_1.Composer,
            schedule_module_1.SchedulerModule,
            likes_module_1.LikesModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        providers: [
            bot_service_1.BotService,
            start_handler_1.StartHandler,
            quote_handler_1.QuoteHandler,
            like_handler_1.LikeHandler,
            prisma_service_1.PrismaService,
            qoute_service_conversation_1.QuoteServiceCon,
            redis_service_1.RedisService,
        ],
        exports: [bot_service_1.BotService],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map