import { Bot, Context, LazySessionFlavor, SessionFlavor } from 'grammy';
import { ConversationControls, ConversationFlavor } from '@grammyjs/conversations';
interface SessionData {
    text?: string;
}
export type MyContext = Context & ConversationFlavor<Context> & LazySessionFlavor<SessionData> & {
    conversation: ConversationControls;
} & SessionFlavor<SessionData>;
export declare class BotService {
    private readonly bot;
    constructor(bot: Bot<MyContext>);
    getHelp(ctx: MyContext): Promise<void>;
}
export {};
