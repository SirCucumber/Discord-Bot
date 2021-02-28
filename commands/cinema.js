const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const linksGifToCinema = "https://i.imgur.com/0EkbKCZ.gif";
    // const filesGifToCinema = "./files/images/Cinema_Announce.gif";
    const linksInviteToCinema = "https://discord.gg/WMafhFZ";
    const announceChannelForCinema = "815513290917806101";
    const randomNumberCinema = Math.floor(Math.random() * 3);
    let choosePhraseForCinema = "";

    switch (randomNumberCinema) {
        case 0:
            choosePhraseForCinema = "Запасайся попкорном, наливай горячего чаю, укутывайся в теплый плед и бегом в наш кинотеатр!\nЖдем только тебя!";
            break;
        case 1:
            choosePhraseForCinema = "Случайная фраза";
            break;
        case 2:
            choosePhraseForCinema = "Очередная тупая фразочка";
            break;
    }
    if (message.member.roles.cache.has("815553104216457237")) {
        await message.guild.channels.cache.get(announceChannelForCinema).send(`@everyone\n${choosePhraseForCinema}\n${linksInviteToCinema}\n${linksGifToCinema}` /* , { files: [filesGifToCinema] } */);
    } else {
        await message.channel.send("Недостаточно прав!");
    }
};

module.exports.help = {
    name: "cinema",
};
