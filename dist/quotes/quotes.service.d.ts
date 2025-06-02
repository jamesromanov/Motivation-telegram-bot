import { CreateQuoteDto } from './dto/create-quote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createQuoteDto: CreateQuoteDto): Promise<{
        text: string;
        id: string;
        createdAt: Date;
    }>;
    findAll(): Promise<({
        Reactions: {
            id: string;
            createdAt: Date;
            likesCount: number;
            dislikeCount: number;
            quoteId: string;
        }[];
    } & {
        text: string;
        id: string;
        createdAt: Date;
    })[]>;
    findRandomQuote(): Promise<{
        Reactions: {
            id: string;
            createdAt: Date;
            likesCount: number;
            dislikeCount: number;
            quoteId: string;
        }[];
    } & {
        text: string;
        id: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        text: string;
        id: string;
        createdAt: Date;
    }>;
    topQuotes(): Promise<({
        Quote: {
            text: string;
            id: string;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        likesCount: number;
        dislikeCount: number;
        quoteId: string;
    })[]>;
}
