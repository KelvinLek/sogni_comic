import express from 'express';
import cors from 'cors';
import { generateImage, generateImageWithReference } from './sogni_client_connect.js';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/generate', async (req, res) => {
    const { prompt, imageUrl, style } = req.body; // <-- add style here
    try {
        let images;
        if (imageUrl) {
            images = await generateImageWithReference(prompt, imageUrl, style); // <-- pass style
        } else {
            images = await generateImage(prompt, style); // <-- pass style
        }
        res.json({ images });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy image download endpoint
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('Missing url');
    try {
        const response = await fetch(url);
        if (!response.ok) return res.status(500).send('Failed to fetch image');
        res.set('Content-Type', response.headers.get('content-type') || 'image/png');
        //res.set('Content-Disposition', 'attachment; filename=image.png');
        response.body.pipe(res);
    } catch (err) {
        res.status(500).send('Error fetching image');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => console.log(`Server running on port ${PORT}`));