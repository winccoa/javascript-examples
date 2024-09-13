const { WinccoaManager } = require('winccoa-manager');
const winccoa = new WinccoaManager();
const { IncomingWebhook } = require('ms-teams-webhook');

const url = 'change to your created WebHook URL';
if (url == 'change to your created WebHook URL') {
  throw new Error("MS_TEAMS_WEBHOOK_URL is required");
}

// Initialize
const webhook = new IncomingWebhook(url);
const alm_state=[
  'No alert',
  'CAME unacknowledged',
  'CAME acknowledged',
  'WENT unacknowledged',
  'CAME/WENT/unacknowledged'];

function main(){
  winccoa.dpQueryConnectSingle(async (result)=>{
    console.log(JSON.stringify(result,null,2));
    if (result.length>1) {
      const res={
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        summary: "OA Alarms",
        themeColor: "0078D7",
        title: 'OA Alarms',
        sections: [],
      };

      for (let i=1;i<result.length;i++) {
        res.sections.push(
          {
            activityTitle:  result[i][3].toString(),
            activitySubtitle:  result[i][0].toString(),
            text:  `Value: ${result[i][2]} at ${result[i][1].date} ${alm_state[result[i][4]]||''}`,
          }
        )
      }
      //console.log(JSON.stringify(res,null,2));
      await webhook.send(res);
    }

  }, true, 'SELECT ALERT \'_alert_hdl.._value\', \'_alert_hdl.._text\', \'_alert_hdl.._act_state\' FROM \'*.**\'');
}

main();