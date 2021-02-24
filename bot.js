// Инвайт-бота = https://discord.com/oauth2/authorize?client_id=660750027882496031&permissions=8&scope=bot
// Инфа по созданию бота = https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js-ru

require("dotenv").config();
const Discord = require("discord.js");
// const config = require("./config.json");

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

const prefix = "!";

client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLocaleLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
});
