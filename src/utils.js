const fs = require("fs");
const path = require("path");
const dataFileName = "../data.json";
require("dotenv").config();


//todo add method header
const saveToDataFile = (newObject) => {
    fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(newObject, null, 2), (err) => {
      if (err) return console.log(err);
    });
  };
  
  //todo add method header
  const readDataFile = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, dataFileName)));
  };

  const createNewObject = (serverId) => {
    return { serverId };
  };

//Sends a message to a server channel
//client - the client object
//content - the content that will be sent
//id - the id of the channel
const sendServerMessage = (client, content, id = process.env.DEBUG_CHANNEL_ID) => {
    client.channels.cache.get(id).send(content);
}

//Sends a message to a person via dm
//client - the client object
//content - the content that will be sent
//id - the id of the person to send dms to
const sendDM = (client, content, id) => {
    client.users.send(id, content);
}

module.exports = { sendServerMessage, sendDM, saveToDataFile, readDataFile, createNewObject };