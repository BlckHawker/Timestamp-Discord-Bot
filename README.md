## Description
It's very common for people to schedule events with others in different times zones, which can lead to issues when trying to convert times. Discord does have a [ timestamp feature](https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa) that automatically parses a [unix timestamp](https://www.unixtimestamp.com) to each local user's time zone, but it can be a bit cumbersome for users to manually convert the time into a timestamp and navigate through multiple timestamp formats that are not intuitive to the naked eye.

This bot simplifies the process. Users can simply input a date (MM/DD/YYYY) and time (12:00AM or 00:00), and the bot will automatically convert it into a timestamp. It will then provide all possible formats for the timestamp, making it easy for users to copy and paste the one they need

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

### 3. Run bot
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
        <td></td>
    </tr>
</table>
