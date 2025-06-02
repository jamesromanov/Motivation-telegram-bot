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
exports.QuoteServiceCon = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const quotes_service_1 = require("../../quotes/quotes.service");
const redis_service_1 = require("../../redis/redis.service");
let QuoteServiceCon = class QuoteServiceCon {
    quoteService;
    redis;
    constructor(bot, quoteService, redis) {
        this.quoteService = quoteService;
        this.redis = redis;
        bot.use((0, conversations_1.createConversation)(this.createQuote.bind(this), 'createQuote'));
    }
    async createQuote(conversation, ctx) {
        await ctx.reply("Qo'shmoqchi bolgan quote kiriting:");
        const { message } = await conversation.wait();
        if (!message?.text)
            return await ctx.reply("Quote bo'sh bolishi mumkin emas");
        await this.redis.set('text', message.text);
        await ctx.reply(`Quote muvaffaqiyatli saqlandi!✅\n\n <i>${message.text}</i>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '❌Bekor qilish', callback_data: 'cancel' },
                        { text: '✅Tasdiqlash', callback_data: 'confirm' },
                    ],
                ],
            },
        });
    }
};
exports.QuoteServiceCon = QuoteServiceCon;
exports.QuoteServiceCon = QuoteServiceCon = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        quotes_service_1.QuotesService,
        redis_service_1.RedisService])
], QuoteServiceCon);
//# sourceMappingURL=qoute.service.conversation.js.map