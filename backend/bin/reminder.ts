#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReminderStack } from '../lib/reminder-stack';

const app = new cdk.App();
new ReminderStack(app, 'ReminderStack');
