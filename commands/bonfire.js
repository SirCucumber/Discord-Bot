const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const linksGifToBonfire = "https://i.imgur.com/S6UV72e.gif";
    // const filesGifToBonfire = "./files/images/Bonfire_Announce.gif";
    const linksInviteToBonfire = "https://discord.gg/8AtCHXH";
    const announceChannelForBonfire = "213736387818553344";
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
            .send(`@everyone\n${choosePhraseForBonfire}\n${linksInviteToBonfire}\n${linksGifToBonfire}` /* , { files: [filesGifToBonfire] } */);
    } else {
        await message.channel.send("Недостаточно прав!");
    }
};

module.exports.help = {
    name: "bonfire",
};
