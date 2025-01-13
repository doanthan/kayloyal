import { IncomingForm } from 'formidable';
import { fileUploadCloudFlare, onlyAuthUser, uploadJsonFileCloudFlare, updateCloudFlareCache } from 'services/server-library';
import User from 'models/user';
import { returnUserAccountsOnly } from 'services/server-library';
import axios from 'axios';

export const config = {
    api: {
        bodyParser: false, // Disabling body parsing, formidable will handle it
    },
};


export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const form = new IncomingForm();

    console.log("uploading image")
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({ error: err.message });
        }
        const { uid, img } = fields;
        // Assuming the file field name is 'img'
        const isAuthenticated = await onlyAuthUser(req, res, uid[0]);
        if (!isAuthenticated) {
            console.log("not authenticated!!");
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (!uid[0] && !img[0]) {
            return res.status(405).json({ message: 'No account id or image!' });
        }
        console.log(img[0])

        try {
            const imageUrl = await fileUploadCloudFlare(img[0], uid[0], 'icons')
            const result = await User.findOneAndUpdate(
                { "accounts.uid": uid[0] }, // query
                { $set: { 'accounts.$.logoImg': imageUrl } },
                { new: true }
            );

            let originalJSON = {};
            try {
                const response = await axios.get(`https://cdn.kaypush.com/accounts/${uid[0]}.json`);
                originalJSON = response.data;
            } catch (fetchError) {
                console.error('Error fetching original JSON:', fetchError.message);
            }
            console.log("originalJSON ", originalJSON)

            const updatedJSON = { ...originalJSON, iconUrl: imageUrl }
            const updateUrl = await uploadJsonFileCloudFlare(updatedJSON, uid[0])
            await updateCloudFlareCache(`https://cdn.kaypush.com/${updateUrl}`)

            const response = await returnUserAccountsOnly(result)
            res.status(200).json({ imageUrl, accounts: response.accounts });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: error.message });
        }
    });
}
