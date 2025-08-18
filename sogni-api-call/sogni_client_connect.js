import dotenv from 'dotenv';
import { SogniClient } from '@sogni-ai/sogni-client';

dotenv.config();  // loads .env into process.env
console.log(process.env.SOGNI_USERNAME);
console.log(process.env.SOGNI_PASSWORD);
console.log(process.env.SOGNI_APP_ID);
const USERNAME = process.env.SOGNI_USERNAME;
const PASSWORD = process.env.SOGNI_PASSWORD;

const options = {
  appId: process.env.SOGNI_APP_ID, // Required, must be unique string, UUID is recommended
  network: 'relaxed', // Network to use, 'fast' or 'relaxed'
}

const client = await SogniClient.createInstance(options);
// Login to Sogni account and establish WebSocket connection to Supernet
await client.account.login(USERNAME, PASSWORD);
// Now wait until list of available models is received.
// This step is only needed if you want to create project immediately.
const models = await client.projects.waitForModels();
// You can get list of available models any time from `client.projects.availableModels`