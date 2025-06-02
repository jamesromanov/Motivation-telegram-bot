"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartHandler = void 0;
const grammy_1 = require("grammy");
const nestjs_1 = require("@grammyjs/nestjs");
const users_service_1 = require("../../users/users.service");
const redis_service_1 = require("../../redis/redis.service");
let StartHandler = class StartHandler {
    bot;
    userService;
    redis;
    constructor(bot, userService, redis) {
        this.bot = bot;
        this.userService = userService;
        this.redis = redis;
    }
    async startBot(ctx) {
        let id = JSON.parse((await this.redis.get('ids')));
        if (id) {
            await this.redis.set('ids', id.concat(Number(ctx.from?.id)));
        }
        else {
            await this.redis.set('ids', [ctx.from?.id]);
        }
        const chatId = ctx.from?.id.toString();
        if (chatId)
            await this.userService.create({ chatId });
        await ctx.reply(`<b>🎉Assalomu alaykum ${ctx.from?.first_name}! Botga xush kelibsiz. Bu botda siz har kuni 9:00 da hayotingiz uchun zarur bolgan <i>motivatsiya</i> olasiz Inshallah Bot sizga manzur bo'ladi degan umiddamiz!!</b>\n📕Yordam - /help`, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [['📈Top Motivatsiyalar'], ['🧬Motivatsiya!']],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
        });
    }
};
exports.StartHandler = StartHandler;
__decorate([
    (0, nestjs_1.Start)(),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartHandler.prototype, "startBot", null);
exports.StartHandler = StartHandler = __decorate([
    (0, nestjs_1.Update)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        users_service_1.UsersService,
        redis_service_1.RedisService])
], StartHandler);
//# sourceMappingURL=start.handler.js.map