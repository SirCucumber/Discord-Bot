// console.log(message.author.presence.activities);

require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./config.json");
const birthdaysJSON = require("./files/notes/birthdays.json");
const TriggerWords = require("./features/TriggerWords.js");
const StreamAnnounce = require("./features/StreamAnnounce.js");
const Logs = require("./features/Logs.js");
const triggerwordsJSON = require("./files/notes/triggerwords.json");

bot.login(process.env.BOT_TOKEN_MASTER);
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) return console.log("Команды не найдены!");

    console.log(`Loaded ${jsfile.length} commands`);
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        bot.commands.set(props.help.name, props);
    });
});

// Триггеры на упоминания бота
bot.on("message", async message => {
    const textReply = triggerwordsJSON.botTriggerPhrase;
    const textPhrase = textReply[Math.floor(Math.random() * textReply.length)];
    if (message.mentions.has(bot.user.id)) {
        message.reply(textPhrase);
    }
});

// Триггеры на команды
bot.on("message", async message => {
    let prefix = config.Prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let command_file = bot.commands.get(command.slice(prefix.length));
    if (command_file) command_file.run(bot, message, args);
});

// Логи Модераторские
bot.on("messageUpdate", async (oldMessage, newMessage) => {
    new Logs().logsMessageUpdate(oldMessage, newMessage);
});

bot.on("messageDelete", async message => {
    new Logs().logsMessageDelete(message);
});

// Логи Полные
bot.on("channelCreate", async channel => {
    new Logs().logsChannelCreate(channel);
});

bot.on("channelDelete", async channel => {
    new Logs().logsChannelDelete(channel);
});

bot.on("roleCreate", async role => {
    new Logs().logsRoleCreate(role);
});

bot.on("roleDelete", async role => {
    new Logs().logsChannelDelete(role);
});

bot.on("roleUpdate", async (oldRole, newRole) => {
    new Logs().logsRoleUpdate(oldRole, newRole);
});

bot.on("emojiCreate", async emoji => {
    new Logs().logsEmojiCreate(emoji, bot);
});

bot.on("emojiUpdate", async emoji => {
    new Logs().logsEmojiUpdate(emoji, bot);
});

bot.on("emojiDelete", async emoji => {
    new Logs().logsEmojiDelete(emoji, bot);
});

bot.on("voiceStateUpdate", async (oldState, newState, message) => {
    new Logs().logsVoiceStateUpdate(oldState, newState, message);
});

bot.on("guildMemberUpdate", async (oldMember, newMember, message) => {
    new Logs().logsGuildMemberUpdate(oldMember, newMember, message);
});

// Триггеры на слова
bot.on("message", async message => {
    new TriggerWords().checkTriggerWords(bot, message);
});

// Анонсер стримов
bot.on("presenceUpdate", async (oldPresence, newPresence) => {
    new StreamAnnounce().checkStream(oldPresence, newPresence);
});

// Статус бота
bot.on("ready", () => {
    console.log(`${bot.user.username} online!`);

    setInterval(() => {
        const statusesNames = config.BotStatuses;
        const nameStatus =
            statusesNames[Math.floor(Math.random() * statusesNames.length)];
        bot.user.setPresence({
            status: "online",
            activity: {
                name: nameStatus,
                type: 1,
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
        });
    }, 60000);
});

// Фулл Логи = Бан
bot.on("guildBanAdd", async (guild, user) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Забанен участник")
        .addField("Забанен", user.username)
        .setColor("#FF0000")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Разбан
bot.on("guildBanRemove", async (guild, user) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Разбанен участник")
        .addField("Разбанен", user.username)
        .setColor("#00FF00")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Человек заходит на сервер
bot.on("guildMemberAdd", async member => {
    let channel = member.guild.channels.cache.find(
        c => c.id == config.UserJoinServerAnnounceChannel
    );

    let embed = new Discord.MessageEmbed()
        .setTitle("В королевство\nприбыл новый житель!")
        .setThumbnail(
            member.user.displayAvatarURL({ dynamic: true, size: 512 })
        )
        .setDescription(`Привет, ${member}.`)
        .setColor("RANDOM")
        .setImage(config.UserJoinServerImage)
        .setFooter(`Корнишонов стало: ${member.guild.memberCount}`)
        .setTimestamp();
    await channel.send({ embed: embed }).then(embedMessage => {
        embedMessage.react("755772772298260550");
    });
    await member.roles.add(config.UserJoinServerRole);
});

// Человек ливает с сервера
bot.on("guildMemberRemove", async member => {
    let channel = member.guild.channels.cache.find(
        c => c.id == config.UserLeaveServerAnnounceChannel
    );

    let embed = new Discord.MessageEmbed()
        .setTitle("Королевство\nне досчиталось жителя!")
        .setThumbnail(
            member.user.displayAvatarURL({ dynamic: true, size: 512 })
        )
        .setDescription(`Пока, ${member}.`)
        .setColor("RANDOM")
        .setImage(config.UserLeaveServerImage)
        .setFooter(`Корнишонов осталось: ${member.guild.memberCount}`)
        .setTimestamp();
    await channel.send({ embed: embed }).then(embedMessage => {
        embedMessage.react("755775832261394514");
    });
});

/* Проверка на ДР
function birthday() {
    let interval;
    if (new Date().getUTCHours() < 7) {
        let triggerDate = new Date().setUTCHours(7, 0, 0, 0);
        interval = triggerDate - Date.now();
    } else {
        let triggerDate = new Date(new Date().setUTCHours(31, 0, 0, 0));
        interval = triggerDate - Date.now();
    }

    setTimeout(() => {
        const birthdays = new Map(Object.entries(birthdaysJSON.birthdays));
        const birthdayUsers = birthdays.get(
            `${fill(new Date().getUTCDate())}.${fill(
                new Date().getUTCMonth() + 1
            )}`
        );
        console.log(birthdayUsers);
        if (birthdayUsers) {
            let channel = bot.channels.cache.find(
                c => c.id == "815513290917806101"
            );
            let birthdayText = "Bla-bla: ";
            birthdayUsers.forEach(userID => {
                birthdayText += `<@${userID}> `;
            });
            birthdayText += "Hooray!";
            channel.send(birthdayText);
        }

        birthday();
    }, interval);
}

bot.on("ready", () => {
    birthday();
});

function fill(n) {
    return ("00" + n).slice(-2);
} */

// Доска почета
/* bot.on("messageReactionAdd", async messageReaction => {
    let channel = messageReaction.message.guild.channels.cache.find(
        c => c.id == config.StarboardChannel
    );
    if (
        messageReaction.emoji.id == config.StarboardEmoji ||
        messageReaction.count == 1
    )
        if (
            messageReaction.message.attachments.size > 0 &&
            messageReaction.message.content.length == 0
        ) {
            let embedReact = new Discord.MessageEmbed()
                .setThumbnail(
                    messageReaction.message.author.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .addField("Автор", messageReaction.message.author, true)
                .addField("Канал", messageReaction.message.channel, true)
                .addField("\u200B", "\u200B", true)
                .addField(
                    "Оригинал",
                    `[Гиперпрыжок к медиа](${messageReaction.message.url})`
                )
                //.setFooter(`Поддержало: ${messageReaction.count}`)
                .setTimestamp();
            await channel.send(embedReact);
        } else if (
            messageReaction.message.attachments.size > 0 &&
            messageReaction.message.content.length > 0
        ) {
            let embedReact = new Discord.MessageEmbed()
                .setThumbnail(
                    messageReaction.message.author.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .addField("Автор", messageReaction.message.author, true)
                .addField("Канал", messageReaction.message.channel, true)
                .addField("\u200B", "\u200B", true)
                .addField("Сообщение", messageReaction.message.content)
                .addField(
                    "Оригинал",
                    `[Гиперпрыжок к сообщению](${messageReaction.message.url})`
                )
                //.setFooter(`Поддержало: ${messageReaction.count}`)
                .setTimestamp();
            await channel.send(embedReact);
        } else {
            let embedReact = new Discord.MessageEmbed()
                .setThumbnail(
                    messageReaction.message.author.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .addField("Автор", messageReaction.message.author, true)
                .addField("Канал", messageReaction.message.channel, true)
                .addField("\u200B", "\u200B", true)
                .addField("Сообщение", messageReaction.message.content)
                .addField(
                    "Оригинал",
                    `[Гиперпрыжок к сообщению](${messageReaction.message.url})`
                )
                //.setFooter(`Поддержало: ${messageReaction.count}`)
                .setTimestamp();
            await channel.send(embedReact);
        }
}); */
