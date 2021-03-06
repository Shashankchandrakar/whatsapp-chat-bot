const Stream = require("stream");
module.exports = {handleMessage}
const fs = require('fs');
const https = require('https');


async function convertImageToMessage(message) {

    if (message.hasMedia) {
        let media = message.downloadMedia();
        if (media) {
            message.reply(media, message.from, {sendMediaAsSticker: true}).then(r => console.log("Media sent ", r));
        }
    }
}


function getMemeUrl(https) {
    return new Promise((resolve,reject) => {
        https.get('https://meme-api.herokuapp.com/gimme', (resp) => {
            let data = '';
            let memeUrl;

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let jsonData = JSON.parse(data);
                memeUrl = jsonData['url']
                resolve(memeUrl);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err.message);
        });
    });
}

async function getMemeFileName(https, memeUrl, message) {
    let pathToImage = "/Users/gmp/WebstormProjects/whatsapp/image.png"
    let file = fs.createWriteStream(pathToImage);
    let request = new Promise((resolve,reject) => {https.get(memeUrl, function (response) {
        response.pipe(file);
    })});
    const {MessageMedia} = require('whatsapp-web.js');

    const media = MessageMedia.fromFilePath(pathToImage);
    if (media) {
        message.reply(media, message.from).then(r => console.log("Media sent ", r));
    }
    return pathToImage;

}

async function getMeme(message) {

    let memeUrl = await getMemeUrl(https);
    console.log("Meme url :: ",memeUrl);
    await getMemeFileName(https, memeUrl,message);

}

async function handleMessage(message) {
    let body = message.body;
    switch (body) {
        case "/sticker":
            await convertImageToMessage(message);
            break;
        case "/meme":
            await getMeme(message).then(r => console.log("meme sent ", r));
            break;
    }
}