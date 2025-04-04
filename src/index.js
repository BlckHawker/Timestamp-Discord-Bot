require("dotenv").config();
const Discord = require('discord.js');
const utils = require("./utils.js");
const commands = require("./commands.js");
const { GatewayIntentBits, IntentsBitField, Partials } = Discord;

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent,
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.GuildMessages, 
        IntentsBitField.Flags.GuildPresences, 
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.MessageContent
    ],

    partials: [
        Partials.Channel,
        Partials.Message
    ]
})


client.on('guildCreate', (guild) => {
    //When the bot joins a server, create a new object
    let data = utils.readDataFile();
    data.push(utils.createNewObject(guild.id));
    utils.saveToDataFile(data);
    //register commands
    commands.registerCommands(guild.id);
});

client.on('guildDelete', (guild) => {
    //when the bot leaves the server, remove from data json
    let data = utils.readDataFile();
    data = data.filter((obj) => obj.serverId !== guild.id);
    utils.saveToDataFile(data);
});

// Emitted when an interaction is created.
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
        await commands.handleCommand(interaction);
});

// When the bot first initializes
client.on("ready", (c) => {
    console.log(`${c.user.tag} is online`);
});

client.login(process.env.DISCORD_TOKEN);