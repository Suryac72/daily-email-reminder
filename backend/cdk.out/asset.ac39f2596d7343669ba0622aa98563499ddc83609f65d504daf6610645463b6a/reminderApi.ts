import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, message } = body;

    if (!email || !message) {
      return { statusCode: 400, body: 'Missing email or message' };
    }

    await ddb.put({
      TableName: tableName,
      Item: { email, message, timestamp: new Date().toISOString() },
    }).promise();

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err }) };
  }
};
