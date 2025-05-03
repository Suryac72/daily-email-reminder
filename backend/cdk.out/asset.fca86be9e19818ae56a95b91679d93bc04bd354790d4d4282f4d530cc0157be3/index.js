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

// lambda/reminderApi.ts
var reminderApi_exports = {};
__export(reminderApi_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(reminderApi_exports);
var import_client_ses = require("@aws-sdk/client-ses");
var ses = new import_client_ses.SESClient({ region: "ap-south-1" });
var senderEmail = process.env.SENDER_EMAIL || "etasyasharma4836@gmail.com";
var handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, message } = body;
    if (!email || !message) {
      return { statusCode: 400, body: "Missing recipient email or message" };
    }
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            .title { font-size: 22px; font-weight: bold; color: #333; }
            .message { font-size: 18px; color: #555; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">\u{1F4EC} New Reminder</div>
            <div class="message">${message}</div>
          </div>
        </body>
      </html>
    `;
    const params = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Html: { Data: htmlBody },
          Text: { Data: message }
        },
        Subject: { Data: "\u{1F4C5} Your Reminder" }
      },
      Source: senderEmail
    };
    const command = new import_client_ses.SendEmailCommand(params);
    await ses.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully" })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
