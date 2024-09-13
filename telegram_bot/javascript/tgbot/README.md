# Telegram bot for wincc OA

## Features
 - sending messages to users
 - subscribe users to dp changes
 - subscribe users to dpQuery

## Installation

1. Copy this directory to the drive where your WinCC OA projects are residing.

2. Integrate this directory as a sub-project of a WinCC OA project.

3. Use the ASCII manager to import dplist/tgbot.dpl.

4. Open a command prompt in the directory javascript/tgbot

5. Call the following command to install required modules

   ```
   > npm install
   ```

6. Add a __JavaScript Manager__ with `tgbot/index.js` as its only parameter. Set Start mode to __manual__.

7. Create new telegram bot https://core.telegram.org/bots which will result in an API Key to be used.

8. Put you API key from step 7 to dpe "myBot.apiKey" via WinCC OA Para module

9. Start the manager added in step 6.

10. Open the panel TgBotPanel.pnl using the WinCC OA User Interface 

### TgBotPanel.pnl

 - To assign user name (group name) to chat id, choose chat id and user/group name (or type it). Press button "Assign users/groups"

 - To subscribe an user to dp changes choose user from dropdown list and add dpes to the field "DPEs" or drag & drop DPE from para.
***If you add dpes manually, please check it should be ";" after every DPE***
Press button "Assign data points"

 - To subscribe an user to dp changes choose user from dropdown list and add query to the field "Query". Query should look like SELECT ALERT '_alert_hdl.._value' FROM '*'.
Press button "Assign query"

 - To send message to a user/group, choose user/group name from dropdown list and type message.
 ***It is not allowed to use symbol # in messages***
 Press button "Send message to user"

***After changing dpe/query subscription you should reboot manager***

### Handling messages from user

Dpe "myBot.allowedChats" contains users'/groups' chat ids for users/groups which messages are handled.
Currently only two commands are implemented: "/set" and "/ack" 

For using this functionality:

 - Find chat id in dpe "myBot.chatIds".
 - add the chat id to dpe "myBot.allowedChats".
 - to set partcular dpe send message like "/set dpename newValue" (*for boolean variables only values 0 and false (case insensitive) mean false*).
 - to ack alarm send message like "/ack dpename"