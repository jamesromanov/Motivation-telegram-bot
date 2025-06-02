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
exports.QuoteHandler = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const quotes_service_1 = require("../../quotes/quotes.service");
const grammy_1 = require("grammy");
const redis_service_1 = require("../../redis/redis.service");
const likes_service_1 = require("../../likes/likes.service");
const scheduler_service_1 = require("../../scheduler/scheduler.service");
const schedule_1 = require("@nestjs/schedule");
let QuoteHandler = class QuoteHandler {
    bot;
    quoteService;
    redis;
    reactionsService;
    scheduleService;
    constructor(bot, quoteService, redis, reactionsService, scheduleService) {
        this.bot = bot;
        this.quoteService = quoteService;
        this.redis = redis;
        this.reactionsService = reactionsService;
        this.scheduleService = scheduleService;
    }
    chatId;
    async showTopMotivations(ctx) {
        this.chatId = ctx.chat?.id;
        const topQuotes = await this.quoteService.topQuotes();
        let quotes = '';
        let count = 1;
        for (const i of topQuotes.slice(0, 5)) {
            quotes += `<i>${count}. ${i.Quote.text}</i>(👍 ${i.likesCount} likelar, 👎 ${i.dislikeCount} dislike)\n\n`;
            count++;
        }
        await ctx.reply(`<b>✨Top ${topQuotes.length} motivatsiyalari:</b> \n\n${quotes}`, {
            parse_mode: 'HTML',
        });
    }
    async scheduleMsg() {
        const randomQuote = await this.quoteService.findRandomQuote();
        const reactions = await this.reactionsService.findById(randomQuote.id);
        await this.schedule(`"<i>${randomQuote.text}</i>"\n\n Edited by: <b>Telegram Bot</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `👍 ${reactions && reactions.likesCount !== 0 ? reactions.likesCount : 'Like'}`,
                            callback_data: `like_${randomQuote.id}`,
                        },
                        {
                            text: `👎 ${reactions && reactions.dislikeCount !== 0 ? reactions.dislikeCount : 'Dislike'}`,
                            callback_data: `dislike_${randomQuote.id}`,
                        },
                    ],
                ],
            },
        });
    }
    async getRandomQuote(ctx) {
        const randomQuote = await this.quoteService.findRandomQuote();
        if (!randomQuote)
            return ctx.reply('Xatolik yuz berdi qayta urining!');
        const reactions = await this.reactionsService.findById(randomQuote.id);
        await ctx.reply(`"<i>${randomQuote.text}</i>"\n\n Edited by: <b>Telegram Bot</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `👍 ${reactions && reactions.likesCount !== 0 ? reactions.likesCount : 'Like'}`,
                            callback_data: `like_${randomQuote.id}`,
                        },
                        {
                            text: `👎 ${reactions && reactions.dislikeCount !== 0 ? reactions.dislikeCount : 'Dislike'}`,
                            callback_data: `dislike_${randomQuote.id}`,
                        },
                    ],
                ],
            },
        });
    }
    async current(ctx) {
        await ctx.answerCallbackQuery();
    }
    async getQuotes(ctx) {
        const isAdmin = this.isAdmin(ctx);
        if (!isAdmin)
            return ctx.reply('Sizni bunga huquqingiz yoq!');
        const quotes = await this.quoteService.findAll();
        if (quotes.length === 0)
            return ctx.reply('Hech qanday quotelar topilmadi!');
        await this.redis.set('pages', 1);
        await this.redis.set('data', quotes);
        return await this.painationQuote(ctx, this.reactionsService);
    }
    async pagination(ctx) {
        await ctx.answerCallbackQuery();
        const action = ctx.callbackQuery?.data;
        const page = Number(await this.redis.get('pages'));
        if (action === 'next') {
            await this.redis.set('pages', page + 1);
        }
        else if (action === 'preview') {
            await this.redis.set('pages', page - 1);
        }
        return await this.painationQuote(ctx, this.reactionsService);
    }
    async addQuote(ctx) {
        const isAdmin = this.isAdmin(ctx);
        if (!isAdmin)
            return ctx.reply('Sizni bunga huquqingiz yoq!');
        await ctx.conversation.enter('createQuote');
    }
    async declineQuote(ctx) {
        const isAdmin = this.isAdmin(ctx);
        if (!isAdmin)
            return ctx.reply('Sizni bunga huquqingiz yoq!');
        ctx.answerCallbackQuery();
        ctx.deleteMessage();
        ctx.reply('✅Bekor qilindi');
    }
    async acceptQoute(ctx) {
        const isAdmin = this.isAdmin(ctx);
        if (!isAdmin)
            return ctx.reply('Sizni bunga huquqingiz yoq!');
        ctx.answerCallbackQuery();
        ctx.editMessageReplyMarkup();
        const text = await this.redis.get('text');
        await this.quoteService.create({
            text: text,
        });
        await ctx.reply('✅Muvaffaqiyatli saqlandi!');
    }
    async schedule(message, inline) {
        const { message: msg, inline: inlineKeys } = await this.scheduleService.handleCron(message, inline);
        const ids = JSON.parse((await this.redis.get('ids')));
        console.log(ids);
        for (const i of ids) {
            await this.bot.api.sendMessage(i, msg, inlineKeys);
        }
    }
    isAdmin(ctx) {
        if (ctx.from?.id === +process.env.ADMIN_ID) {
            return true;
        }
        else {
            false;
        }
    }
    async painationQuote(ctx, reactions) {
        const data = JSON.parse((await this.redis.get('data')));
        const pages = +(await this.redis.get('pages'));
        let currentPage = pages;
        let qoutesAll = '';
        const start = currentPage > 1 ? (currentPage - 1) * 5 : 0;
        const end = currentPage * 5;
        const totalPages = Math.ceil(data.length / 5);
        let count = start;
        for (const i of data.slice(start, end)) {
            const likes = await reactions.findById(i.id);
            qoutesAll += `<i>${count}.${i.text}</i>(👍 ${likes?.likesCount ? likes.likesCount : 0} likelar, 👎 ${likes?.dislikeCount ? likes.dislikeCount : 0} dislike)\n\n`;
            count++;
        }
        const buttons = [];
        if (currentPage > 1)
            buttons.push({ text: `⬅️${currentPage - 1}`, callback_data: 'preview' });
        buttons.push({ text: `--${currentPage}--`, callback_data: 'current' });
        if (currentPage < totalPages - 1)
            buttons.push({ text: `${currentPage + 1}➡️`, callback_data: 'next' });
        if (currentPage + 1 === totalPages)
            buttons.push({ text: `${totalPages}➡️`, callback_data: 'next' });
        try {
            await ctx.editMessageText(qoutesAll, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [buttons],
                },
            });
        }
        catch (error) {
            ctx.reply(qoutesAll, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [buttons],
                },
            });
        }
    }
};
exports.QuoteHandler = QuoteHandler;
__decorate([
    (0, nestjs_1.Hears)('📈Top Motivatsiyalar'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "showTopMotivations", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9PM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "scheduleMsg", null);
__decorate([
    (0, nestjs_1.Hears)('🧬Motivatsiya!'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "getRandomQuote", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('current'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "current", null);
__decorate([
    (0, nestjs_1.Command)('adminGet'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "getQuotes", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(['preview', 'next']),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "pagination", null);
__decorate([
    (0, nestjs_1.Command)('adminAdd'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "addQuote", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('cancel'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "declineQuote", null);
__decorate([
    (0, nestjs_1.CallbackQuery)('confirm'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuoteHandler.prototype, "acceptQoute", null);
exports.QuoteHandler = QuoteHandler = __decorate([
    (0, nestjs_1.Update)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        quotes_service_1.QuotesService,
        redis_service_1.RedisService,
        likes_service_1.LikesService,
        scheduler_service_1.SchedulerService])
], QuoteHandler);
//# sourceMappingURL=quote.handler.js.map