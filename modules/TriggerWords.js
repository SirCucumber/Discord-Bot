const Discord = require("discord.js");
const config = require("../config.json");

const triggerwordsJSON = require("../files/notes/triggerwords.json");
const forbiddenWordsJSON = triggerwordsJSON.forbiddenWords;
const animeWordsJSON = triggerwordsJSON.animeWords;
const symbolWordsJSON = triggerwordsJSON.symbolWords;
const linksWordsJSON = triggerwordsJSON.linksWords;
const helloWordsJSON = triggerwordsJSON.helloWords;
const fWordsJSON = triggerwordsJSON.fWords;
const cookiesWordsJSON = triggerwordsJSON.cookiesWords;
const freeWordsJSON = triggerwordsJSON.freeWords;
const wutsWordsJSON = triggerwordsJSON.wutsWords;
const screamWordsJSON = triggerwordsJSON.screamWords;
const bonfireWordsJSON = triggerwordsJSON.bonfireWords;
const cucumberWordsJSON = triggerwordsJSON.cucumberWords;
const musicWordsJSON = triggerwordsJSON.musicWords;
const morningWordsJSON = triggerwordsJSON.morningWords;
const nightWordsJSON = triggerwordsJSON.nightWords;
const judgeWordsJSON = triggerwordsJSON.judgeWords;
const poopWordsJSON = triggerwordsJSON.poopWords;

class TriggerWords {
    async checkTriggerWords(bot, message) {
        const messageContentMassive = message.content
            .toLowerCase()
            .split(new RegExp("[!\"[\\]{}%^&=*$:№@~()#'?;/,.<>\\|`]+|\\s+"));
        // Запрещенные слова
        if (
            forbiddenWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.channel.send("У нас в королевстве так не выражаются!");
        }
        // Аниме
        if (
            animeWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("🚽");
        }
        // Символы
        if (
            symbolWordsJSON.some(word => {
                return message.content.toLowerCase().includes(word);
            })
        ) {
            message.channel.send("┬─┬ ノ( ゜-゜ノ)");
        }
        // Ссылки
        if (
            linksWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.reply(
                `༼ つ ◕_◕ ༽つ держи ||https://www.youtube.com/watch?v=dQw4w9WgXcQ||`
            );
        }
        // Приветствие
        if (
            helloWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("755772772298260550");
        }
        // Press F
        if (
            fWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("🇫");
        }
        // Печеньки
        if (
            cookiesWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.channel.send("https://youtu.be/xzRGxegXzYM");
        }
        // Халявушка
        if (
            freeWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("696709254274482207");
        }
        // Вуц
        if (
            wutsWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("695916372416528394");
        }
        // Кричалки
        if (
            screamWordsJSON.find(word => {
                return message.content.toLowerCase().includes(word);
            })
        ) {
            message.react("695916370776424479");
        }
        // Костер
        if (
            bonfireWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("696709254404636783");
        }
        // Кукубер
        if (
            cucumberWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("696709252277862513");
        }
        // Утро
        if (
            morningWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("700321938618318948");
        }
        // Ночь
        if (
            nightWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("695037044421820436");
        }
        // Осуждалка
        if (
            judgeWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.react("695037044141064202");
        }
        // Печеньки
        if (
            poopWordsJSON.some(word => {
                return messageContentMassive.includes(word);
            })
        ) {
            message.channel.send("https://i.imgur.com/gqW3cDm.gifv");
        }
        // NSFW
        if (
            (message.attachments.size > 0 || message.embeds.length > 0) &&
            message.channel == config.TriggerNsfwChannel
        ) {
            message.react("695916373104263258");
            message.react("696709252907270194");
        }
        // Музыка
        if (
            musicWordsJSON.find(word => {
                return message.content.toLowerCase().includes(word);
            }) &&
            message.channel == config.TriggerMusicChannel
        ) {
            message.react("695037044568752204");
        }
        // Харчевня
        if (
            (message.attachments.size > 0 || message.embeds.length > 0) &&
            message.channel == config.TriggerEatChannel
        ) {
            message.react("695544244068155402");
        }
    }
}

module.exports = TriggerWords;
