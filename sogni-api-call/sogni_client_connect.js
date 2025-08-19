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

// Find model that has the most workers
// const mostPopularModel = models.reduce((a, b) =>
//   a.workerCount > b.workerCount ? a : b
// );

// console.log(mostPopularModel);

// //Get a list of all models
// const listOfModels = await client.projects.availableModels;
// console.log(listOfModels);

// Create a project using the most popular model
const project = await client.projects.create({
  modelId: 'coreml-animaPencilXL_v500',
  positivePrompt: 'A cat wearing a hat',
  negativePrompt:
    'malformation, bad anatomy, bad hands, missing fingers, cropped, low quality, bad quality, jpeg artifacts, watermark',
  stylePrompt: 'anime',
  tokenType: 'spark',
  steps: 20, 
  guidance: 7.5, 
  numberOfImages: 1
});

project.on('progress', (progress) => {
  console.log('Project progress:', progress);
});

const imageUrls = await project.waitForCompletion();
// Now you can use image URLs to download images. 
// Note that images will be available for 24 hours only!
console.log('Image URLs:', imageUrls);