const { REST, Routes, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const registerCommands = (serverId) => {
    const commands = [
        {
            name: "help",
            description: "See what the purpose of this bot is",
        },
        {
            name: "ping",
            description: "pong"
        }
    ]


const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
      console.log(`Registering slash commands in server id ${serverId}...`);

      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, serverId), { body: commands });

      console.log(`Slash commands were registered successfully in server id ${serverId}`);
    } catch (error) {
      console.log(`There was an error in server id ${serverId}: ${error}`);
    }
  })();

}

const handleCommand = async (interaction) => {
    switch (interaction.commandName) {
        case "help":
            interaction.reply({ content: "help command", ephemeral: true, });
        break;
        case "ping":
            interaction.reply({ content: "ping", ephemeral: true, });
        break;

    }
}

module.exports = { registerCommands, handleCommand };