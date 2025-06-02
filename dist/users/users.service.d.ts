import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        chatId: string;
        createdAt: Date;
    }>;
    checkUsers(): Promise<{
        id: string;
        chatId: string;
        createdAt: Date;
    }[]>;
}
