const TelegramBot = require('node-telegram-bot-api');
const { processMessage } = require('./messageHandler');
const dpName = "myBot"

function TBot(apiKey) {
    this.bot = new TelegramBot(apiKey, { polling: true });

    this.sendMessage = function (chatId, text) {
        this.bot.sendMessage(chatId, text);
    }

    this.on = function (event, callback) {
        this.bot.on(event, callback);
    }
}

let myBot = null;

const runTelegramBot = async (winccoa) => {
    const [apiKey] = await winccoa.dpGet([`${dpName}.apiKey`]);
    let presentedChats = (await winccoa.dpGet([`${dpName}.chatIds`]))[0];
    let allowedChats = (await winccoa.dpGet([`${dpName}.allowedChats`]))[0];

    myBot = new TBot(apiKey);

    try {
        winccoa.dpConnect((n, v, t, e) => allowedChats = v[0], [`${dpName}.allowedChats`], true);
        winccoa.dpConnect(connectCB, [`${dpName}.message`], false);
    }
    catch (exc) {
        console.error(exc);
    }

    subscribeUsers((await winccoa.dpGet([`${dpName}.connectedDp`]))[0], winccoa, false)
    subscribeUsers((await winccoa.dpGet([`${dpName}.query`]))[0], winccoa, true)

    myBot.on('message', (msg) => processMessage(msg, allowedChats, presentedChats, winccoa, myBot));
}

function subscribeUsers(
    values,
    winccoa,
    alertQuerySubscription,
) {
    let allConnections = values;
    let res = new Map(allConnections.map(str => {
        let data = str.replace(/\;$/, '').split('#')
        return [
            data[0],
            data[1].split(';')
        ]
    }
    ))

    res.forEach((val, key) => {
        if (alertQuerySubscription) {
            winccoa.dpQueryConnectSingle((values, type, error) => sendAllertMessage(key, values, type, error), false, val[0]);
        }
        else {
            winccoa.dpConnect((names, values, type, error) => myBot.sendMessage(key, `${names[0]} : ${values[0]}`), val, false);
        }
    })
}

function sendAllertMessage(
    data,
    values,
    type,
    error
) {
    if (error) {
        console.log(error);
        return;
    }
    if (values.length <= 1) return;

    for (let i = 1; i < values.length; i++) {
        myBot.sendMessage(data, `Alerts: ${values[i][0]} : ${values[i][2]}`);
    }
}

function connectCB(
    names,
    values,
    type,
    error
) {
    try {
        let msg = values[0].split('#');
        myBot.sendMessage(msg[0], msg[1]);
    }
    catch (exc) {
        console.error(exc);
    }
}

module.exports.runTelegramBot = runTelegramBot;