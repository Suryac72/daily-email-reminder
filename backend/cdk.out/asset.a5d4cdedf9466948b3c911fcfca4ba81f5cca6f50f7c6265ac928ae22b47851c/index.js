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
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_client_ses = require("@aws-sdk/client-ses");
var ddb = new import_client_dynamodb.DynamoDBClient({});
var ses = new import_client_ses.SESClient({});
var tableName = process.env.TABLE_NAME;
var handler = async () => {
  const scanResult = await ddb.send(new import_client_dynamodb.ScanCommand({ TableName: tableName }));
  const promises = scanResult.Items?.map((item) => {
    const params = {
      Destination: { ToAddresses: [item.email.S] },
      Message: {
        Body: {
          Text: { Data: item.message.S }
        },
        Subject: { Data: "Reminder" }
      },
      Source: "etasyasharma4836@gmail.com"
    };
    return ses.send(new import_client_ses.SendEmailCommand(params));
  }) || [];
  await Promise.all(promises);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
