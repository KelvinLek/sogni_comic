import dotenv from 'dotenv';
import { downloadImage, deleteImageFile, getReferenceImageBuffer } from './image_helper.js'
import { SogniClient } from '@sogni-ai/sogni-client';

dotenv.config();

const USERNAME = process.env.SOGNI_USERNAME;
const PASSWORD = process.env.SOGNI_PASSWORD;

const options = {
    appId: process.env.SOGNI_APP_ID,
    network: 'relaxed',
};

const client = await SogniClient.createInstance(options);
console.log('[sogni_client_connect] SogniClient instance created');
await client.account.login(USERNAME, PASSWORD);
console.log('[sogni_client_connect] Logged in as:', USERNAME);

export async function generateImage(prompt,style='comic') {
    console.log('[generateImage] Called with prompt:', prompt);
    console.log('[generateImage] Called with style:', style);
    const project = await client.projects.create({
        modelId: 'coreml-animaPencilXL_v500',
        positivePrompt: prompt,
        negativePrompt: 'malformation, bad anatomy, bad hands, cropped, low quality',
        stylePrompt: style,
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

export async function generateImageWithReference(prompt, imageUrl, style='comic') {

    // Download image by url and wait for it to finish
    console.log('[generateImageWithReference] Downloading reference image');
    await downloadImage(imageUrl, 'referenceImage.png');
    console.log('Image downloaded');

    const referenceImageBuffer = await getReferenceImageBuffer('referenceImage.png');
    
    // Generate images using reference image
    console.log('[generateImageWithReference] Called with prompt:', prompt);
    const project = await client.projects.create({
        modelId: 'coreml-animaPencilXL_v500',
        positivePrompt: prompt,
        negativePrompt: 'malformation, bad anatomy, bad hands, cropped, low quality',
        stylePrompt: style,
        tokenType: 'spark',
        steps: 20,
        guidance: 7.5,
        numberOfImages: 3,
        startingImage: referenceImageBuffer,
        startingImageStrength: 0.2
    });
    console.log('[generateImageWithReference] Project created:', project.id);

    const imageUrls = await project.waitForCompletion();
    console.log('[generateImageWithReference] Image URLs:', imageUrls);

    // Delete reference images
    deleteImageFile('./referenceImage.png');
    return imageUrls;
}