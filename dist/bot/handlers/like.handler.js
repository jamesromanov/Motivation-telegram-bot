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
exports.LikeHandler = void 0;
const nestjs_1 = require("@grammyjs/nestjs");
const grammy_1 = require("grammy");
const redis_service_1 = require("../../redis/redis.service");
const likes_service_1 = require("../../likes/likes.service");
const quotes_service_1 = require("../../quotes/quotes.service");
let LikeHandler = class LikeHandler {
    redis;
    reactionService;
    qouteService;
    constructor(bot, redis, reactionService, qouteService) {
        this.redis = redis;
        this.reactionService = reactionService;
        this.qouteService = qouteService;
    }
    async like(ctx) {
        await ctx.answerCallbackQuery();
        const quoteId = ctx.callbackQuery?.data?.split('_')[1];
        const quote = await this.qouteService.findById(quoteId);
        let reaction = await this.reactionService.findById(quoteId);
        if (reaction)
            reaction = await this.reactionService.update(quoteId, {
                likesCount: reaction.likesCount + 1,
            });
        else
            reaction = await this.reactionService.create({
                likesCount: 1,
                dislikeCount: 0,
                quoteId: quote.id,
            });
        ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `👍 ${reaction.likesCount}`, callback_data: 'liked' },
                        {
                            text: `👎 ${reaction.dislikeCount === 0 ? 'Dislike' : reaction.dislikeCount}`,
                            callback_data: `disliked`,
                        },
                    ],
                ],
            },
        });
    }
    async dislike(ctx) {
        await ctx.answerCallbackQuery();
        const quoteId = ctx.callbackQuery?.data?.split('_')[1];
        const quote = await this.qouteService.findById(quoteId);
        let reaction = await this.reactionService.findById(quoteId);
        if (reaction)
            reaction = await this.reactionService.update(quoteId, {
                dislikeCount: reaction.dislikeCount + 1,
            });
        else
            reaction = await this.reactionService.create({
                likesCount: 0,
                dislikeCount: 1,
                quoteId: quote.id,
            });
        ctx.editMessageReplyMarkup({
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `👍 ${reaction.likesCount === 0 ? 'Like' : reaction.likesCount}`,
                            callback_data: 'liked',
                        },
                        {
                            text: `👎 ${reaction.dislikeCount}`,
                            callback_data: `disliked`,
                        },
                    ],
                ],
            },
        });
    }
    async likedDisliked(ctx) {
        await ctx.answerCallbackQuery();
        const action = ctx.callbackQuery?.data;
        if (action === 'disliked' || action === 'liked') {
            await ctx.reply('Oldin reacsiya bosilgan❗️');
        }
    }
};
exports.LikeHandler = LikeHandler;
__decorate([
    (0, nestjs_1.CallbackQuery)(/^like_/),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeHandler.prototype, "like", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(/^dislike_/),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeHandler.prototype, "dislike", null);
__decorate([
    (0, nestjs_1.CallbackQuery)(['liked', 'disliked']),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LikeHandler.prototype, "likedDisliked", null);
exports.LikeHandler = LikeHandler = __decorate([
    (0, nestjs_1.Update)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot,
        redis_service_1.RedisService,
        likes_service_1.LikesService,
        quotes_service_1.QuotesService])
], LikeHandler);
//# sourceMappingURL=like.handler.js.map