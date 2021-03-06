const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './session.json'
const fs = require('fs');
const messageHandler = require("./messageHandler")

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}
// Use the saved values
const client = new Client({
    session: sessionData
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize().then(r => console.log("Client started",r));


client.on('message', async (message) => {
    console.log("Message  :: ",message);

    // message.reply('pong').then(r => console.log("Message replied successfully ",r));
    // const chat = await message.getChat();
    // let text = "";
    // let mentions = [];
    // for(let participant of chat.participants) {
    //     const contact = await client.getContactById(participant.id._serialized);
    //     mentions.push(contact);
    //     text += `@${participant.id.user} `;
    // }
    // chat.sendMessage(text,{mentions});
    await messageHandler.handleMessage(message);
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});