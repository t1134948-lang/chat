const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

let waitingMale = null;  // Yigitlar navbati
let waitingFemale = null; // Qizlar navbati
let pairs = {};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 Anonim chatga xush kelibsiz! \nSuhbatdoshni tanlang:", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "👨 Yigit qidirish", callback_data: "search_male" }, { text: "👩 Qiz qidirish", callback_data: "search_female" }]
            ]
        }
    });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'search_male' || data === 'search_female') {
        // Qidiruv mantiqi (soddalashtirilgan)
        bot.sendMessage(chatId, "⏳ Qidirilmoqda...");
        
        // Bu yerda siz foydalanuvchilarni qaysi toifaga qo'shishni boshqarishingiz mumkin
        // Hozircha oddiy ulash funksiyasi (agar biror kishi kutayotgan bo'lsa ulaydi)
        if (data === 'search_male' && waitingMale) {
            pairs[chatId] = waitingMale;
            pairs[waitingMale] = chatId;
            bot.sendMessage(chatId, "✅ Suhbatdosh topildi!");
            bot.sendMessage(waitingMale, "✅ Suhbatdosh topildi!");
            waitingMale = null;
        } else {
            data === 'search_male' ? waitingMale = chatId : waitingFemale = chatId;
        }
    }
});

bot.on('message', (msg) => {
    if (msg.text && msg.text.startsWith('/')) return;
    const chatId = msg.chat.id;
    if (pairs[chatId]) {
        bot.sendMessage(pairs[chatId], msg.text);
    }
});
