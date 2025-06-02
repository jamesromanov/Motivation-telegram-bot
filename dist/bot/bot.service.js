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
exports.BotService = void 0;
const grammy_1 = require("grammy");
const nestjs_1 = require("@grammyjs/nestjs");
let BotService = class BotService {
    bot;
    constructor(bot) {
        this.bot = bot;
    }
    async getHelp(ctx) {
        if (ctx.from?.id === +process.env.ADMIN_ID) {
            await ctx.reply(`<b>Botdan foydalanish uchun quyidagi commandalardan foydalaning(adminlar uchun):</b>\n\n/start - <b>Botdan foydalanish</b>\n\n/adminAdd - <b>✍️Yangi Quote qoshish</b>\n\n/adminGet - <b>📄Barcha qoutelarni olish</b>\n\n📈Top Motivatsiyalar - <b>Top 5 ta eng zor motivatsiyalar</b>\n\n🧬Motivatsiya! - <b>Motivatsiya olish</b>\n\n<i>🖇Bundan tashqari foydalanuvchilar like bosish yoki dislike bosish huquqiga ega!\n🏆Botdan foydalanganingiz uchun tashakkur!</i>`, { parse_mode: 'HTML' });
        }
        else {
            await ctx.reply(`<b>Botdan foydalanish uchun quyidagi commandalardan foydalaning:</b>\n\n/start - <b>Botdan foydalanish</b>\n\n📈Top Motivatsiyalar - <b>Top 5 ta eng zor motivatsiyalar</b>\n\n🧬Motivatsiya! - <b>Motivatsiya olish</b>\n\n<i>🖇Bundan tashqari foydalanuvchilar like bosish yoki dislike bosish huquqiga ega!\n🏆Botdan foydalanganingiz uchun tashakkur!</i>`, { parse_mode: 'HTML' });
        }
    }
};
exports.BotService = BotService;
__decorate([
    (0, nestjs_1.Command)('help'),
    __param(0, (0, nestjs_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotService.prototype, "getHelp", null);
exports.BotService = BotService = __decorate([
    (0, nestjs_1.Update)(),
    __param(0, (0, nestjs_1.InjectBot)()),
    __metadata("design:paramtypes", [grammy_1.Bot])
], BotService);
//# sourceMappingURL=bot.service.js.map