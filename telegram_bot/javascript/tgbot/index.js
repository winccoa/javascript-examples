'use strict';
const { WinccoaManager } = require('winccoa-manager');
const { runTelegramBot } = require('./TelegramBot');

const winccoa = new WinccoaManager();

runTelegramBot(winccoa);

