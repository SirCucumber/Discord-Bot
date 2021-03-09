const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const onlineMembers = message.guild.members.cache.filter(
        member => member.presence.status === "online"
    ).size;
    const idleMembers = message.guild.members.cache.filter(
        member => member.presence.status === "idle"
    ).size;
    const dndMembers = message.guild.members.cache.filter(
        member => member.presence.status === "dnd"
    ).size;
    const allMembers = message.guild.members.cache.size;
    const emojicount = message.guild.emojis.cache;
    const dateCreateGuild = new Date(message.guild.createdTimestamp);
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .addField("Владелец:", message.guild.owner, true)
        .addField(
            "Сервер создан:",
            `${fill(dateCreateGuild.getUTCDate())}.${fill(
                dateCreateGuild.getUTCMonth()
            )}.${fill(dateCreateGuild.getUTCFullYear())} в ${fill(
                dateCreateGuild.getUTCHours()
            )}:${fill(dateCreateGuild.getUTCMinutes())}`,
            true
        )
        .addField("Роли:", `Всего: ${message.guild.roles.cache.size}`, true)
        .addField(
            "Участники:",
            `Всего: ${allMembers}\nОнлайн: ${onlineMembers}\nОтсутствуют: ${idleMembers}\nНе беспокоить: ${dndMembers}`,
            true
        )
        .addField(
            "Смайлы:",
            `Всего: ${emojicount.size}\nНе анимированных: ${
                emojicount.filter(emoji => !emoji.animated).size
            }\nАнимированных: ${
                emojicount.filter(emoji => emoji.animated).size
            }`,
            true
        )
        .setColor("RANDOM")
        .setFooter(
            `© ${
                message.guild.name
            } ${dateCreateGuild.getFullYear()}-${new Date().getFullYear()}`
        );
    if (message.member.roles.cache.has("449679001670123523")) {
        await message.channel.send("Недостаточно прав!");
    } else {
        await message.channel.send(embed);
    }
    //console.log(message.author.presence.activities); // КОНСОЛЬ!
};

function fill(n) {
    return ("00" + n).slice(-2);
}

module.exports.help = {
    name: "serverinfo",
};
