import { OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit {
    private redis;
    onModuleInit(): void;
    set(key: string, value: any): Promise<"OK">;
    get(key: string): Promise<string | null>;
}
