const {
  REST,
  Routes,
  ApplicationCommandOptionType,
  Application,
} = require("discord.js");
const getTimestampCommandName = "get-timestamp";

const registerCommands = (serverId) => {
  const commands = [
    {
      name: "help",
      description: "See what the purpose of this bot is",
    },
    {
      name: getTimestampCommandName,
      description: "Get the timestamp(s) of a specific date and time",
      options: [
        {
          name: "timezone",
          description: "The timezone the user is in",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "date",
          description:
            "The date of the timestamp. Needs to be in the following format (MM/DD/YYYY)",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "time",
          description:
            "The time of the timestamp. Needs to be in 24H or 12 format. Ex 00:00 or 12:00AM",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  (async () => {
    try {
      console.log(`Registering slash commands in server id ${serverId}...`);

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, serverId),
        { body: commands }
      );

      console.log(
        `Slash commands were registered successfully in server id ${serverId}`
      );
    } catch (error) {
      console.log(`There was an error in server id ${serverId}: ${error}`);
    }
  })();
};

const handleCommand = async (interaction) => {
  switch (interaction.commandName) {
    case "help":
      interaction.reply({
        content: `This bot simplifies scheduling across time zones by converting a provided date and time into various discord timestamps using the **/${getTimestampCommandName}** command. Repository can be found [here](<https://github.com/BlckHawker/Timestamp-Discord-Bot/tree/master>)`,
        ephemeral: true,
      });
      break;
    case "get-timestamp":
      const timezones = [
        { abbreviation: "-12", offset: "-12:00" },
        { abbreviation: "-11/SST", offset: "-11:00" },
        { abbreviation: "-10/HST", offset: "-10:00" },
        { abbreviation: "-0930", offset: "-09:30" },
        { abbreviation: "-09/AKST/HDT", offset: "-09:00" },
        { abbreviation: "-08/AKDT/PST", offset: "-08:00" },
        { abbreviation: "-07/MST/PDT", offset: "-07:00" },
        { abbreviation: "-06/CST/MDT", offset: "-06:00" },
        { abbreviation: "-05/CDT/EST", offset: "-05:00" },
        { abbreviation: "-04/AST/EDT", offset: "-04:00" },
        { abbreviation: "NST", offset: "-03:30" },
        { abbreviation: "-03/ADT", offset: "-03:00" },
        { abbreviation: "NDT", offset: "-02:30" },
        { abbreviation: "-02", offset: "-02:00" },
        { abbreviation: "-01", offset: "-01:00" },
        { abbreviation: "-00/+00/GMT/UTC/WET", offset: "+00:00" },
        { abbreviation: "+01/BST/CET/IST/WAT/WEST", offset: "+01:00" },
        { abbreviation: "+02/CAT/CEST/EET/SAST", offset: "+02:00" },
        { abbreviation: "+03/EAT/EEST/IDT/MSK", offset: "+03:00" },
        { abbreviation: "+0330", offset: "+03:30" },
        { abbreviation: "+04", offset: "+04:00" },
        { abbreviation: "+0430", offset: "+04:30" },
        { abbreviation: "+05/PKT", offset: "+05:00" },
        { abbreviation: "+0530", offset: "+05:30" },
        { abbreviation: "+0545", offset: "+05:45" },
        { abbreviation: "+06", offset: "+06:00" },
        { abbreviation: "+0630", offset: "+06:30" },
        { abbreviation: "+07/WIB", offset: "+07:00" },
        { abbreviation: "+08/AWST/HKT/WITA", offset: "+08:00" },
        { abbreviation: "+0845", offset: "+08:45" },
        { abbreviation: "+09/JST/KST/WIT", offset: "+09:00" },
        { abbreviation: "ACST", offset: "+09:30" },
        { abbreviation: "+10/AEST/ChST", offset: "+10:00" },
        { abbreviation: "+1030", offset: "+10:30" },
        { abbreviation: "ACDT", offset: "+10:30" },
        { abbreviation: "+11", offset: "+11:00" },
        { abbreviation: "AEDT", offset: "+11:00" },
        { abbreviation: "+12/NZST", offset: "+12:00" },
        { abbreviation: "+1245", offset: "+12:45" },
        { abbreviation: "+13/NZDT", offset: "+13:00" },
        { abbreviation: "+1345", offset: "+13:45" },
        { abbreviation: "+14", offset: "+14:00" },
      ];

      const desiredTimezone = interaction.options
        .get("timezone")
        .value.toUpperCase();

      const timezoneObj = timezones.find((obj) =>
        obj.abbreviation.split("/").includes(desiredTimezone)
      );

      if (!timezoneObj) {
        let timezoneStr =
          "```|Timezone Abbreviation(s)| UTC offset |\n|  -----------------     | ---------- |";
        for (obj of timezones) {
          timezoneStr += `\n|${
            obj.abbreviation + " ".repeat(24 - obj.abbreviation.length)
          }|${obj.offset + " ".repeat(12 - obj.offset.length)}|`;
        }
        timezoneStr += "```";
        interaction.reply({
          content: `Time zone "${desiredTimezone}" does not exist. Here is a valid list of time zones and their UTC offset. A better list can be found on the [repository](<https://github.com/BlckHawker/Timestamp-Discord-Bot>)\n${timezoneStr}`,
          ephemeral: true,
        });
        return;
      }

      //use regex to make sure the date and time is valid
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const thirtyMonths = ["April", "June", "September", "November"];
      const dateValue = interaction.options.get("date")?.value;
      const emptyDate = dateValue === undefined;
      let date = dateValue?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

      const offset = timezoneObj.offset;
      const offsetRegexObj = offset.match(/([-\+])(\d{2}):(\d{2})/);
      const adding = offsetRegexObj[1] == "+";
      const hourOffset = parseInt(offsetRegexObj[2]);
      const minuteOffset = parseInt(offsetRegexObj[3]) + 60 * hourOffset;

      if (emptyDate) {
        // Use the local date's month, date, and year
        const localDate = new Date();
        changeDateOffset(localDate, minuteOffset, adding);

        date = [
          "",
          localDate.getUTCMonth() + 1,
          localDate.getUTCDate(),
          localDate.getUTCFullYear(),
        ];
      } else {
        if (date === null) {
          interaction.reply({
            content: `Cannot convert "${dateValue}" to a date. Needs to be in a format (MM/DD/YYYY)`,
            ephemeral: true,
          });
          return;
        }

        //check that the month to see if they're valid
        if (date[1] < 1 || date[1] > 12) {
          interaction.reply({
            content: `"${date[1]}" is an invalid month. Only use numbers between 1 and 12 inclusively`,
            ephemeral: true,
          });
          return;
        }

        const monthString = months[date[1] - 1];

        // check the date is valid
        if (date[2] < 1 || date[2] > 31) {
          interaction.reply({
            content: `"${date[2]}" is an invalid day. Only use numbers between 1 and 31 inclusively`,
            ephemeral: true,
          });
          return;
        }
        const isLeapYear = date[3] % 4 === 0 && date[3] % 100 !== 0;
        //if February and not a leap, thrown an error if the day is greater than 28
        if (date[1] == 2 && !isLeapYear && date[2] > 28) {
          interaction.reply({
            content: `"${date[2]}" is an invalid day as February only has 28 days for the year ${date[3]}.`,
            ephemeral: true,
          });
          return;
        }

        //if February and a leap, thrown an error if the day is greater than 29
        if (date[1] == 2 && isLeapYear && date[2] > 29) {
          interaction.reply({
            content: `"${date[2]}" is an invalid day as February only has 29 days for the year ${date[3]}.`,
            ephemeral: true,
          });
          return;
        }

        //If the month only has 30 days, make sure the day isn't 31
        if (thirtyMonths.includes(monthString) && date[2] > 30) {
          interaction.reply({
            content: `"${date[2]}" is an invalid day as ${monthString} only has 30 days.`,
            ephemeral: true,
          });
          return;
        }
      }

      const time = interaction.options.get("time")?.value?.toUpperCase();
      const emptyTime = time === undefined;
      const _24HourMatches = time?.match(/^(\d{2})\:(\d{2})$/);
      const _12HourMatches = time?.match(/^(\d{2})\:(\d{2})((P|A)?M)$/);

      let hours;
      let minutes;
      if (emptyTime) {
        const localDate = new Date();
        changeDateOffset(localDate, minuteOffset, adding);

        hours = localDate.getUTCHours();
        minutes = localDate.getUTCMinutes();
      } else {
        //check that the user gave a valid time
        if (_24HourMatches === null && _12HourMatches === null) {
          interaction.reply({
            content: `"${time}" is an invalid time. Use the 24H (00:00) or 12H (12:00AM) formats`,
            ephemeral: true,
          });
          return;
        }

        if (_24HourMatches !== null) {
          //check the hour is valid
          if (_24HourMatches[1] < 0 || _24HourMatches[1] > 23) {
            interaction.reply({
              content: `"${_24HourMatches[1]}" is an invalid hour. Only use numbers between 0 and 23 inclusively`,
              ephemeral: true,
            });
            return;
          }

          //check the minutes are valid
          if (_24HourMatches[2] < 0 || _24HourMatches[2] > 59) {
            interaction.reply({
              content: `"${_24HourMatches[2]}" is an invalid minute. Only use numbers between 0 and 59 inclusively`,
              ephemeral: true,
            });
            return;
          }

          hours = _24HourMatches[1];
          minutes = _24HourMatches[2];
        } else {
          //check the hour is valid
          if (_12HourMatches[1] < 1 || _12HourMatches[1] > 12) {
            interaction.reply({
              content: `"${_12HourMatches[1]}" is an invalid hour. Only use numbers between 1 and 12 inclusively`,
              ephemeral: true,
            });
            return;
          }

          //check the minutes are valid
          if (_12HourMatches[2] < 0 || _12HourMatches[2] > 59) {
            interaction.reply({
              content: `"${_12HourMatches[2]}" is an invalid minute. Only use numbers between 0 and 59 inclusively`,
              ephemeral: true,
            });
            return;
          }

          // convert 12H format into 24H format under the hood
          // if 12 hours, hard code
          if (_12HourMatches[1] == 12) {
            if (_12HourMatches[3] == "AM") {
              hours = 0;
            } else {
              hours = 12;
            }
          }

          // otherwise add 12 hours if PM to current hour
          else {
            hours = parseInt(_12HourMatches[1]);
            if (_12HourMatches[3] == "PM") {
              hours += 12;
            }
          }

          minutes = _12HourMatches[2];
        }
      }

      //check what the updated hours should be
      const newDate = new Date(
        Date.UTC(date[3], date[1] - 1, date[2], hours, minutes)
      );

      //idk why adding needs to be the opposite bool value, it won't work otherwise
      changeDateOffset(newDate, minuteOffset, !adding);

      let utcTimestamp = Math.floor(newDate.getTime() / 1000);
      let arr = [
        { name: "Default", t: "" },
        { name: "Short Time", t: ":t" },
        { name: "Long Time", t: ":T" },
        { name: "Short Date", t: ":d" },
        { name: "Long Date", t: ":D" },
        { name: "Short Date/Time", t: ":f" },
        { name: "Long Date/Time", t: ":F" },
        { name: "Relative Time", t: ":R" },
      ];

      let string = arr
        .map(
          (obj) =>
            `${obj.name} <t:${utcTimestamp}${obj.t}> \`<t:${utcTimestamp}${obj.t}>\``
        )
        .join("\n");
      await interaction.reply({ content: string, ephemeral: true });
      break;
  }
};

function changeDateOffset(date, minuteOffset, adding) {
  if (adding) {
    date.setTime(date.getTime() + minuteOffset * 60 * 1000);
  } else {
    date.setTime(date.getTime() - minuteOffset * 60 * 1000);
  }
}

module.exports = { registerCommands, handleCommand };
