const Discord = require("discord.js");
const config = require("../config.json");
const bot = new Discord.Client();

bot.login(process.env.BOT_TOKEN);
require("dotenv").config();

class Logs {
    async logsMessageUpdate(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;
        let embed = new Discord.MessageEmbed()
            .setTitle("Сообщение изменено")
            .addField("Отправитель", oldMessage.member, true)
            .addField("Канал", oldMessage.channel, true)
            .addField("Раньше", oldMessage.content)
            .addField("Сейчас", newMessage.content)
            .setColor("#FFFF00")
            .setTimestamp();
        await oldMessage.guild.channels.cache
            .get(config.LogsModsChannel)
            .send(embed);
    }

    async logsMessageDelete(message) {
        if (message.author.bot) return;
        let embed = new Discord.MessageEmbed()
            .setTitle("Сообщение удалено")
            .addField("Отправитель", message.member, true)
            .addField("Канал", message.channel, true)
            .addField("Содержание", message.content)
            .setColor("#FF0000")
            .setTimestamp();
        await message.guild.channels.cache
            .get(config.LogsModsChannel)
            .send(embed);
    }

    async logsChannelCreate(channel) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Создан канал")
            .addField("Название канала", channel.name)
            .setColor("#00FF00")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsChannelDelete(channel) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Удален канал")
            .addField("Название канала", channel.name)
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsRoleCreate(role) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Создана роль")
            .addField("Роль", role.name)
            .setColor("#00FF00")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsRoleDelete(role) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Удалена роль")
            .addField("Роль", role.name)
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsRoleUpdate(oldRole, newRole) {
        if (oldRole.name !== newRole.name) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Изменено имя роли`)
                .addField(`Старое имя`, oldRole.name)
                .addField(`Новое имя`, newRole.name)
                .setColor("#FFFF00")
                .setTimestamp();
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        }
    }

    async logsEmojiCreate(emoji, bot) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Добавлен emoji")
            .addField("Эмоджи", emoji)
            .setColor("#00FF00")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsEmojiUpdate(emoji, bot) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Изменен emoji")
            .addField("Эмоджи", emoji)
            .setColor("#FFFF00")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsEmojiDelete(emoji, bot) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Удален emoji")
            .addField("Эмоджи", emoji)
            .setColor("#FF0000")
            .setTimestamp();
        await bot.channels.cache
            .find(ch => ch.id === config.LogsFullChannel)
            .send(embed);
    }

    async logsVoiceStateUpdate(oldState, newState, message) {
        if (oldState.channel != newState.channel) {
            if (newState.channel) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Тело подключилось")
                    .addField("Ник", newState.member.user.username)
                    .addField("Название канала", newState.channel.name)
                    .setColor("#FF0000")
                    .setTimestamp();
                await bot.channels.cache
                    .find(ch => ch.id === config.LogsFullChannel)
                    .send(embed);
            }
        }
    }

    async logsGuildMemberUpdate(oldMember, newMember, message) {
        if (newMember.roles.cache.size > oldMember.roles.cache.size) {
            let newRole;
            newMember.roles.cache.forEach((value, key) => {
                if (!oldMember.roles.cache.has(key)) newRole = value.name;
            });
            let embed = new Discord.MessageEmbed()
                .setTitle("Выдана роль")
                .addField("Новая роль", newRole)
                .setColor("#FF0000")
                .setTimestamp();
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        } else if (newMember.roles.cache.size < oldMember.roles.cache.size) {
            let oldRole;
            oldMember.roles.cache.forEach((value, key) => {
                if (!newMember.roles.cache.has(key)) oldRole = value.name;
            });
            let embed = new Discord.MessageEmbed()
                .setTitle("Отобрана роль")
                .addField("Изъятая роль", oldRole)
                .setColor("#FF0000")
                .setTimestamp();
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        } else if (oldMember.nickname != newMember.nickname) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Изменен никнейм")
                .addField(
                    "Старый ник",
                    oldMember.nickname || oldMember.user.username
                )
                .addField(
                    "Новый ник",
                    newMember.nickname || newMember.user.username
                )
                .setColor("#FF0000")
                .setTimestamp();
            await bot.channels.cache
                .find(ch => ch.id === config.LogsFullChannel)
                .send(embed);
        }
    }
}

module.exports = Logs;
