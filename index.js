const TelegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./option");

const token = "7168540153:AAECF9Cn3bLw2spT5O_o7MXFRHuvK-xfZiI";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты угадывай"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/anim", description: "Гифка" },
    { command: "/game", description: "Мини игра" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/4e9/f82/4e9f8261-7c25-3624-b040-323197eaf136/1.webp"
      );
      return bot.sendMessage(
        chatId,
        "Добро пожаловать! Данный бот создан для того чтобы вести трекер привычек"
      );
    }
    if (text === "/anim") {
      return bot.sendAnimation(
        chatId,
        "https://media.giphy.com/media/137qIhWsIf9bDW/giphy.gif?cid=790b7611zkobn91tjosituibdq090iq8efx4kdldq0vi6zr1&ep=v1_gifs_search&rid=giphy.gif&ct=g"
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Данная команда мне неизвестна");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    console.log(msg);
    console.log(chats[chatId]);
    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === String(chats[chatId])) {
      return await bot.sendMessage(
        chatId,
        `Вы угадали: ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Вы не угадали: ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
