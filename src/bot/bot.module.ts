import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UsersModule } from 'src/users/users.module';
import { QuotesModule } from 'src/quotes/quotes.module';
import { LikesModule } from 'src/likes/likes.module';
import { StartHandler } from './handlers/start.handler';
import { Composer, session } from 'grammy';
import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuoteHandler } from './handlers/quote.handler';
import { conversations } from '@grammyjs/conversations';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuoteServiceCon } from './handlers/qoute.service.conversation';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisService } from 'src/redis/redis.service';
import { LikeHandler } from './handlers/like.handler';

import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from 'src/scheduler/schedule.module';

@Module({
  imports: [
    QuotesModule,
    UsersModule,
    PrismaModule,
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      useFactory: async (config: ConfigService) => {
        return {
          token: config.get<string>('BOT_TOKEN') as string,
          middlewares: [
            async (ctx, next) => {
              await next();
            },
            conversations(),
            session({
              initial: () => {
                return { text: '' };
              },
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    Composer,
    SchedulerModule,
    LikesModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    BotService,
    StartHandler,
    QuoteHandler,
    LikeHandler,
    PrismaService,
    QuoteServiceCon,
    RedisService,
  ],
  exports: [BotService],
})
export class BotModule {}
