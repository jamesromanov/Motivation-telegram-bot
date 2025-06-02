import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class LikesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createLikeDto: CreateLikeDto): Promise<{
        id: string;
        createdAt: Date;
        likesCount: number;
        dislikeCount: number;
        quoteId: string;
    }>;
    update(id: string, updateLikeDto: UpdateLikeDto): Promise<{
        id: string;
        createdAt: Date;
        likesCount: number;
        dislikeCount: number;
        quoteId: string;
    }>;
    findById(quoteId: string): Promise<{
        id: string;
        createdAt: Date;
        likesCount: number;
        dislikeCount: number;
        quoteId: string;
    } | undefined>;
}
