const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let online = message.guild.members.cache.filter(member => member.presence.status === "online").size;
    let idle = message.guild.members.cache.filter(member => member.presence.status === "idle").size;
    let dnd = message.guild.members.cache.filter(member => member.presence.status === "dnd").size;
    // let verifilv = ("Отсутствует", "Низкий", "Средний", "Высокий", "Очень высокий");
    let date = new Date(message.guild.createdTimestamp); // создана для добавления нуля к минутам поля "Сервер создан"
    let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(); // создана для добавления нуля к минутам поля "Сервер создан"
    // let members = message.guild.members.cache;
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .addField("Владелец", message.guild.owner, true)
        .addField("Ролей", message.guild.roles.cache.size, true)
        .addField("Смайлов", message.guild.emojis.cache.size, true)
        .addField("Участники:", `${message.guild.members.cache.filter(member => member.presence.status != "offline").size}\Онлайн: ${online}\nОтсутствуют: ${idle}\nНе беспокоить: ${dnd}`, true)
        .addField(
            "Всего | Людей | Ботов",
            `${message.guild.memberCount} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`,
            true
        )
        .addField(
            "Сервер создан",
            `${new Date(message.guild.createdTimestamp).getDate()}.${new Date(message.guild.createdTimestamp).getMonth()}.${new Date(message.guild.createdTimestamp).getFullYear()} в ${new Date(
                message.guild.createdTimestamp
            ).getHours()}:${minutes}`,
            true
        )
        //.addField("Регион", message.guild.region, true)
        //.addField("ID", message.guild.id, true)
        //.addField("Каналы", `${message.guild.channels.cache.filter(c => c.type == "text").size} тестовых\n${message.guild.channels.cache.filter(c => c.type == "voice").size} голосовых`, true)
        // .addField("Уровень проверки", verifilv.message.guild.verificationLevel, true) // РАЗОБРАТЬСЯ И ПОЧИНИТЬ
        //.addField("AFK Канал", message.guild.afkChannel.name, true)
        //.setFooter("Сервер создан")
        //.setTimestamp(new Date(message.guild.createdTimestamp))
        .setColor(0x32d160);
    //.setDescription(`Online: ${online}\nIdle: ${idle}\nDnd: ${dnd}`);
    await message.channel.send(embed);
    // console.log(guild); КОНСОЛЬ!
};

module.exports.help = {
    name: "serverinfo",
};
