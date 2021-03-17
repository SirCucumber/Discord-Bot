const Discord = require("discord.js");
const config = require("../config.json");
const triggerwordsJSON = require("../files/notes/triggerwords.json");

module.exports.run = async (bot, message, args) => {
    //const freeCompanyNameJSON = triggerwordsJSON.freebie;
    const freeChannel = config.FreebieChannel;
    const freeCompany = message.content.split(" ").splice(1, 1);
    //let freeCompany = "";
    const freeLinks = message.content.split(" ").splice(1, 1);
    const freeInfo = message.content.split(" ").splice(2).join(" ");
    let embed = new Discord.MessageEmbed()
        .setTitle("Халявушка", true)
        .setTimestamp("https://i.imgur.com/wiRhYs4.png")
        .addField("Нашел", message.author, true)
        .addField("Магазин", freeCompany, true)
        .addField("\u200B", "\u200B", true)
        .addField("Доп.информация", freeInfo)
        .addField("Ссылка", freeLinks)
        .setTimestamp()
        .setColor("RANDOM");
    await message.guild.channels.cache
        .get(freeChannel)
        .send(embed)
        .then(message.delete({ timeout: 3000 }));
};

module.exports.help = {
    name: "freebie",
};
