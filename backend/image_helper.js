import axios from 'axios';
import fs from 'fs/promises'; // async fs

// Download image and save to disk
export async function downloadImage(url, path) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.writeFile(path, response.data); // async write
}

// Read a local image into a Buffer
export async function getReferenceImageBuffer(path) {
    const buffer = await fs.readFile(path);
    return buffer; // can be passed as File/Blob/Buffer
}

// Delete a file asynchronously
export async function deleteImageFile(path) {
    try {
        await fs.unlink(path); // async delete
    } catch (err) {
        if (err.code !== 'ENOENT') { // ignore if file doesn't exist
            throw err;
        }
    }
}