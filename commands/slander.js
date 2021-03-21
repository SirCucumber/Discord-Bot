const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const sinTime = message.content.split(" ").splice(2, 1);
    const sin = message.content.split(" ").splice(3).join(" ");
    const sinRole = message.guild.roles.cache.get(config.SinsRole);
    const sinMember = message.mentions.members.first();

    if (sinTime.length == 0 || sinMember.length == 0 || sin.length == 0) {
        return message.channel
            .send("Не указан грех, его продолжительность или сам грешник")
            .then(message.delete({ timeout: 15000 }));
    }

    let embedSin = new Discord.MessageEmbed()
        .setTitle("Обнаружен грешник!", true)
        .setImage(`${config.SinsImageNotGood}?size=512`)
        .addField("Согрешил", sinMember, true)
        .addField("Осудил", message.author, true)
        .addField("\u200B", "\u200B", true)
        .addField("Грех", sin)
        .addField("Замаливание", `${sinTime} минут`, true)
        .addField("\u200B", "\u200B", true)
        .setFooter(`Вернется к нормальной жизни в `)
        .setColor("RANDOM");
    sinMember.roles.add(sinRole);
    message.delete({ timeout: 3000 });
    if (message.member.roles.cache.has(config.CommandsPermissionSlander)) {
        await message.channel.send(embedSin).then(et => {
            setTimeout(() => {
                let embedSin = new Discord.MessageEmbed()
                    .setTitle(`${sinMember.user.username} замолил грехи`)
                    .setImage(`${config.SinsImageGood}?size=512`);
                et.edit(embedSin);
                sinMember.roles.remove(sinRole);
            }, sinTime * 60000);
        });
    }
};

module.exports.help = {
    name: "slander",
};
