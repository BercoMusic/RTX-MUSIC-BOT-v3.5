const { SlashCommandBuilder } = require('@discordjs/builders');
const { ButtonBuilder, ButtonStyle, MessageActionRow } = require('discord.js');
const DisTube = require('distube'); // veya müzik kütüphanenizin adı

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Search and play a song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the song name')
                .setRequired(true)),

    async execute(interaction) {
        const songName = interaction.options.getString('song');

        try {
            const searchResult = await interaction.client.player.search(songName);
            if (!searchResult || searchResult.length === 0) {
                return await interaction.reply({ content: '❌ No results found!', ephemeral: true });
            }

            const maxTracks = searchResult.slice(0, 10);

            const row = new MessageActionRow();
            maxTracks.forEach((track, index) => {
                row.addComponents(
                    new ButtonBuilder()
                        .setLabel(track.name)
                        .setStyle(ButtonStyle.SECONDARY)
                        .setCustomId(`track_${index}`)
                );
            });

            await interaction.reply({ content: '✨ Choose a song:', components: [row] });

            const filter = i => i.customId.startsWith('track_') && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                const trackIndex = parseInt(i.customId.split('_')[1]);
                const chosenTrack = maxTracks[trackIndex];
                
                // Burada seçilen şarkıyı oynatma işlemlerini yapabilirsiniz
                await interaction.editReply(`🎵 Now playing: ${chosenTrack.name}`);
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply('❌ Song selection timed out.');
                }
            });

        } catch (error) {
            console.error('Error during search:', error);
            await interaction.reply({ content: '❌ An error occurred during search.', ephemeral: true });
        }
    },
};
