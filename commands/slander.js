const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const sinTime = message.content.split(" ").splice(2, 1) * 60000;
    const sin = message.content.split(" ").splice(3).join(" ");
    const sinRole = message.guild.roles.cache.get(config.sinsRole);
    const sinMember = message.mentions.members.first();
    const embed = new Discord.MessageEmbed()
        .setTitle("Обнаружен грешник!", true)
        .setThumbnail(config.sinsImage)
        .addField("Согрешил", sinMember, true)
        .addField("Осудил", message.author, true)
        .addField("Грех", sin)
        .addField("Замаливание", `${sinTime / 60000} минут`)
        .setFooter(`Вернется к нормальной жизни в `)
        .setColor("RANDOM");
    await message.channel.send(embed);
    sinMember.roles.add(sinRole);
    setTimeout(
        () =>
            sinMember.roles.remove(sinRole) &&
            message.channel.send(`${sinMember} замолил грехи`),
        sinTime
    );

    //console.log(sinTime);
};

module.exports.help = {
    name: "slander",
};
