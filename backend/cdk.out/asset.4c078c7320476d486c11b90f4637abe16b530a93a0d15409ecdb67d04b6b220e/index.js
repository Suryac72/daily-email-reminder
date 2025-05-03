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
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");
var ddb = new import_client_dynamodb.DynamoDBClient({});
var tableName = process.env.TABLE_NAME;
var handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, message } = body;
    if (!email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing email or message" })
      };
    }
    const item = (0, import_util_dynamodb.marshall)({
      email,
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    await ddb.send(new import_client_dynamodb.PutItemCommand({
      TableName: tableName,
      Item: item
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error("Error processing request:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
