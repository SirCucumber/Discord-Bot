// Инвайт-бота = https://discord.com/oauth2/authorize?client_id=660750027882496031&permissions=8&scope=bot
// Инфа по созданию бота = https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-ru

// console.log(message.author.presence.activities);

require("dotenv").config();
const { getFips } = require("crypto");
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

bot.on("message", async message => {
    if (
        forbiddenWordsJSON.some(word => {
            return message.content.toLowerCase().includes(word);
        })
    ) {
        message.channel.send("Попався");
    }
    // console.log(message.author.presence.activities);
});

bot.on("guildMemberAdd", async member => {
    let role = member.guild.roles.cache.find(r => r.name == "Новенький");
    let channel = member.guild.channels.cache.find(c => c.name == "привет-пока");

    let embed = new Discord.MessageEmbed()
        .setTitle("В королевство\nприбыл новый житель!")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setDescription(`${member}`)
        .setColor("RANDOM")
        .setFooter(`Корнишонов стало:`)
        .setTimestamp()
        .setImage("https://i.imgur.com/Ow0yaBp.png");
    await channel.send(embed);
    //await member.addRole("816386721200472134");
});

bot.login(process.env.BOT_TOKEN);
bot.on("ready", () => {
    console.log(`${bot.user.username} online!`);
    bot.user.setPresence({
        status: "online",
        activity: {
            name: "ОГУРЕЦ ВЕРНУЛСЯ!",
            type: 1,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
    });
});
