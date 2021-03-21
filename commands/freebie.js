const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    let freeCompany;
    const freeChannel = config.FreebieChannel;
    const freeLinks = message.content.split(" ").splice(1, 1);
    let messageContent = message.content
        .toLowerCase()
        .split(new RegExp("[!\"[\\]{}%^&=*$:№@~#'?;/,.<>\\|`]+|\\s+"));
    let freeInfo = message.content.split(" ").splice(2).join(" ");

    if (messageContent.indexOf("steampowered") != -1) {
        freeCompany = "Steam";
    } else if (messageContent.indexOf("epicgames") != -1) {
        freeCompany = "Epic Games";
    } else if (messageContent.indexOf("ubisoft") != -1) {
        freeCompany = "Ubisoft";
    } else if (messageContent.indexOf("gog") != -1) {
        freeCompany = "GOG";
    } else if (messageContent.indexOf("humblebundle") != -1) {
        freeCompany = "Humble Bundle";
    } else if (messageContent.indexOf("origin") != -1) {
        freeCompany = "Origin";
    } else {
        freeCompany = "Что-то непонятное";
    }

    if (freeInfo == NaN || freeInfo == undefined || freeInfo.length == 0) {
        freeInfo = "Сыр в мышеловке";
    }

    let embed = new Discord.MessageEmbed()
        .setTitle("Халявушка", true)
        .addField("Нашел", message.author)
        .addField("Магазин", freeCompany)
        .addField("Информация", freeInfo)
        .addField("Ссылка", `[Ссылочка на раздачу](${freeLinks})`)
        .setTimestamp()
        .setColor("RANDOM");
    await message.guild.channels.cache
        .get(freeChannel)
        .send(embed)
        .then(message.delete({ timeout: 3000 }))
        .then(embedMessage => {
            embedMessage.react("696709254274482207");
        });
};

module.exports.help = {
    name: "freebie",
};
