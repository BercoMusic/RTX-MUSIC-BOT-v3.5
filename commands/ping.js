/*

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          

   
   # MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE
   ## FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/FUEHs7RCqz ]
   ## YT : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
*/
const { EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");

module.exports = {
  name: "ping",
  description: "Bot gecikmesini kontrol et",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const start = Date.now();
      
      const embed = new EmbedBuilder()
        .setColor('#6190ff')
        .setTitle('Bot Gecikmesi')
        .setDescription('Hesaplanıyor...');
      
      const message = await interaction.editReply({ embeds: [embed] });
      
      const end = Date.now();
      
      const latency = end - start;
      const apiLatency = Math.round(client.ws.ping);
      
      embed.setDescription(`**Bot Gecikmesi:** ${latency}ms\n**API Gecikmesi:** ${apiLatency}ms`);
      
      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      await interaction.followUp({ content: 'Bir hata oluştu.', ephemeral: true });
    }
  },
};
/*

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          

   
   # MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE
   ## FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/FUEHs7RCqz ]
   ## YT : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
*/
