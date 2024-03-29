const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const linksGifToCinema = config.CinemaLinksGif;
    // const filesGifToCinema = "./files/images/Cinema_Announce.gif";
    const linksInviteToCinema = config.CinemaLinksInvite;
    const announceChannelForCinema = config.CinemaAnnounceChannel;
    const randomNumberCinema = Math.floor(Math.random() * 3);
    let choosePhraseForCinema = "";

    switch (randomNumberCinema) {
        case 0:
            choosePhraseForCinema =
                "Запасайся попкорном, наливай горячего чаю, укутывайся в теплый плед и бегом в наш кинотеатр!\nЖдем только тебя!";
            break;
        case 1:
            choosePhraseForCinema =
                "Я собираюсь сделать ему предложение, от которого он не сможет отказаться. Так что наложил покушать и бегом С нами смотреть киношечку!";
            break;
        case 2:
            choosePhraseForCinema =
                "Мы тут кино смотреть собрались. То самое, с тем самым актером, который снимался в том самом фильме, что вышел совсем недавно.";
            break;
    }
    if (message.member.roles.cache.has("213743023874506753")) {
        await message.guild.channels.cache
            .get(announceChannelForCinema)
            .send(
                `@everyone\n${choosePhraseForCinema}\n${linksInviteToCinema}\n${linksGifToCinema}` /* , { files: [filesGifToCinema] } */
            );
    } else {
        await message.channel.send("Недостаточно прав!");
    }
};

module.exports.help = {
    name: "cinema",
};
