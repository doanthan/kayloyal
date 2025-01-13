import { onlyAuthUser } from "services/server-library";
import Campaign from "models/campaign"
import connect from "services/db";






export default async function handler(req, res) {
    await connect()    // Check if the user is authenticated before proceeding
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = req.user
    if (req.method === 'POST') {
        const { name, tags, scheduledDate = null } = req.body
        try {
            // Validate the input
            if (!name || !tags || !Array.isArray(tags)) {
                return res.status(400).json({ message: 'Invalid input data. Name and tags are required.' });
            }

            // Create a new campaign
            const newCampaign = new Campaign({
                name,
                tags,
                scheduledDate,
                userId: user._id
            });

            // Save the campaign to the database
            await newCampaign.save();
            res.status(201).json(newCampaign);
        } catch (error) {
            console.log(error.message)
            res.status(400).json({ success: false, message: error.message });
        }
    }

}

