"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lambda/sendReminder.ts
var sendReminder_exports = {};
__export(sendReminder_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(sendReminder_exports);
var import_client_ses = require("@aws-sdk/client-ses");
var ses = new import_client_ses.SESClient({ region: "ap-south-1" });
var recipients = ["gomeroidluci69@gmail.com"];
var buildMessage = () => `
  <html>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #2e6c80;">\u23F0 Daily Reminder</h2>
      <p>Don't forget to stay on track today! Here's your reminder:</p>
      <ul>
        <li>\u2705 Stay focused</li>
        <li>\u2705 Prioritize tasks</li>
        <li>\u2705 Take breaks</li>
      </ul>
      <p style="margin-top: 20px;">Cheers,<br/>Reminder Bot</p>
    </body>
  </html>
`;
var handler = async () => {
  const message = buildMessage();
  const command = new import_client_ses.SendEmailCommand({
    Destination: { ToAddresses: recipients },
    Message: {
      Body: { Html: { Data: message } },
      Subject: { Data: "\u23F0 Your 5-Minute Reminder" }
    },
    Source: "etasyasharma4836@gmail.com"
  });
  await ses.send(command);
  console.log("Email sent!");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
