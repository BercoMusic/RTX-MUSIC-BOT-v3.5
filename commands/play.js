const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  name: "play",
  description: "Play a song!",
  options: [{
    name: 'query',
    type: ApplicationCommandOptionType.String,
    description: 'The song you want to play',
    required: true,
  }],
  async execute(interaction, client) {
    if (!interaction.member.voice.channel) 
      return interaction.reply({ content: "You need to be in a voice channel to play music!", ephemeral: true });

    const query = interaction.options.getString("query", true);
    
    await interaction.deferReply();

    try {
      const { track } = await client.player.play(interaction.member.voice.channel, query, {
        nodeOptions: {
          metadata: interaction
        }
      });

      return interaction.followUp(`**${track.title}** enqueued!`);
    } catch (error) {
      console.error(error);
      return interaction.followUp({ content: `There was an error while executing this command: ${error.message}`, ephemeral: true });
    }
  },
};
