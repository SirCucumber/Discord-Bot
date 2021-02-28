// Инвайт-бота = https://discord.com/oauth2/authorize?client_id=660750027882496031&permissions=8&scope=bot
// Инфа по созданию бота = https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-ru

// console.log(message.author.presence.activities);

require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
const config = require("./config.json");
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
    fs.readFile("./files/notes/test.txt", "utf8", function (error, data) {
        //console.log("Асинхронное чтение файла");
        if (error) throw console.error;
        if (data.includes(message.content.toLowerCase())) {
            message.channel.send("Повався!");
        }
        //console.log(data);
    });
    /*     console.log("Синхронное чтение файла");
    let fileContect = fs.readFileSync("./files/notes/test.txt", "utf8");
    console.log(fileContect); */

    /*     let fileContect = fs.readFileSync("./files/notes/test.txt", "utf8");
fileContect.filter(word => {
    if (message.content.toLowerCase().includes(word)) {
        message.channel.send("Попався");
    }
}); */
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
