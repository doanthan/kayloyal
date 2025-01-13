import connect from 'services/db'
import Pass from 'models/pass'
import User from 'models/user'
import { onlyAuthUser } from 'services/server-library'
import { fileUploadCloudFlare } from 'services/server-library'
import { customAlphabet } from 'nanoid'
const generateId = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7)

// Helper function to generate unique ID with retries
async function generateUniqueId(maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const uid = generateId()
        // Check if uid exists
        const exists = await Pass.findOne({ uid })
        if (!exists) {
            return uid // Found a unique ID
        }
        console.log(`UID ${uid} already exists, attempt ${attempt + 1} of ${maxRetries}`)
    }
    throw new Error(`Failed to generate unique ID after ${maxRetries} attempts`)
}

export default async function handler(req, res) {
    try {
        await connect()
        const isAuthenticated = await onlyAuthUser(req, res);
        if (!isAuthenticated) {
            console.log("NOT AUTHENTICATED")
            return;
        }

        // Generate unique uid with retries
        const uid = await generateUniqueId()

        // // Upload images to Cloudflare concurrently
        // const [iconUrl, stripUrl] = await Promise.all([
        //     req.body.iconImage ? fileUploadCloudFlare(req.body.iconImage) : Promise.resolve(null),
        //     req.body.stripImage ? fileUploadCloudFlare(req.body.stripImage) : Promise.resolve(null)
        // ])

        // Structure images to match schema
        const images = {
            logo: {
                google: "iconUrl"
            },
            strip: {
                google: "stripUrl"
            },
            thumbnail: "iconUrl"  // Using icon as thumbnail
        }

        console.log("uid", uid)
        // Create pass
        const pass = await Pass.create({
            ...req.body,
            uid,
            images,
            status: 'active',
            createdAt: new Date()
        })

        // Add pass to user's passes array
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: { passes: pass._id }  // Add pass ID to passes array
            },
            { new: true }  // Return updated document
        )



        return res.status(201).json({
            success: true,
            data: pass
        })

    } catch (error) {
        console.error('Error creating pass:', error)
        return res.status(500).json({
            success: false,
            message: 'Error creating pass',
            error: error.message
        })
    }
}
