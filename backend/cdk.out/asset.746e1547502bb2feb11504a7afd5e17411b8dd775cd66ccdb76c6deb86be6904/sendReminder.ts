import { ScheduledHandler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES
const ses = new SESClient({ region: 'ap-south-1' });

// Define hardcoded or dynamic list of recipients
const recipients = ['recipient@example.com'];

// Build HTML message
const buildMessage = () => `
  <html>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #2e6c80;">⏰ Daily Reminder</h2>
      <p>Don't forget to stay on track today! Here's your reminder:</p>
      <ul>
        <li>✅ Stay focused</li>
        <li>✅ Prioritize tasks</li>
        <li>✅ Take breaks</li>
      </ul>
      <p style="margin-top: 20px;">Cheers,<br/>Reminder Bot</p>
    </body>
  </html>
`;

export const handler: ScheduledHandler = async () => {
  const message = buildMessage();

  const command = new SendEmailCommand({
    Destination: { ToAddresses: recipients },
    Message: {
      Body: { Html: { Data: message } },
      Subject: { Data: '⏰ Your 5-Minute Reminder' },
    },
    Source: 'your-verified-email@example.com',
  });

  await ses.send(command);
  console.log('Email sent!');
};
