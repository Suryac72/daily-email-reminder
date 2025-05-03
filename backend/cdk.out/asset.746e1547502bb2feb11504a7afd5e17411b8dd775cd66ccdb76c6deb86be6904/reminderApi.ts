import { APIGatewayProxyHandler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'ap-south-1' });
const senderEmail = process.env.SENDER_EMAIL || 'etasyasharma4836@gmail.com'; 

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, message } = body;

    if (!email || !message) {
      return { statusCode: 400, body: 'Missing recipient email or message' };
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
            <div class="title">📬 New Reminder</div>
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
        Subject: { Data: '📅 Your Reminder' }
      },
      Source: senderEmail
    };

    const command = new SendEmailCommand(params);
    await ses.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Unknown error' }) };
  }
};
