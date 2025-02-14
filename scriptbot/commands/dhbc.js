export default {
    name: "dhbc",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Đuổi hình bắt chữ trên chính messenger của bạn!!!",
    shortDescription: "Đuổi hình bắt chữ trên chính messenger của bạn!!!",
    usages: "",
    cooldowns: 5
};

export async function handleReply({api, event, args, utils, UsersAll, client, Users, handleReply }) {
    switch (handleReply.type) {
    case "reply": {
        let { author,  wordcomplete, messageID} = handleReply;
        function formatText(text) {
            return text.normalize("NFD")
                .toLowerCase()
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
        }(formatText(event.body) == formatText(wordcomplete)) ? api.sendMessage("Chúc mừng bạn đã trả lời đúng", event.threadID, event.messageID): api.sendMessage(`Sai rồi, đáp án đúng là: ${wordcomplete}`, event.threadID, event.messageID),
            api.unsendMessage(handleReply.messageID);
    }
  }
};

import axios from "axios";
import fs from "fs-extra"
import ps, { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function run({api, event, args, utils, UsersAll, client, Users }) {
const { threadID, messageID } = event;
const dataGame = (await axios.get("https://api.dungkon.repl.co/game/dhbc")).data;
let question = (await axios.get(`${dataGame.image1}`, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/dhbc1.png`, Buffer.from(question, "utf-8") );
let answer = (await axios.get(`${dataGame.image2}`, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/cache/dhbc2.png`, Buffer.from(answer, "utf-8") );      
var img_qs = [];
        img_qs.push(fs.createReadStream(__dirname + `/cache/dhbc1.png`));      
        img_qs.push(fs.createReadStream(__dirname + `/cache/dhbc2.png`));
        var msg = {body: `Hãy reply tin nhắn này với câu trả lời!\nGợi ý: ${dataGame.wordcomplete.replace(/\S/g, "█ ")}`, attachment: img_qs}
        return api.sendMessage(msg, event.threadID, (error, info) => {
        client.handleReply.push({
            type: "reply",
            name: this.default.name,
            author: event.senderID,
            messageID: info.messageID,
            tukhoa: dataGame.wordcomplete,
            dapan: dataGame.wordcomplete,
            wordcomplete: dataGame.wordcomplete
        })
    }) 
}