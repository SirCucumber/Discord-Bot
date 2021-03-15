// Инвайт-бота = https://discord.com/oauth2/authorize?client_id=660750027882496031&permissions=8&scope=bot
// Инфа по созданию бота = https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-ru

// console.log(message.author.presence.activities);

require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./config.json");

const { ApiClient, TeamWithUsers } = require("twitch");
const {
    AccessToken,
    RefreshableAuthProvider,
    StaticAuthProvider,
} = require("twitch-auth");

const clientId = process.env.clientId;
const accessToken = process.env.accessToken;
const clientSecret = process.env.clientSecret;
const refreshToken = process.env.refreshToken;
const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
        clientSecret,
        refreshToken,
        onRefresh: token => {},
    }
);

let streamerViews = 0;
let streamerFollowers;
let streamerNickname;
let streamerId;
let streamingActivity;

bot.on("presenceUpdate", async (oldPresence, newPresence) => {
    const apiClient = new ApiClient({ authProvider });

    if (oldPresence === undefined || newPresence === undefined) {
        return;
    }
    if (newPresence.member.roles.cache.has("531871243163533323")) {
        streamingActivity = newPresence.activities.find(
            a => a.type === "STREAMING"
        );
        if (streamingActivity == undefined) {
            return;
        }
        if (
            !oldPresence.activities.find(a => a.type === "STREAMING") &&
            streamingActivity
        ) {
            streamerNickname = streamingActivity.url.split("/").splice(3, 2);

            apiClient.helix.users
                .getUserByName(streamerNickname[0])
                .then(channel => {
                    streamerViews = channel.views;
                    apiClient.helix.users
                        .getUserByName(streamerNickname[0])
                        .then(user => {
                            streamerId = user.id;
                            apiClient.helix.users
                                .getFollows({ followedUser: `${streamerId}` })
                                .then(f => {
                                    streamerFollowers = f.total;

                                    let embed = new Discord.MessageEmbed()
                                        .setTitle("Обнаружен стример!")
                                        .setThumbnail(
                                            newPresence.member.user.displayAvatarURL(
                                                {
                                                    dynamic: true,
                                                    size: 512,
                                                }
                                            )
                                        )
                                        .addField(
                                            "Стример",
                                            newPresence.user.username,
                                            true
                                        )
                                        .addField(
                                            "Категория",
                                            streamingActivity.state,
                                            true
                                        )
                                        .addField("\u200B", "\u200B", true)
                                        .addField(
                                            "Просмотров",
                                            streamerViews,
                                            true
                                        )
                                        .addField(
                                            "Фолловеров",
                                            streamerFollowers,
                                            true
                                        )
                                        .addField("\u200B", "\u200B", true)
                                        .addField(
                                            "Название",
                                            streamingActivity.details
                                        )
                                        .addField(
                                            "Twitch",
                                            `[Ссылочка на трансляцию](${streamingActivity.url})`
                                        )
                                        .setColor("#6441a5")
                                        .setFooter(
                                            `© ${
                                                newPresence.guild.name
                                            } ${new Date(
                                                newPresence.guild.createdTimestamp
                                            ).getFullYear()}-${new Date().getFullYear()}`
                                        )
                                        .setTimestamp();
                                    bot.channels.cache
                                        .find(
                                            ch =>
                                                ch.id ===
                                                config.StreamersChannel
                                        )
                                        .send(embed);
                                });
                        });
                });
        }
    }
});

const triggerwordsJSON = require("./files/notes/triggerwords.json");
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

// Триггеры на команды
bot.on("message", async message => {
    let prefix = config.Prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let command_file = bot.commands.get(command.slice(prefix.length));
    if (command_file) command_file.run(bot, message, args);

    /*     if (message.content.startsWith(prefix + "Привет")) {
        message.channel.send("Ну, привет, коли не шутишь!");
    } */
});

// Триггеры на слова
bot.on("message", async message => {
    const messageContentMassive = message.content
        .toLowerCase()
        .split(new RegExp("[!\"[\\]{}%^&=*$:№@~#'?;/,.<>\\|`]+|\\s+"));
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
});

bot.login(process.env.BOT_TOKEN);

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

// Логи Модерские = Редактирование сообщения
bot.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;
    let embed = new Discord.MessageEmbed()
        .setTitle("Сообщение изменено")
        .addField("Отправитель", oldMessage.member, true)
        .addField("Канал", oldMessage.channel, true)
        .addField("Раньше", oldMessage.content)
        .addField("Сейчас", newMessage.content)
        .setColor("#FFFF00")
        .setTimestamp();
    await oldMessage.guild.channels.cache
        .get(config.LogsModsChannel)
        .send(embed);
});

// Логи Модерские = Удаление сообщения
bot.on("messageDelete", async message => {
    if (message.author.bot) return;
    let embed = new Discord.MessageEmbed()
        .setTitle("Сообщение удалено")
        .addField("Отправитель", message.member, true)
        .addField("Канал", message.channel, true)
        .addField("Содержание", message.content)
        .setColor("#FF0000")
        .setTimestamp();
    await message.guild.channels.cache.get(config.LogsModsChannel).send(embed);
});

// Фулл Логи = Создание канала
bot.on("channelCreate", async channel => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Создан канал")
        .addField("Название канала", channel.name)
        .setColor("#00FF00")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Удаление канала
bot.on("channelDelete", async channel => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Удален канал")
        .addField("Название канала", channel.name)
        .setColor("#FF0000")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Создание роли
bot.on("roleCreate", async role => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Создана роль")
        .addField("Роль", role.name)
        .setColor("#00FF00")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Удаление роли
bot.on("roleDelete", async role => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Удалена роль")
        .addField("Роль", role.name)
        .setColor("#FF0000")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Обновление роли
bot.on("roleUpdate", async (oldRole, newRole) => {
    /*     if (oldRole.permissions !== newRole.permissions) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Role changed permissions`)
            .setColor("#ffc500")
            .setFooter(`ID: ${newRole.id} 🔥`)
            .setTimestamp();

        const oldPerms = oldRole.permissions;
        const newPerms = newRole.permissions;

        const permUpdated = [];

        for (const [key, element] of Object.entries(oldPerms)) {
            if (newPerms[key] !== element) permUpdated.push(key);
        }

        if (oldRole.permissions > newRole.permissions) {
            //Permission lost

            embed.setDescription(
                `**${newRole.toString()} has lost the ${permUpdated.join(
                    ", "
                )} permission**`
            );
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        } else if (oldRole.permissions < newRole.permissions) {
            //Permission given

            embed.setDescription(
                `**${newRole.toString()} has been given the ${permUpdated.join(
                    ", "
                )} permission**`
            );
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        }
    } */
    if (oldRole.name !== newRole.name) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Изменено имя роли`)
            .addField(`Старое имя`, oldRole.name)
            .addField(`Новое имя`, newRole.name)
            .setColor("#FFFF00")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }
});

// Фулл Логи = Выдана/Отобрана роль // Изменен никнейм
bot.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (newMember.roles.cache.size > oldMember.roles.cache.size) {
        let newRole;
        newMember.roles.cache.forEach((value, key) => {
            if (!oldMember.roles.cache.has(key)) newRole = value.name;
        });
        let embed = new Discord.MessageEmbed()
            .setTitle("Выдана роль")
            .addField("Новая роль", newRole)
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    } else if (newMember.roles.cache.size < oldMember.roles.cache.size) {
        let oldRole;
        oldMember.roles.cache.forEach((value, key) => {
            if (!newMember.roles.cache.has(key)) oldRole = value.name;
        });
        let embed = new Discord.MessageEmbed()
            .setTitle("Отобрана роль")
            .addField("Изъятая роль", oldRole)
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    } else if (oldMember.nickname != newMember.nickname) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Изменен никнейм")
            .addField(
                "Старый ник",
                oldMember.nickname || oldMember.user.username
            )
            .addField(
                "Новый ник",
                newMember.nickname || newMember.user.username
            )
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }
});

bot.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channel != newState.channel) {
        if (newState.channel) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Тело подключилось")
                .addField("Ник", newState.member.user.username)
                .addField("Название канала", newState.channel.name)
                .setColor("#FF0000")
                .setTimestamp();
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        }
    }
});

// Фулл Логи = Добавлен эмодзи
bot.on("emojiCreate", async emoji => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Добавлен emoji")
        .addField("Эмоджи", emoji)
        .setColor("#00FF00")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Изменен эмодзи
bot.on("emojiUpdate", async emoji => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Изменен emoji")
        .addField("Эмоджи", emoji)
        .setColor("#FFFF00")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
});

// Фулл Логи = Удален эмодзи
bot.on("emojiDelete", async emoji => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Удален emoji")
        .addField("Эмоджи", emoji)
        .setColor("#FF0000")
        .setTimestamp();
    await bot.channels.cache
        .find(ch => ch.id === config.LogsFullChannel)
        .send(embed);
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
