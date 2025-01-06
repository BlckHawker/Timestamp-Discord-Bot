## Description
It's very common for people to schedule events with others in different times zones, which can lead to issues when trying to convert times. Discord does have a [ timestamp feature](https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa) that automatically parses a [unix timestamp](https://www.unixtimestamp.com) to each local user's time zone, but it can be a bit cumbersome for users to manually convert the time into a timestamp and navigate through multiple timestamp formats that are not intuitive to the naked eye.

This bot simplifies the process. Users can simply input a date (MM/DD/YYYY) and time (12:00 AM or 00:00), and the bot will automatically convert it into a timestamp. It will then provide all possible formats for the timestamp, making it easy for users to copy and paste the one they need

##  Demonstration
![timestamp converter demostration](https://github.com/user-attachments/assets/77a50182-4861-41c8-b262-02c9f1a88b20)


## Install
These are steps for developers who want to contribute to the bot. Please send an issue and we'll have a conversasion of your idea and if it fits the purpose of the bot. If/When you have a pr ready, please target the `develop` branch and **not** `master`.

### 1. Install packages
Use `npm i` or `npm install` to add the missing pacakges

### 2. Create .env
-  Duplicate the file `example.env` and rename the copy `.env`
-  Add the missing variables
    -  `DISCORD_TOKEN`: the token of the bot
    -  `CLIENT_ID`: the id of the bot

### 5. Run bot
Use `node src\index.js` to run the bot

## Slash Commands
These are the slash commands that the bot handles
<table>
    <tr>
        <td style="text-align: center">Name</td>
        <td style="text-align: center">Description</td>
        <td style="text-align: center">Notes</td>
    </tr>
    <tr>
        <td><b>/help</b></td>
        <td>Gives a brief description of the bot and describes what each slash command works.</td>
        <td></td>
    </tr>
    <tr>
        <td><b>/get-timestamp</b></td>
        <td>Get the timestamp(s) of a specific date and time</td>
        <td><ul><li>timezone - the timezone the user is in</li><li>date (optional) - The date of the timestamp. Needs to be in the following format (MM/DD/YYYY). If not given, the bot will use the current date</li><li>time (optional) - The time of the timestamp. Needs to be in 24H or 12 format. Ex 00:00 or 12:00AM. If not given, the bot will use the current time.</li></ul></td>
    </tr>
</table>

### Timezones / UTC Offset
Here is a list of all of the applicable timezones that is accepted in the `timezone` parameter in the **/get-timestamp** command along with their correspond UTC offset:
|Timezone Abbreviation(s)| UTC offset |
|    -----------------   | ---------- |
|-00/+00/GMT/UTC/WET     |+00:00      |
|-01                     |−01:00      |
|-02                     |−02:00      |
|-03/ADT                 |−03:00      |
|-04/AST/EDT             |−04:00      |
|-05/CDT/EST             |−05:00      |
|-06/CST/MDT             |−06:00      |
|-07/MST/PDT             |−07:00      |
|-08/AKDT/PST            |−08:00      |
|-09/AKST/HDT            |−09:00      |
|-10/HST                 |−10:00      |
|-11/SST                 |−11:00      |
|-12                     |−12:00      |
|-0930                   |−09:30      |
|+01/BST/CET/IST/WAT/WEST|+01:00      |
|+02/CAT/CEST/EET/SAST   |+02:00      |
|+03/EAT/EEST/IDT/MSK    |+03:00      |
|+04                     |+04:00      |
|+05/PKT                 |+05:00      |
|+06                     |+06:00      |
|+07/WIB                 |+07:00      |
|+08/AWST/HKT/WITA       |+08:00      |
|+09/JST/KST/WIT         |+09:00      |
|+10/AEST/ChST           |+10:00      |
|+12/NZST                |+12:00      |
|+13/NZDT                |+13:00      |
|+14                     |+14:00      |
|+0330                   |+03:30      |
|+0430                   |+04:30      |
|+0530                   |+05:30      |
|+0545                   |+05:45      |
|+0630                   |+06:30      |
|+0845                   |+08:45      |
|+1030                   |+10:30      |
|+11                     |+11:00      |
|+1245                   |+12:45      |
|+1345                   |+13:45      |
|ACST                    |+09:30      |
|ACDT                    |+10:30      |
|NST                     |−03:30      |
|AEDT                    |+11:00      |
|NDT                     |−02:30      |