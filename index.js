const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions}= require ('./options')
const token = '6033819601:AAHIZHrYHxw88jGD8-u7WkaYoAHqeA33rf4'
const bot = new TelegramApi(token, {polling: true})

const chats = {}


bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Я знаю кто ты'},
    {command: '/game', description: 'Угадай число'},
])

const game = async (chatId)=>{
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 1 до 9, твоя задача угадать его`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats.chatId = randomNumber
    await bot.sendMessage(chatId, 'отгадывай', gameOptions)
}
const start = () => {
    bot.on('message', async msg => {
        const {text} = msg
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp')
            return bot.sendMessage(chatId, `Welcome in my bot`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `your name ${msg.chat.username}, but your try name ${msg.chat.first_name} `)
        }
        if (text === '/game') {
           return game(chatId)
        }
        return bot.sendMessage(chatId, ` я тебя не понимаю)`)
    })
    bot.on('callback_query', async msg => {
        console.log(msg)
        const {data} = msg
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return game(chatId)
        }
        if (chats.chatId === +data) return await bot.sendMessage(chatId, `Верно! бот загадал число ${chats.chatId}`,againOptions)
        await bot.sendMessage(chatId, `НЕ верно! бот загадал число ${chats.chatId}`,againOptions)
    })

}
start()