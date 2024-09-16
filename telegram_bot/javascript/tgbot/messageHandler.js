const { WinccoaElementType } = require('winccoa-manager');
const messageHadlers = new Map([
    ["/set", setValue],
    ["/ack", ackAlert],
]);

function setValue(winccoa, msg, myBot, chatId) {
    if (msg.length < 3) {
        myBot.sendMessage(chatId, "Please specify a value.");
        return;
    }
    if (!winccoa.dpExists(msg[1] + ":_original")) { 
        myBot.sendMessage(chatId, `Dpe ${msg[1]} does not exist.`);
        return;
    }
    console.log(msg[1], msg[2]);
    let dpType = winccoa.dpElementType(msg[1]);
    if (dpType === WinccoaElementType.Bool) {
        let b = !(msg[2].toLowerCase() === "false") && !(msg[2].toLowerCase() === "0");
        winccoa.dpSet(msg[1], b);
    }
    else {
        winccoa.dpSet(msg[1], msg[2]);
    }
}

function ackAlert(winccoa, msg, myBot) {
    winccoa.dpSet(msg[1] + ":_alert_hdl.._ack", 2);
}

function processMessage(msg, allowedChats, presentedChats, winccoa, myBot) {
    let chatId = msg.chat.id.toString()
    if (allowedChats.includes(chatId)) {
        let textArray = msg.text.split(' ');
        const funcName = textArray[0].toLowerCase();
        if (messageHadlers.has(funcName)) {
            messageHandlers.get(funcName)(winccoa, textArray, myBot, chatId);
            return;
        }

        myBot.sendMessage(chatId, "Sorry, I don't understand you.");
        console.error("Something went wrong: " + funcName + " is not a valid command.");
    }

    if (!presentedChats.includes(chatId)) {
        presentedChats.push(chatId);
        winccoa.dpSet(`${dpName}.chatIds`, presentedChats);
    }
}

module.exports.processMessage = processMessage