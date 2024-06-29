const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");

const queueNames = [];

async function play(client, interaction) {
    try {
        const name = interaction.options.getString('şarkı');
        if (!name) return interaction.reply({ content: `❌ Lütfen geçerli bir şarkı adı girin.`, ephemeral: true }).catch(e => { });

        const player = client.riffy.createConnection({
            guildId: interaction.guildId,
            voiceChannel: interaction.member.voice.channelId,
            textChannel: interaction.channelId,
            deaf: true
        });

        await interaction.deferReply();

        const resolve = await client.riffy.resolve({ query: name, requester: interaction.user });
        if (!resolve || typeof resolve !== 'object') {
            throw new TypeError('Resolve response is not an object');
        }

        const { loadType, tracks, playlistInfo } = resolve;

        if (!Array.isArray(tracks)) {
            throw new TypeError('Expected tracks to be an array');
        }

        if (loadType === 'PLAYLIST_LOADED') {
            for (const track of tracks) {
                track.info.requester = interaction.user;
                player.queue.add(track);
                queueNames.push(track.info.title);
            }

            if (!player.playing && !player.paused) player.play();

        } else if (loadType === 'SEARCH_RESULT' || loadType === 'TRACK_LOADED') {
            const track = tracks.shift();
            track.info.requester = interaction.user;

            player.queue.add(track);
            queueNames.push(track.info.title);

            if (!player.playing && !player.paused) player.play();
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('There are no results found.');

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const embeds = [
            new EmbedBuilder()
                .setColor('#4d9fd6')
                .setAuthor({
                    name: 'Request Update!',
                    iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236794583732457473/7828-verify-ak.gif',
                    url: 'https://discord.gg/xQF9f9yUEM'
                })
                .setDescription('➡️ **Your request has been successfully processed.**\n➡️** Please use the buttons to control the queue**')
        ];

        await interaction.followUp({ embeds: [embeds[0]] });

    } catch (error) {
        console.error('Error processing play command:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Error')
            .setDescription('An error occurred while processing your request.');

        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    name: "play",
    description: "Müzik çalar!",
    permissions: "0x0000000000000800",
    options: [{
        name: 'şarkı',
        description: 'Çalmak istediğiniz şarkının adını yazın.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: play,
    queueNames: queueNames
};
