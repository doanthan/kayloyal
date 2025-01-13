import { IncomingForm } from 'formidable';
import { fileUploadCloudFlare, onlyAuthUser, uploadJsonFileCloudFlare, updateCloudFlareCache } from 'services/server-library';

// Change the config to allow parsing JSON body
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'  // Adjust size limit as needed
        }
    }
}


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        console.log("not authenticated!!");
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { img } = req.body
    if (!img) {
        return res.status(400).json({ message: 'No image provided!' })
    }


    try {
        const imageUrl = await fileUploadCloudFlare(img, 'logos')
        console.log(imageUrl)
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }

}
