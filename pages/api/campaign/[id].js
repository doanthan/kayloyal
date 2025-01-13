import Campaign from 'models/campaign'
import { onlyAuthUser } from "services/server-library";
import connect from "services/db";
import axios from 'axios'

export default async function handler(req, res) {
    const {
        query: { id },
        method,
        body,
    } = req;

    await connect()    // Check if the user is authenticated before proceeding
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = req.user
    switch (method) {
        case 'GET':
            const getCampaign = await Campaign.findById(id)
            res.status(200).json({ data: getCampaign });
            break;
        case 'DELETE':
            const camp = await Campaign.findById(id)
            if (!camp) {
                return res.status(404).json({ error: "Campaign not found" });
            }
            if (!user._id.equals(camp.userId)) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (camp.klaviyoScheduledCampaigns && camp.klaviyoScheduledCampaigns.length > 0) {
                const deletePromises = camp.klaviyoScheduledCampaigns.map(async delCamp => {
                    const matchingAccount = user.accounts.find(account => account.klaviyoPublic === delCamp.klaviyoPublic);
                    if (!matchingAccount) {
                        return;
                    }
                    const url = `https://a.klaviyo.com/api/campaigns/${delCamp.campaignId}`;
                    const headers = {
                        'Content-Type': 'application/json',
                        'revision': '2024-07-15',
                        'Authorization': process.env.NEXT_PUBLIC_ENV === "DEV" ? `Klaviyo-API-Key ${matchingAccount.pk}` : `Bearer ${matchingAccount.access_token}`
                    };
                    try {
                        await axios.delete(url, { headers });
                        console.log(`Successfully deleted campaign ${delCamp.campaignId}`);
                    } catch (error) {
                        console.error(`Error deleting campaign ${delCamp.campaignId}:`, error.message);
                    }
                });

                try {
                    await Promise.all(deletePromises);
                    await Campaign.findByIdAndDelete(id);
                    res.status(200).json({ message: "Campaign and associated Klaviyo campaigns deleted successfully" });
                } catch (error) {
                    console.error('Error occurred while deleting Klaviyo campaigns:', error);
                    // Handle the error appropriately
                    return res.status(500).json({ error: "Failed to delete all Klaviyo campaigns" });
                }
            }

            res.status(200).json({ id, name: 'Sample Campaign', description: 'This is a sample campaign.' });
            break;

        case 'PATCH':
            const { date, customTemplates, subjectData, isSmartSending, isSendTimeOptimized, scheduledDate, sendScheduleType, sendToAccounts, mergeTemplate, templateType, mergeTags, inclusionAccountTags, exclusionAccountTags, inclusionAccounts, exclusionAccounts } = body

            let updateFields = {
                ...(sendToAccounts ? { sendToAccounts } : {}),
                ...(mergeTemplate ? { mergeTemplate } : {}),
                ...(templateType ? { templateType } : {}),
                ...(mergeTags ? { mergeTags } : {}),
                ...(inclusionAccountTags ? { inclusionAccountTags } : {}),
                ...(inclusionAccounts ? { inclusionAccounts } : {}),
                ...(exclusionAccountTags ? { exclusionAccountTags } : {}),
                ...(exclusionAccounts ? { exclusionAccounts } : {}),
                ...(sendScheduleType ? { sendScheduleType } : {}),
                ...(scheduledDate ? { scheduledDate } : {}),
                ...(isSendTimeOptimized ? { isSendTimeOptimized } : {}),
                ...(isSmartSending ? { isSmartSending } : {}),
                ...(subjectData ? { subjectData } : {}),
                ...(customTemplates ? { customTemplates } : {}),
                ...(date ? { date } : {})
            };
            const campaign = await Campaign.findByIdAndUpdate(id, updateFields, { new: true })
            res.status(200).json({ id, data: campaign });
            break;

        default:
            // Handle any other HTTP method
            res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}