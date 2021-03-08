const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const member = message.guild.member(
        message.mentions.users.first() ||
            message.guild.members.cache.get(args[0])
    );
    let argsUser;
    let statusDiscription = [];
    if (member) argsUser = member.user;
    else argsUser = message.author;

    /* const statuses = {
        online: "В сети",
        idle: "Нет на месте",
        dnd: "Не беспокоить",
        offline: "Не в сети",
    }; */

    let playing;
    let streaming;
    let listening;
    let watching;
    let custom;

    // PLAYING
    const presenceP = argsUser.presence.activities.filter(
        x => x.type === "PLAYING"
    );
    let timePlaying = "";
    if (presenceP.length == 0) {
        timePlaying = "";
    } else {
        timePlaying = `${fill(
            new Date(new Date() - presenceP[0].timestamps.start).getUTCHours()
        )}:${fill(
            new Date(new Date() - presenceP[0].timestamps.start).getUTCMinutes()
        )}:${fill(
            new Date(new Date() - presenceP[0].timestamps.start).getUTCSeconds()
        )}`;
    }
    if (presenceP.length == 0) playing = "";
    else if (presenceP[0].type == "PLAYING")
        (playing = `**Играет** в **${presenceP[0].name}** уже ${timePlaying}`) &&
            statusDiscription.push(`${playing}`);

    // STREAMING
    const presenceS = argsUser.presence.activities.filter(
        x => x.type === "STREAMING"
    );
    twitchLink = "";
    if (presenceS.length == 0) {
        twitchLink = "";
    } else {
        twitchLink = presenceS[0].url;
    }
    if (presenceS.length == 0) streaming = "";
    else if (presenceS[0].type == "STREAMING")
        (streaming = `**Стримит** на ${presenceS[0].name}: [${presenceS[0].state} - ${presenceS[0].details}](${twitchLink})`) &&
            statusDiscription.push(`${streaming}`);

    // LISTENING
    const presenceL = argsUser.presence.activities.filter(
        x => x.type === "LISTENING"
    );
    let songLink = "";
    if (presenceL.length == 0) {
        songLink = "";
    } else {
        songLink = `https://open.spotify.com/track/${presenceL[0].syncID}`;
    }
    if (presenceL.length == 0) {
        listening = "";
    } else if (presenceL[0].type == "LISTENING")
        (listening = `**Слушает** в ${presenceL[0].name}: [${presenceL[0].state} - ${presenceL[0].details}](${songLink})`) &&
            statusDiscription.push(`${listening}`);

    // WATCHING
    const presenceW = argsUser.presence.activities.filter(
        x => x.type === "WATCHING"
    );
    if (presenceW.length == 0) watching = "";
    else if (presenceW[0].type == "WATCHING")
        (watching = `**Смотрит:** ${presenceW[0].name}`) &&
            statusDiscription.push(`${watching}`);

    // CUSTOM_STATUS
    const presenceCS = argsUser.presence.activities.filter(
        x => x.type === "CUSTOM_STATUS"
    );
    if (presenceCS.length == 0) custom = "";
    else if (presenceCS[0].type == "CUSTOM_STATUS")
        (custom = `**Кастомный статус:** <:${presenceCS[0].emoji.name}:${presenceCS[0].emoji.id}> ${presenceCS[0].state}`) &&
            statusDiscription.push(`${custom}`);

    const day = 1000 * 60 * 60 * 24;
    const date1 = new Date(message.createdTimestamp);
    const date2 = new Date(argsUser.createdTimestamp);
    const date3 = new Date(message.guild.member(argsUser).joinedTimestamp);
    const diff1 = Math.round(
        Math.abs((date1.getTime() - date2.getTime()) / day)
    );
    const diff2 = Math.round(
        Math.abs((date1.getTime() - date3.getTime()) / day)
    );

    const dateCreateUser = new Date(argsUser.createdTimestamp);
    const dateJoinGuild = new Date(
        message.guild.member(argsUser).joinedTimestamp
    );

    const embed = new Discord.MessageEmbed()
        .setTitle(`Информация о пользователе ${argsUser.username}`)
        .setThumbnail(argsUser.displayAvatarURL({ dynamic: true, size: 512 }))
        .setDescription(statusDiscription)
        .addField(
            "Дата регистрации",
            `${fill(dateCreateUser.getUTCDate())}.${fill(
                dateCreateUser.getUTCMonth() + 1
            )}.${fill(dateCreateUser.getUTCFullYear())} в ${fill(
                dateCreateUser.getUTCHours()
            )}:${fill(dateCreateUser.getUTCMinutes())}\n(${diff1} дн. назад)`,
            true
        )
        .addField(
            `Дата вступления`,
            `${fill(dateJoinGuild.getUTCDate())}.${fill(
                dateJoinGuild.getUTCMonth() + 1
            )}.${fill(dateJoinGuild.getUTCFullYear())} в ${fill(
                dateJoinGuild.getUTCHours()
            )}:${fill(dateJoinGuild.getUTCMinutes())}\n(${diff2} дн. назад)`,
            true
        )
        .addField(
            "Роли",
            message.guild
                .member(argsUser)
                .roles.cache.filter(r => r.id != message.guild.id)
                .map(role => role.name)
                .join(", ") || "Не имеет"
        )
        .setColor(message.guild.member(argsUser).displayHexColor)
        .setTimestamp();

    await message.channel.send(embed);
    //console.log(message.author.presence.activities);
};

function fill(n) {
    return ("00" + n).slice(-2);
}

module.exports.help = {
    name: "userinfo",
};
