const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config()
const text = require('./const')
const textTest = require('./const')
const openWeatherMapApiKey = '4b6f9e8b22638e50b8623881ed435161'
const request = require('request');

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

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
  
    console.log(msg)

    getCurrentWeather(msg.message.text, messageText => {
      bot.telegram.sendMessage(chatId, messageText);
    
    });
  
  });

function getCurrentWeather(cityName, callback) {
 
    const encodeCityName = encodeURIComponent(cityName) // Декодируем кирилицу

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${openWeatherMapApiKey}`;
    console.log(cityName)
    console.log(url)
    request(url, function (error, response, body) {
        if (error) return error

        let info = JSON.parse(body)

        console.log(info)

        let weatherType = info.weather.id; 
        let temp = info.main.temp; 
        let emojiIcon = ''

        if (weatherType >= 200 && weatherType <= 232)  emojiIcon = '⚡';
        else if (weatherType >= 300 && weatherType <= 321) emojiIcon = '☔';
        else if (weatherType >= 500 && weatherType <= 531) emojiIcon = '🌧';
        else if (weatherType >= 600 && weatherType <= 622)  emojiIcon = '❄';
        else if (weatherType >= 701 && weatherType <= 781)  emojiIcon = '🌪';
        else if (weatherType >= 801 && weatherType <= 804)  emojiIcon = '⛅';
        else if (weatherType == 800)  emojiIcon = '☀️';

        const text = `Погода в ${cityName}: ${emojiIcon} ${temp}°С`;
        
        callback(text)
    });

}

const addActionBot = (name, src, text) => {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery() // Что бы исчезли часики
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

const addActionBotText = (textTest) => {
    bot.action(textTest, async (ctx) => {
        try {
            await ctx.replyWithHTML(textTest,
                {disable_web_page_preview: true // Отключение отображения картинки в ссылке
                })
            } catch(e) {
                console.error(e)
            }
        })
    }
           

addActionBot('btn_1', './img/img1.png', text.text)
addActionBotText('btn_2', textTest.textTest)

bot.launch();
 
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));