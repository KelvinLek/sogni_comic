import dotenv from 'dotenv';
import { downloadImage, deleteImageFile, getReferenceImageBuffer } from './image_helper.js'
import { SogniClient } from '@sogni-ai/sogni-client';

dotenv.config();

const USERNAME = process.env.SOGNI_USERNAME;
const PASSWORD = process.env.SOGNI_PASSWORD;

const options = {
    appId: process.env.SOGNI_APP_ID,
    network: 'fast',
};

const client = await SogniClient.createInstance(options);
console.log('[sogni_client_connect] SogniClient instance created');
await client.account.login(USERNAME, PASSWORD);
console.log('[sogni_client_connect] Logged in as:', USERNAME);

// Style hashmap for model
const modelMap = new Map();
modelMap.set('comic', 'coreml-aZovyaRPGArtistTools_v4_768');
modelMap.set('anime','coreml-animaPencilXL_v500');
modelMap.set('superhero','coreml-aZovyaRPGArtistTools_v4_768');
modelMap.set('black and white manga','coreml-animeLineart-AnythingV5Ink-512x512-cn');
modelMap.set('cartoon','coreml-diPixCartoon_v10-cn');
modelMap.set('realistic','coreml-sogni_artist_v1_768');

// Options for image generation
const additionalStyling = " in a comic book style, dynamic composition, cinematic framing, expressive characters, bold lines, vibrant atmosphere, detailed backgrounds, action-packed, dramatic lighting, high contrast, storytelling focus";
// const additionalStyling = " style, dynamic, bold";
const imageGenSeed = Math.floor(Math.random() * 0xFFFFFFFF);


export async function generateImage(prompt,style='comic') {
    console.log('[generateImage] Called with prompt:', prompt);
    console.log('[generateImage] Called with style:', style);
    const project = await client.projects.create({
        modelId: modelMap.get(style),
        // modelId: 'coreml-sogni_artist_v1_768',
        positivePrompt: prompt,
        negativePrompt: 'bad anatomy, malformed, distorted, deformed, poorly drawn hands, missing fingers, extra fingers, fused fingers, broken limbs, missing arms, missing legs, extra arms, extra legs, disconnected limbs, cloned body parts, poorly drawn face, asymmetrical face, extra eyes, fused eyes, misaligned eyes, distorted proportions, glitch, blurry, pixelated, watermark, signature, text, cropped head, out of frame, duplicate characters',
        stylePrompt: style + additionalStyling,
        tokenType: 'spark',
        steps: 20,
        guidance: 8.5,
        numberOfImages: 3,
        seed: imageGenSeed
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
        // modelId: 'coreml-sogni_artist_v1_768',
        modelId: modelMap.get(style),
        positivePrompt: prompt ,
        negativePrompt: 'bad anatomy, malformed, distorted, deformed, poorly drawn hands, missing fingers, extra fingers, fused fingers, broken limbs, missing arms, missing legs, extra arms, extra legs, disconnected limbs, cloned body parts, poorly drawn face, asymmetrical face, extra eyes, fused eyes, misaligned eyes, distorted proportions, glitch, blurry, pixelated, watermark, signature, text, cropped head, out of frame, duplicate characters',
        stylePrompt: style + additionalStyling,
        tokenType: 'spark',
        steps: 20,
        guidance: 8.5,
        numberOfImages: 3,
        seed: imageGenSeed,
        startingImage: referenceImageBuffer,
        startingImageStrength: 0.01
    });
    console.log('[generateImageWithReference] Project created:', project.id);

    const imageUrls = await project.waitForCompletion();
    console.log('[generateImageWithReference] Image URLs:', imageUrls);

    // Delete reference images
    deleteImageFile('./referenceImage.png');
    return imageUrls;
}