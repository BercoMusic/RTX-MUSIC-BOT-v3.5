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
const config = require("../config.js");
const { EmbedBuilder, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const db = require("../mongoDB");
const fs = require("fs");

module.exports = async (client, interaction) => {
    try {
        if (!interaction?.guild) {
            return interaction?.reply({ content: "Bu komut yalnızca sunucularda kullanılabilir.", ephemeral: true });
        }

        async function cmd_loader() {
            if (interaction?.type === InteractionType.ApplicationCommand) {
                const command = client.commands.get(interaction.commandName);

                if (!command) return;

                try {
                    let data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id });
                    if (data?.channels?.length > 0) {
                        let channel_control = data?.channels?.filter(x => !interaction?.guild?.channels?.cache?.get(x?.channel));
                        
                        if (channel_control?.length > 0) {
                            for (const x of channel_control) {
                                await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, { 
                                    $pull: { 
                                        channels: { 
                                            channel: x?.channel
                                        } 
                                    } 
                                }, { upsert: true }).catch(e => console.error(e));
                            }
                        } else {
                            data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id });
                            let channel_filter = data?.channels?.filter(x => x.channel === interaction?.channel?.id);

                            if (!channel_filter?.length > 0 && !interaction?.member?.permissions?.has("ManageGuild")) {
                                channel_filter = data?.channels?.map(x => `<#${x.channel}>`).join(", ");
                                return interaction?.reply({ content: `Bu komutu yalnızca şu kanallarda kullanabilirsiniz: ${channel_filter}`, ephemeral: true });
                            }
                        }
                    }

                    if (interaction?.member?.permissions?.has(command.permissions || "SendMessages")) {
                        const DJ = client.config.opt.DJ;
                        if (DJ.commands.includes(interaction?.commandName)) {
                            let djRole = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id });
                            if (djRole && djRole.role) {
                                const roleDJ = interaction?.guild?.roles?.cache?.get(djRole.role);
                                if (!interaction?.member?.permissions?.has("ManageGuild")) {
                                    if (roleDJ && !interaction?.member?.roles?.cache?.has(roleDJ.id)) {
                                        const embed = new EmbedBuilder()
                                            .setColor(client.config.embedColor)
                                            .setTitle(client?.user?.username)
                                            .setDescription("Bu komutu kullanmak için DJ rolüne sahip olmalısınız.")
                                            .setTimestamp();
                                        
                                        return interaction?.reply({ embeds: [embed], ephemeral: true });
                                    }
                                }
                            }
                        }

                        if (command.voiceChannel) {
                            if (!interaction?.member?.voice?.channelId) {
                                return interaction?.reply({ content: `Lütfen önce bir ses kanalına katılın!`, ephemeral: true });
                            }
                            const guild_me = interaction?.guild?.members?.cache?.get(client?.user?.id);
                            if (guild_me?.voice?.channelId && guild_me?.voice?.channelId !== interaction?.member?.voice?.channelId) {
                                return interaction?.reply({ content: `Benimle aynı ses kanalında olmalısınız!`, ephemeral: true });
                            }
                        }

                        return command.execute(interaction, client);
                    } else {
                        return interaction?.reply({ content: `Bu komutu kullanmak için gerekli izinlere sahip değilsiniz: **${command?.permissions || "Mesaj Gönderme"}**`, ephemeral: true });
                    }
                } catch (e) {
                    console.error(e);
                    return interaction?.reply({ content: `Bir hata oluştu:\n\n\`\`\`${e.message}\`\`\``, ephemeral: true });
                }
            }
        }

        if (config.voteManager.status && config.voteManager.api_key) {
            if (config.voteManager.vote_commands.includes(interaction?.commandName)) {
                try {
                    const topSdk = require("@top-gg/sdk");
                    let topApi = new topSdk.Api(config.voteManager.api_key, client);
                    await topApi?.hasVoted(interaction?.user?.id).then(async voted => {
                        if (!voted) {
                            const embed2 = new EmbedBuilder()
                                .setTitle(`${client?.user?.username} için oy verin`)
                                .setColor(client?.config?.embedColor)
                                .setDescription("Bu komutu kullanmak için bota oy vermelisiniz.");
                            return interaction?.reply({ embeds: [embed2], ephemeral: true });
                        } else {
                            await cmd_loader();
                        }
                    });
                } catch(e) {
                    console.error(e);
                    await cmd_loader();
                }
            } else {
                await cmd_loader();
            }
        } else {
            await cmd_loader();
        }
    } catch (e) {
        console.error(e);
    }
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
