const { message } = require("telegraf/filters"); // Выполняется импорт необходимых объектов из пакета Telegraf.
require("dotenv").config(); //  Считывает переменные окружения из файла `.env`.
const text = require("./const"); //
const textTest = require("./const");
const favorites = require("./const");
const openWeatherMapApiKey = "4b6f9e8b22638e50b8623881ed435161"; // API погоды
const request = require("request"); // Библиотека request используется для выполнения запроса к OpenWeatherMap API.
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN); // Создание нового экземпляра Telegraf-бота.
bot.start((ctx) => ctx.reply(` 😉 Hello ${ctx.message.from.first_name ? ctx.message.from.first_name : "stranger"}!`));
bot.help((ctx) => ctx.reply(text.commands));

bot.command("favorites", async (ctx) => {
  try {
    await ctx.replyWithHTML("<b>favorites</b>", Markup.inlineKeyboard([[Markup.button.callback("Favorites cityes", "btn_3")]]));
  } catch (e) {
    console.error(e);
  }
});

bot.command("settings", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Settings</b>",
      Markup.inlineKeyboard([[Markup.button.callback("My profile", "btn_1"), Markup.button.callback("Referral", "btn_2")]])
    );
  } catch (e) {
    console.error(e);
  }
});

// bot.on("btn_3");

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  console.log(msg);

  getCurrentWeather(msg.message.text, (messageText) => {
    bot.telegram.sendMessage(chatId, messageText);
  });
});

function getCurrentWeather(cityName, callback) {
  const encodeCityName = encodeURIComponent(cityName); // Декодируем кирилицу

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=ru&appid=${openWeatherMapApiKey}`;
  console.log(cityName);
  console.log(url);
  request(url, function (error, response, body) {
    if (error) return error;

    let info = JSON.parse(body);

    console.log(info);

    let weatherType = info.weather.id;
    let temp = info.main.temp;
    let emojiIcon = "";

    if (weatherType >= 200 && weatherType <= 232) emojiIcon = "⚡";
    else if (weatherType >= 300 && weatherType <= 321) emojiIcon = "☔";
    else if (weatherType >= 500 && weatherType <= 531) emojiIcon = "🌧";
    else if (weatherType >= 600 && weatherType <= 622) emojiIcon = "❄";
    else if (weatherType >= 701 && weatherType <= 781) emojiIcon = "🌪";
    else if (weatherType >= 801 && weatherType <= 804) emojiIcon = "⛅";
    else if (weatherType == 800) emojiIcon = "☀️";

    // bot.telegram.sendMessage(chatId, "loading...");

    const text = `⛅ Погода в ${cityName}: ${emojiIcon} ${temp}°С`;

    callback(text);
  });
}

const addActionBot = (name, src, text) => {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery(); // Что бы исчезли часики
      if (src !== false) {
        await ctx.replyWithPhoto({
          source: src,
        });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: true, // Отключение отображения картинки в ссылке
      });
    } catch (e) {
      console.error(e);
    }
  });
};

const addActionBotText = (textTest) => {
  bot.action(textTest, async (ctx) => {
    try {
      await ctx.replyWithHTML(textTest, {
        disable_web_page_preview: true, // Отключение отображения картинки в ссылке
      });
    } catch (e) {
      console.error(e);
    }
  });
};

const addActionFavorites = (favorites) => {
  bot.action(favorites, async (ctx) => {
    try {
      await ctx.replyWithHTML(favorites, {
        disable_web_page_preview: true, // Отключение отображения картинки в ссылке
      });
    } catch (e) {
      console.error(e);
    }
  });
};

addActionBot("btn_1", "./img/img1.png", text.text);
addActionBotText("btn_2", textTest.textTest);
addActionFavorites("btn_3", favorites.favorites);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
