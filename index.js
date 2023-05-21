const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.first_name ? ctx.message.from.first_name : "stranger"}!`));
bot.help((ctx) => ctx.reply(text.commands));
 
bot.command('settings', async (ctx)=> {
    try {
        await ctx.replyWithHTML('<b>Settings</b>', Markup.inlineKeyboard(
             [
                 [Markup.button.callback('My profile', 'btn_1'), Markup.button.callback('Referral', 'btn_2')]
             ]
         ))
    } catch(e) {
        console.error(e)
    }
})

const addActionBot = (name, src, text) => {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery() //Что бы исчезли часики
            if(src !== false) {
                await ctx.replyWithPhoto({
                    source:src 
                })
            }
            await ctx.replyWithHTML(text,
            {disable_web_page_preview: true // Отключение отображения картинки в ссылке
            })
        } catch(e) {
            console.error(e)
        }
    })
}

addActionBot('btn_1', './img/img1.png', text.text)

bot.launch();
 
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));