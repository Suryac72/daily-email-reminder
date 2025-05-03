import { Handler } from 'aws-lambda';
import { DynamoDB, SES } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();
const ses = new SES();
const tableName = process.env.TABLE_NAME!;

export const handler: Handler = async () => {
  const data = await ddb.scan({ TableName: tableName }).promise();

  const promises = data.Items?.map(item => {
    const params = {
      Destination: { ToAddresses: [item.email] },
      Message: {
        Body: {
          Text: { Data: item.message }
        },
        Subject: { Data: 'Reminder' }
      },
      Source: 'etasyasharma4836@gmail.com' 
    };

    return ses.sendEmail(params).promise();
  }) || [];

  await Promise.all(promises);
};
