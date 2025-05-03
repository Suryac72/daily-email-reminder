import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Effect } from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Duration } from 'aws-cdk-lib';

export class ReminderStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const emailDetailsTable = new dynamodb.Table(this, 'EmailDetailsTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
    });

    // Lambda for API Gateway integration (handles storing email details)
    const reminderApi = new NodejsFunction(this, 'ReminderApiLambda', {
      entry: path.join(__dirname, '../lambda/reminderApi.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: emailDetailsTable.tableName,
      },
    });


    // Grant permissions for DynamoDB access to Lambdas
    emailDetailsTable.grantReadWriteData(reminderApi);


    // API Gateway setup
    const api = new apigw.RestApi(this, 'ReminderApi', {
      defaultCorsPreflightOptions: {  // Added CORS configuration here
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ['*'], // Allow all headers
      },
    });

    const sendReminder = new NodejsFunction(this, 'SendReminderFunction', {
      entry: path.join(__dirname, '../lambda/sendReminder.ts'),  
      handler: 'handler',  
      runtime: lambda.Runtime.NODEJS_20_X
    });

    // Create the /reminders resource and attach the POST method
    const reminders = api.root.addResource('reminders');
     reminderApi.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail',"ses:SendRawEmail"],
      resources: ['*'],
      effect: Effect.ALLOW
    }));

    sendReminder.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail',"ses:SendRawEmail"],
      resources: ['*'],
      effect: Effect.ALLOW
    }));
    
    const scheduleRule = new events.Rule(this, 'FiveMinuteSchedule', {
      schedule: events.Schedule.cron({
        minute: '0/5',
        hour: '*',
        day: '*',
        month: '*',
      }),
    });
    scheduleRule.addTarget(new targets.LambdaFunction(sendReminder));
    reminders.addMethod('POST', new apigw.LambdaIntegration(reminderApi));
     new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.rate(Duration.minutes(5)),
      targets: [new targets.LambdaFunction(sendReminder)],
    });
  }
}
