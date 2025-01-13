import pako from 'pako';
import { promises as fs } from 'fs';

async function testCompression() {
    try {
        // Load your JSON file asynchronously
        const jsonData = await fs.readFile('test1.json', 'utf-8');
        const originalSize = Buffer.byteLength(jsonData, 'utf-8');

        // Compress the JSON data
        const compressedData = pako.deflate(jsonData, { to: 'string' });
        const compressedSize = Buffer.byteLength(compressedData, 'utf-8');

        // Calculate and log compression ratio
        console.log(`Original Size: ${originalSize} bytes`);
        console.log(`Compressed Size: ${compressedSize} bytes`);
        console.log(`Compression Ratio: ${(100 - (compressedSize / originalSize * 100)).toFixed(2)}%`);
    } catch (error) {
        console.error('Error during file reading or compression:', error);
    }
}

testCompression();