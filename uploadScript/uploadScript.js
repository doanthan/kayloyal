const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3.js')
const axios = require('axios')


const CLOUDFLARE_ID = "2be864538f854179d5e9c2d728512afa"
const CLOUDFLARE_ACCESS_KEY = "866688b668b94791e876bd9457bb1807"
const CLOUDFLARE_SECRET_KEY = "0bd126a0bfe74f017c04dd6e45699a53127af95b67e3cb5b108c8ea2fab29565"

// Configure AWS SDK with Cloudflare R2 credentials
const s3 = new S3({
    endpoint: `https://${CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
    accessKeyId: `${CLOUDFLARE_ACCESS_KEY}`,
    secretAccessKey: `${CLOUDFLARE_SECRET_KEY}`,
    signatureVersion: 'v4',
});

// Function to upload file to Cloudflare R2
const uploadFile = async (filePath, bucketName, key) => {
    try {
        const fileContent = fs.readFileSync(filePath);

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: 'application/javascript', // Set the content type
        };

        const data = await s3.upload(params).promise();
        updateCloudFlareCache(data.Location)

        console.log(`File uploaded successfully. ${data.Location}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

// Define the file path, bucket name, and key
const filePath = path.join(__dirname, 'script.js');
const bucketName = 'kaypush';
const key = 'js/script.js';

// Upload the file
uploadFile(filePath, bucketName, key);

const updateCloudFlareCache = async (fileUrl) => {
    const zoneId = "08047704f97d3b52cf7dac86ddce71fe";
    const apiToken = "4p6FXme1uptZFfrT4LJU7PPSZsR62AIvKGI3S0Fl";
    const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };

    const data = {
        files: [fileUrl],
    };

    try {
        const response = await axios.post(apiUrl, data, { headers });
        console.log('Cache purged successfully:', response.data);
    } catch (error) {
        console.error('Error purging cache:', error);
    }
};