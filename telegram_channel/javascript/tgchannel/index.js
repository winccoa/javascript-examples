'use strict';
const { WinccoaManager } = require('winccoa-manager');
const { runTelegramChannel } = require('./TelegramChannel');

const winccoa = new WinccoaManager();

runTelegramChannel(winccoa);

