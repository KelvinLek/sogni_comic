import dotenv from 'dotenv';
import { SogniClient } from '@sogni-ai/sogni-client';

dotenv.config();

const USERNAME = process.env.SOGNI_USERNAME;
const PASSWORD = process.env.SOGNI_PASSWORD;

const options = {
    appId: process.env.SOGNI_APP_ID,
    network: 'relaxed',
};

export async function generateImage(prompt) {
    console.log('[generateImage] Called with prompt:', prompt);
    const client = await SogniClient.createInstance(options);
    console.log('[generateImage] SogniClient instance created');
    await client.account.login(USERNAME, PASSWORD);
    console.log('[generateImage] Logged in as:', USERNAME);

    const project = await client.projects.create({
        modelId: 'coreml-animaPencilXL_v500',
        positivePrompt: prompt,
        negativePrompt: 'malformation, bad anatomy, bad hands, cropped, low quality',
        stylePrompt: 'anime',
        tokenType: 'spark',
        steps: 20,
        guidance: 7.5,
        numberOfImages: 1,
    });
    console.log('[generateImage] Project created:', project.id);

    const imageUrls = await project.waitForCompletion();
    console.log('[generateImage] Image URLs:', imageUrls);
    return imageUrls;
}