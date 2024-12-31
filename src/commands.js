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
        case "get-timestamp":
            //use regex to make sure the date and time is valid

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const thirtyMonths = ["April", "June", "September", "November"]
            const dateValue = interaction.options.get("date").value;
            const date = dateValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

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

            //If the month only has 30 days, make sure the day isn't 31 
            if(thirtyMonths.includes(monthString) && date[2] > 30)
            {
                interaction.reply({ content: `"${date[2]}" is an invalid day as ${monthString} only has 30 days.`, ephemeral: true });
                return;
            }

            const time = interaction.options.get("time").value.toUpperCase();
            const _24HourMatches = time.match(/^(\d{2})\:(\d{2})$/);
            const _12HourMatches = time.match(/^(\d{2})\:(\d{2})((P|A)?M)$/);

            //check that the user gave a valid time
            if(_24HourMatches === null && _12HourMatches === null)
            {
                interaction.reply({ content: `"${time}" is an invalid time. Use the 24H (00:00) or 12H (12:00AM) formats`, ephemeral: true });
                return;
            }
            let hours;
            let minutes;
            if(_24HourMatches !== null)
            {
                //check the hour is valid
                if(_24HourMatches[1] < 0 || _24HourMatches[1] > 23)
                {
                    interaction.reply({ content: `"${_24HourMatches[1]}" is an invalid hour. Only use numbers between 0 and 23 inclusively`, ephemeral: true });
                    return;
                }

                //check the minutes are valid
                if(_24HourMatches[2] < 0 || _24HourMatches[2] > 59)
                {
                    interaction.reply({ content: `"${_24HourMatches[2]}" is an invalid minute. Only use numbers between 0 and 59 inclusively`, ephemeral: true });
                    return;
                }

                hours = _24HourMatches[1];
                minutes = _24HourMatches[2];
            }

            else
            {
                //check the hour is valid
                if(_12HourMatches[1] < 1 || _12HourMatches[1] > 12)
                {
                    interaction.reply({ content: `"${_12HourMatches[1]}" is an invalid hour. Only use numbers between 1 and 12 inclusively`, ephemeral: true });
                    return;
                }

                //check the minutes are valid
                if(_12HourMatches[2] < 0 || _12HourMatches[2] > 59)
                {
                    interaction.reply({ content: `"${_12HourMatches[2]}" is an invalid minute. Only use numbers between 0 and 59 inclusively`, ephemeral: true });
                    return;
                }

                // convert 12H format into 24H format under the hood
                // if 12 hours, hard code
                if(_12HourMatches[1] == 12)
                {
                    if(_12HourMatches[3] == "AM")
                    {
                        hours = 0;
                    }

                    else
                    {
                        hours = 12;
                    }
                }

                // otherwise add 12 hours if PM to current hour
                else
                {
                    hours = parseInt(_12HourMatches[1]);
                    if(_12HourMatches[3] == "PM")
                    {
                        hours += 12;
                    }
                }

                minutes = _12HourMatches[2];
            }

           let dateObj = new Date(date[3], date[1] - 1, date[2], hours, minutes)

           let utcTimestamp = Math.floor(new Date(dateObj).getTime() / 1000);
           let arr = [{name: "Default", t:""}, {name: "Short Time", t:":t"} , {name: "Long Time", t:":T"} , {name: "Short Date", t:":d"}, {name: "Long Date", t:":D"}, {name: "Short Date/Time", t:":f"}, {name: "Long Date/Time", t:":F"}, {name: "Relative Time", t:":R"}]

           let string = arr.map(obj => `${obj.name} <t:${utcTimestamp}${obj.t}> \`<t:${utcTimestamp}${obj.t}>\``).join("\n")
           await interaction.reply({ content: string, ephemeral: true, });
        break;

    }
}

module.exports = { registerCommands, handleCommand };