const Discord = require("discord.js");
const config = require("../config.json");
const bot = new Discord.Client();

bot.login(process.env.BOT_TOKEN);
require("dotenv").config();

const { ApiClient, TeamWithUsers } = require("twitch");
const {
    AccessToken,
    RefreshableAuthProvider,
    StaticAuthProvider,
} = require("twitch-auth");

const clientId = process.env.clientId;
const accessToken = process.env.accessToken;
const clientSecret = process.env.clientSecret;
const refreshToken = process.env.refreshToken;
const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
        clientSecret,
        refreshToken,
        onRefresh: token => {},
    }
);

let streamerViews = 0;
let streamerFollowers;
let streamerNickname;
let streamerId;
let streamingActivity;

class StreamAnnounce {
    async checkStream(oldPresence, newPresence) {
        const apiClient = new ApiClient({ authProvider });

        if (oldPresence === undefined || newPresence === undefined) {
            return;
        }
        if (newPresence.member.roles.cache.has("531871243163533323")) {
            streamingActivity = newPresence.activities.find(
                a => a.type === "STREAMING"
            );
            if (streamingActivity == undefined) {
                return;
            }
            if (
                !oldPresence.activities.find(a => a.type === "STREAMING") &&
                streamingActivity
            ) {
                streamerNickname = streamingActivity.url
                    .split("/")
                    .splice(3, 2);

                apiClient.helix.users
                    .getUserByName(streamerNickname[0])
                    .then(channel => {
                        streamerViews = channel.views;
                        apiClient.helix.users
                            .getUserByName(streamerNickname[0])
                            .then(user => {
                                streamerId = user.id;
                                apiClient.helix.users
                                    .getFollows({
                                        followedUser: `${streamerId}`,
                                    })
                                    .then(f => {
                                        streamerFollowers = f.total;

                                        let embed = new Discord.MessageEmbed()
                                            .setTitle("Обнаружен стример!")
                                            .setThumbnail(
                                                newPresence.member.user.displayAvatarURL(
                                                    {
                                                        dynamic: true,
                                                        size: 512,
                                                    }
                                                )
                                            )
                                            .addField(
                                                "Стример",
                                                newPresence.user.username,
                                                true
                                            )
                                            .addField(
                                                "Категория",
                                                streamingActivity.state,
                                                true
                                            )
                                            .addField("\u200B", "\u200B", true)
                                            .addField(
                                                "Просмотров",
                                                streamerViews,
                                                true
                                            )
                                            .addField(
                                                "Фолловеров",
                                                streamerFollowers,
                                                true
                                            )
                                            .addField("\u200B", "\u200B", true)
                                            .addField(
                                                "Название",
                                                streamingActivity.details
                                            )
                                            .addField(
                                                "Twitch",
                                                `[Ссылочка на трансляцию](${streamingActivity.url})`
                                            )
                                            .setColor("#6441a5")
                                            .setFooter(
                                                `© ${
                                                    newPresence.guild.name
                                                } ${new Date(
                                                    newPresence.guild.createdTimestamp
                                                ).getFullYear()}-${new Date().getFullYear()}`
                                            )
                                            .setTimestamp();
                                        bot.channels.cache
                                            .find(
                                                ch =>
                                                    ch.id ===
                                                    config.StreamersChannel
                                            )
                                            .send(embed);
                                    });
                            });
                    });
            }
        }
    }
}

module.exports = StreamAnnounce;
