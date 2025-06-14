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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikesService = class LikesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLikeDto) {
        const { quoteId, ...rest } = createLikeDto;
        const qoute = await this.prisma.quotes.findUnique({
            where: { id: quoteId },
        });
        if (!qoute)
            throw new common_1.NotFoundException('No qoutes found');
        const reaction = await this.prisma.reactions.create({
            data: { ...createLikeDto, quoteId: qoute.id },
        });
        return reaction;
    }
    async update(id, updateLikeDto) {
        const reactionExists = (await this.prisma.reactions.findMany({
            where: { quoteId: id },
        }))[0];
        const reaction = await this.prisma.reactions.update({
            where: { id: reactionExists.id },
            data: updateLikeDto,
        });
        return reaction;
    }
    async findById(quoteId) {
        const reaction = await this.prisma.reactions.findMany({
            where: { quoteId },
        });
        if (!reaction.length)
            return;
        return reaction[0];
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map