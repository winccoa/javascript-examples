const TelegramBot = require('node-telegram-bot-api');
const { processMessage } = require('./messageHandler');
const dpName = "myChannel"

function TChannel(apiKey) {
    this.bot = new TelegramBot(apiKey, { polling: true });

    this.sendMessage = function (chatId, text) {
        this.bot.sendMessage(chatId, text);
    }

    this.on = function (event, callback) {
        this.bot.on(event, callback);
    }
}

let myChannel = null;

const runTelegramChannel = async (winccoa) => {
    const [apiKey] = await winccoa.dpGet([`${dpName}.apiKey`]);
    let presentedChats = (await winccoa.dpGet([`${dpName}.chatIds`]))[0];
    let allowedChats = (await winccoa.dpGet([`${dpName}.allowedChats`]))[0];

    myChannel = new TChannel(apiKey);

    try {
        winccoa.dpConnect((n, v, t, e) => allowedChats = v[0], [`${dpName}.allowedChats`], true);
        winccoa.dpConnect(connectCB, [`${dpName}.message`], false);
    }
    catch (exc) {
        console.error(exc);
    }

    subscribeUsers((await winccoa.dpGet([`${dpName}.connectedDp`]))[0], winccoa, false)
    subscribeUsers((await winccoa.dpGet([`${dpName}.query`]))[0], winccoa, true)

    myChannel.on('message', (msg) => processMessage(msg, allowedChats, presentedChats, winccoa, myChannel));
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
            winccoa.dpConnect((names, values, type, error) => myChannel.sendMessage(key, `${names[0]} : ${values[0]}`), val, false);
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
        myChannel.sendMessage(data, `Alerts: ${values[i][0]} : ${values[i][2]}`);
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
        myChannel.sendMessage(msg[0], msg[1]);
    }
    catch (exc) {
        console.error(exc);
    }
}

module.exports.runTelegramChannel = runTelegramChannel;