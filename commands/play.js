const { ApplicationCommandOptionType } = require('discord.js');

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
  run: async (client, interaction) => {
    const songName = interaction.options.getString('şarkı');
    if (!songName) {
      return interaction.reply({ content: `❌ Lütfen geçerli bir şarkı adı girin.`, ephemeral: true });
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: `❌ Lütfen bir ses kanalına katılın.`, ephemeral: true });
    }

    const queue = client.player.getQueue(interaction.guild.id);
    let song = null;

    try {
      song = await client.player.search(songName, {
        requestedBy: interaction.user
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: `❌ Şarkı aranırken bir hata oluştu.`, ephemeral: true });
    }

    if (!song || song.tracks.length === 0) {
      return interaction.reply({ content: `❌ Şarkı bulunamadı.`, ephemeral: true });
    }

    if (!queue) {
      try {
        await client.player.createQueue(interaction.guild, {
          metadata: interaction.channel
        });
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: `❌ Kuyruk oluşturulurken bir hata oluştu.`, ephemeral: true });
      }
    }

    try {
      await client.player.play(voiceChannel, song.tracks[0], {
        textChannel: interaction.channel,
        member: interaction.member
      });
      await interaction.reply({ content: `🎶 Çalıyor: **${song.tracks[0].title}** - ${song.tracks[0].url}` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: `❌ Şarkı çalınırken bir hata oluştu.`, ephemeral: true });
    }
  }
};
