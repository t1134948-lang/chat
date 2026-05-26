const TelegramBot = require('node-telegram-bot-api');
const token = '8907944426:AAFoxnzGYhTi7_C0VV1-KbB1k7taWgpW5Sg';
const bot = new TelegramBot(token, {polling: true});

let waitingUser = null;
let pairs = {};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Anonim chatga xush kelibsiz! /search tugmasini bosing.");
});

bot.onText(/\/search/, (msg) => {
    const chatId = msg.chat.id;
    if (waitingUser && waitingUser !== chatId) {
        pairs[chatId] = waitingUser;
        pairs[waitingUser] = chatId;
        bot.sendMessage(chatId, "Suhbatdosh topildi! Yozishni boshlang.");
        bot.sendMessage(waitingUser, "Suhbatdosh topildi! Yozishni boshlang.");
        waitingUser = null;
    } else {
        waitingUser = chatId;
        bot.sendMessage(chatId, "Suhbatdosh qidirilmoqda...");
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (pairs[chatId]) {
        bot.sendMessage(pairs[chatId], msg.text);
    }
});
