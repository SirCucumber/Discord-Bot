const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const sinTime = message.content.split(" ").splice(2, 1);
    const sin = message.content.split(" ").splice(3).join(" ");
    const sinRole = message.guild.roles.cache.get(config.sinsRole);
    const sinMember = message.mentions.members.first();
    let emptyField = "\u200B";
    let emptyField2 = "\u200B";
    let embedSin = new Discord.MessageEmbed()
        .setTitle("Обнаружен грешник!", true)
        .setImage(`${config.sinsImageNotGood}?size=512`)
        .addField("Согрешил", sinMember, true)
        .addField("Осудил", message.author, true)
        .addField(emptyField, emptyField2, true)
        .addField("Грех", sin)
        .addField("Замаливание", `${sinTime} минут`, true)
        .addField(emptyField, emptyField2, true)
        .setFooter(`Вернется к нормальной жизни в `)
        .setColor("RANDOM");
    sinMember.roles.add(sinRole);
    await message.channel.send(embedSin).then(et => {
        setTimeout(() => {
            let embedSin = new Discord.MessageEmbed()
                .setTitle(`${sinMember.user.username} замолил грехи`)
                .setImage(`${config.sinsImageGood}?size=512`);
            et.edit(embedSin);
            sinMember.roles.remove(sinRole);
        }, sinTime * 10000);
    });
};

module.exports.help = {
    name: "slander",
};
