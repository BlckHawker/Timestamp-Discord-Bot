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
        },
        {
            name: "get-timestamp",
            description: "Get the timestamp(s) of a specific date and time",
            options: [
                {
                    name: "date",
                    description: "The date of the timestamp. Needs to be in the following format (MM/DD/YYYY)",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "time",
                    description: "The time of the timestamp. Needs to be in 24H or 12 format. Ex 00:00 or 12:00AM",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
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
        case "get-timestamp":
            //use regex to make sure the date and time is valid

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const thirtyMonths = ["April", "June", "September", "November"]
            const dateValue = interaction.options.get("date").value;
            const date = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);

            const isLeapYear = date[3] % 4 === 0 && date[3] % 100 !== 0;

            if(date === null)
            {
                interaction.reply({ content: `Cannot convert "${dateValue}" to a date. Needs to be in a format (MM/DD/YYYY)`, ephemeral: true, });
                return;
            }

            //check that the month to see if they're valid
            if(date[1] < 1 || date[1] > 12)
            {
                interaction.reply({ content: `"${date[1]}" is an invalid month. Only use numbers between 1 and 12 inclusively`, ephemeral: true, });
                return;
            }

            const monthString = months[date[1] - 1];

            // check the date is valid
            if(date[2] < 1 || date[2] > 31)
            {
                interaction.reply({ content: `"${date[2]}" is an invalid day. Only use numbers between 1 and 31 inclusively`, ephemeral: true, });
                return;
            }

            //if February and not a leap, thrown an error if the day is greater than 28
            if(date[1] == 2 && !isLeapYear && date[2] > 28)
            {
                interaction.reply({ content: `"${date[2]}" is an invalid day as February only has 28 days for the year ${date[3]}.`, ephemeral: true });
                return;
            }

            //if February and a leap, thrown an error if the day is greater than 29
            if(date[1] == 2 && isLeapYear && date[2] > 29)
            {
                interaction.reply({ content: `"${date[2]}" is an invalid day as February only has 29 days for the year ${date[3]}.`, ephemeral: true });
                return;
            }


            if(thirtyMonths.includes(monthString) && date[2] > 30)
            {
                interaction.reply({ content: `"${date[2]}" is an invalid day as ${monthString} only has 30 days.`, ephemeral: true });
                return;
            }

            const time = interaction.options.get("time").value.match();
            interaction.reply({ content: "get timestamp", ephemeral: true, });
        break;

    }
}

module.exports = { registerCommands, handleCommand };