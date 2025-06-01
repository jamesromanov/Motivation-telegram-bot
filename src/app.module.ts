import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { QuotesModule } from './quotes/quotes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    BotModule,
    QuotesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    LikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
