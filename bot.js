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


// Discord.js ve ilgili modülleri yükle
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Player } = require("discord-player");
const config = require("./config.js");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

client.config = config;
client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

const player = client.player;

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: 'Komutu işlerken bir hata oluştu.', ephemeral: true }).catch(console.error);
        } else {
            await interaction.reply({ content: 'Komutu işlerken bir hata oluştu.', ephemeral: true }).catch(console.error);
        }
    }
});

// Olayları yükle
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
}

// Player olaylarını yükle
const playerEventFiles = fs.readdirSync("./events/player").filter(file => file.endsWith(".js"));
for (const file of playerEventFiles) {
    const playerEvent = require(`./events/player/${file}`);
    const playerEventName = file.split(".")[0];
    player.on(playerEventName, playerEvent.bind(null, client));
}

// Komutları yükle
const commandFiles = fs.readdirSync(config.commandsDir).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    try {
        const command = require(`${config.commandsDir}/${file}`);
        if (command.name && typeof command.execute === 'function') {
            client.commands.set(command.name, command);
        } else {
            console.error(`Command ${file} is missing required properties.`);
        }
    } catch (error) {
        console.error(`Error loading command ${file}:`, error);
    }
}

// Bot'u başlat
if (process.env.TOKEN) {
    client.login(process.env.TOKEN).catch(error => {
        console.error("Bot TOKEN'i geçersiz veya bir hata oluştu:", error);
    });
} else {
    console.error("TOKEN environment variable'ı bulunamadı!");
}

// İşlenmemiş hataları yakala
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
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
