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

// Config dosyasını yükle
const config = require("./config.js");

// Dosya işlemleri için fs modülünü yükle
const fs = require("fs");

// Discord istemcisini oluştur ve yapılandır
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

// Config dosyasını istemciye ekle
client.config = config;

// Komutları saklamak için bir Collection oluştur
client.commands = new Collection();

// Discord Player'ı istemciye ekle
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

// Player'ı ayrı bir değişkene ekle
const player = client.player;

// "./events" klasöründeki olayları yükle
fs.readdir("./events", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

// "./events/player" klasöründeki player olaylarını yükle
fs.readdir("./events/player", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const player_events = require(`./events/player/${file}`);
        let playerName = file.split(".")[0];
        player.on(playerName, player_events.bind(null, client));
        delete require.cache[require.resolve(`./events/player/${file}`)];
    });
});

// Komutları "./commands" klasöründen yükle
fs.readdir(config.commandsDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
        try {
            if (f.endsWith(".js")) {
                let props = require(`${config.commandsDir}/${f}`);
                client.commands.set(props.name, props);
            }
        } catch (err) {
            console.log(err);
        }
    });
});

// Bot TOKEN'ını çevre değişkenlerinden alarak giriş yap
if (process.env.TOKEN) {
    client.login(process.env.TOKEN).catch(e => {
        console.log("Bot TOKEN'i geçersiz!");
    });
} else {
    console.log("TOKEN environment variable'ı bulunamadı!");
}

// İşlenmemiş promise hatalarını yakala ve konsola yazdır
process.on('unhandledRejection', error => {
    console.log(error);
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
