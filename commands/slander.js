const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const sinTime = message.content.split(" ").splice(2, 1);
    const sin = message.content.split(" ").splice(3).join(" ");
    const sinRole = message.guild.roles.cache.get(config.sinsRole);
    const sinMember = message.mentions.members.first();
    let embedSin = new Discord.MessageEmbed()
        .setTitle("Обнаружен грешник!", true)
        .setImage(`${config.sinsImageNotGood}?size=512`)
        .addField("Согрешил", sinMember, true)
        .addField("Осудил", message.author, true)
        .addField("\u200B", "\u200B", true)
        .addField("Грех", sin)
        .addField("Замаливание", `${sinTime} минут`, true)
        .addField("\u200B", "\u200B", true)
        .setFooter(`Вернется к нормальной жизни в `)
        .setColor("RANDOM");
    sinMember.roles.add(sinRole);
    if (message.member.roles.cache.has(config.commandsPermissionSlander)) {
        await message.channel.send(embedSin).then(et => {
            setTimeout(() => {
                let embedSin = new Discord.MessageEmbed()
                    .setTitle(`${sinMember.user.username} замолил грехи`)
                    .setImage(`${config.sinsImageGood}?size=512`);
                et.edit(embedSin);
                sinMember.roles.remove(sinRole);
            }, sinTime * 10000);
        });
    }
};

module.exports.help = {
    name: "slander",
};
