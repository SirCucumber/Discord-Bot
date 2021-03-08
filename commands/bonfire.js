const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (bot, message, args) => {
    const linksGifToBonfire = config.BonfireLinksGif;
    // const filesGifToBonfire = "./files/images/Bonfire_Announce.gif";
    const linksInviteToBonfire = config.BonfireLinksInvite;
    const announceChannelForBonfire = config.BonfireAnnounceChannel;
    const randomNumberBonfire = Math.floor(Math.random() * 3);
    let choosePhraseForBonfire = "";

    switch (randomNumberBonfire) {
        case 0:
            choosePhraseForBonfire = "Костер ждет ваши сосисочки!";
            break;
        case 1:
            choosePhraseForBonfire = "Тупая фраза";
            break;
        case 2:
            choosePhraseForBonfire = "Еще одна тупая фраза";
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
