// Инвайт-бота = https://discord.com/oauth2/authorize?client_id=660750027882496031&permissions=8&scope=bot
// Инфа по созданию бота = https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-ru

// console.log(message.author.presence.activities);

require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./config.json");
const triggerwordsJSON = require("./files/notes/triggerwords.json");
const forbiddenWordsJSON = triggerwordsJSON.forbiddenWords;

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

// Триггер на команды
bot.on("message", async message => {
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let command_file = bot.commands.get(command.slice(prefix.length));
    if (command_file) command_file.run(bot, message, args);

    /*     if (message.content.startsWith(prefix + "Привет")) {
        message.channel.send("Ну, привет, коли не шутишь!");
    } */
});

// Запрещенные слова
bot.on("message", async message => {
    if (
        forbiddenWordsJSON.some(word => {
            return message.content.toLowerCase().includes(word);
        })
    ) {
        message.channel.send("Попався");
    }
});

bot.login(process.env.BOT_TOKEN);

// Статус бота
bot.on("ready", () => {
    console.log(`${bot.user.username} online!`);

    setInterval(() => {
        const statusesNames = [`ОГУРЕЦ ВЕРНУЛСЯ!`, `ИЗВИНИСЬ!`, `КУ! КУКУМБА!`, `Продам гараж`];

        const nameStatus = statusesNames[Math.floor(Math.random() * statusesNames.length)];
        bot.user.setPresence({
            status: "online",
            activity: {
                name: nameStatus,
                type: 1,
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
        });
    }, 24000);
});

// Человек заходит на сервер
bot.on("guildMemberAdd", async member => {
    let channel = member.guild.channels.cache.find(c => c.id == "543340636494102546");

    let embed = new Discord.MessageEmbed()
        .setTitle("В королевство\nприбыл новый житель!")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setDescription(`Привет, ${member}.`)
        .setColor("#0cff00")
        .setImage("https://i.imgur.com/K0ItPyv.png")
        .setFooter(`Корнишонов стало: ${member.guild.memberCount}`)
        .setTimestamp();
    await channel.send(embed);
});

// Человек ливает с сервера
bot.on("guildMemberRemove", async member => {
    let channel = member.guild.channels.cache.find(c => c.id == "543340636494102546");

    let embed = new Discord.MessageEmbed()
        .setTitle("Королевство\nне досчиталось жителя!")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setDescription(`Пока, ${member}.`)
        .setColor("ff0000")
        .setImage("https://i.imgur.com/X6iqBfb.png")
        .setFooter(`Корнишонов осталось: ${member.guild.memberCount}`)
        .setTimestamp();
    await channel.send(embed);
});
