const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const linksGifToBonfire = config.BonfireLinksGif;
    // const filesGifToBonfire = "./files/images/Bonfire_Announce.gif";
    const linksInviteToBonfire = config.BonfireLinksInvite;
    const announceChannelForBonfire = config.BonfireAnnounceChannel;
    const randomNumberBonfire = Math.floor(Math.random() * 8);
    let choosePhraseForBonfire = "";

    switch (randomNumberBonfire) {
        case 0:
            choosePhraseForBonfire = "Костер ждет ваши сосисочки!";
            break;
        case 1:
            choosePhraseForBonfire =
                "Этот костер ничего не сжигает — он согревает.";
            break;
        case 2:
            choosePhraseForBonfire =
                "Алло, чатик? У нас тут огонь! Вот прям ваще огонь!";
            break;
        case 3:
            choosePhraseForBonfire =
                "Нашу компанию бардов выселили из номера гостиницы не потому, что громко играли на гитаре, а потому что у костра. Пришлось переносить костер сюда.";
            break;
        case 4:
            choosePhraseForBonfire =
                "Опытные туристы знают: вечером, у костра , после первой бутылки исчезают комары, после второй кончается дождь, после третьей исчезает сознание. Так вот... мы открываем четверую бутылку.";
            break;
        case 5:
            choosePhraseForBonfire =
                "Непонятно, почему достаточно одной спички, чтобы сжечь лес, но приходится потратить полкоробка, чтобы разжечь небольшой костёр. Несите еще спички!";
            break;
        case 6:
            choosePhraseForBonfire =
                "В каждой компании, выбирающейся на отдых в лес, есть загадочный молчун, приносящий новые ветки для костра и подбрасывающий их в огонь. Нет времени объяснять. Тащи ветки!";
            break;
        case 7:
            choosePhraseForBonfire =
                "Бесконечно можно смотреть на три вещи: как горит костер, как как горят штаны того, кто сел жопой на этот костер и как Алексейка извиняется у костра.";
            break;
    }
    if (message.member.roles.cache.has("213743023874506753")) {
        await message.guild.channels.cache
            .get(announceChannelForBonfire)
            .send(
                `@everyone\n${choosePhraseForBonfire}\n${linksInviteToBonfire}\n${linksGifToBonfire}` /* , { files: [filesGifToBonfire] } */
            );
    } else {
        await message.channel.send("Недостаточно прав!");
    }
};

module.exports.help = {
    name: "bonfire",
};
