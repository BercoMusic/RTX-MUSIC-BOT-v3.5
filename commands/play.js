const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "play",
  description: "Şarkı çalar",
  permissions: "0x0000000000000800",
  options: [{
    name: 'name',
    description: 'Çalmak istediğiniz şarkının adını yazın.',
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  voiceChannel: true,
  run: async (client, interaction) => {
    try {
      const name = interaction.options.getString('name');
      if (!name) return interaction.reply({ content: "Lütfen geçerli bir şarkı adı girin.", ephemeral: true });

      const { channel } = interaction.member.voice;
      if (!channel) return interaction.reply({ content: "Bir ses kanalında olmalısınız!", ephemeral: true });

      const res = await client.player.search(name, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO
      });

      if (!res || !res.tracks.length) return interaction.reply({ content: "Sonuç bulunamadı!", ephemeral: true });

      const queue = await client.player.createQueue(interaction.guild, {
        metadata: interaction.channel
      });

      try {
        if (!queue.connection) await queue.connect(channel);
      } catch {
        await client.player.deleteQueue(interaction.guildId);
        return interaction.reply({ content: "Ses kanalına katılamıyorum!", ephemeral: true });
      }

      await interaction.reply({ content: `${res.tracks[0].title} yükleniyor... 🎧` });

      res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

      if (!queue.playing) await queue.play();
    } catch (e) {
      console.error(e);
      interaction.reply({ content: "Bir hata oluştu: " + e, ephemeral: true });
    }
  },
};
