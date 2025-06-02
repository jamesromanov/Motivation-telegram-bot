export declare class SchedulerService {
    constructor();
    handleCron(message: string, inline: {
        parse_mode: 'HTML';
        reply_markup: {
            inline_keyboard: [{
                text: string;
                callback_data: any;
            }[]];
        };
    }): Promise<{
        message: string;
        inline: {
            parse_mode: "HTML";
            reply_markup: {
                inline_keyboard: [{
                    text: string;
                    callback_data: any;
                }[]];
            };
        };
    }>;
}
