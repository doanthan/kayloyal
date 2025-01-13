import connect from 'services/db';
import Campaign from 'models/campaign';
import { onlyAuthUser } from 'services/server-library';
import axios from 'axios'

export default async function handler(req, res) {
    const {
        body: { id, status },
        method,
    } = req;
    //status === revert || cancel || schedule
    // Ensure this is a PATCH request
    if (method !== 'PATCH') {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        console.log("NOT AUTHENTICATED")
        return;
    }

    const user = req.user
    try {
        await connect()
        const campaign = await Campaign.findById(id)
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        if (!user._id.equals(campaign.userId)) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (campaign.klaviyoScheduledCampaigns && campaign.klaviyoScheduledCampaigns.length > 0) {
            const promises = campaign.klaviyoScheduledCampaigns.map(async camp => {
                const matchingAccount = user.accounts.find(account => account.klaviyoPublic === camp.klaviyoPublic);
                if (!matchingAccount) {
                    return;
                }
                const url = (status === "schedule") ? `https://a.klaviyo.com/api/campaign-send-jobs/` : `https://a.klaviyo.com/api/campaign-send-jobs/${camp.campaignId}`;
                const headers = {
                    'Content-Type': 'application/json',
                    'revision': '2024-07-15',
                    'Authorization': process.env.NEXT_PUBLIC_ENV === "DEV" ? `Klaviyo-API-Key ${matchingAccount.pk}` : `Bearer ${matchingAccount.access_token}`
                };
                try {
                    if (status === "schedule") {
                        await axios.post(url, { data: { type: 'campaign-send-job', id: camp.campaignId } }, { headers });
                        console.log(`Successfully scheduled campaign ${camp.campaignId}`);
                    } else {
                        console.log(status)
                        console.log(camp.campaignId)

                        await axios.patch(url, {
                            data: { type: 'campaign-send-job', attributes: { action: status }, id: camp.campaignId }
                        }, { headers });
                        console.log(`Successfully updated campaign ${camp.campaignId}`);
                    }
                } catch (error) {
                    console.error(`Error deleting campaign ${camp.campaignId}:`, error.message);
                }
            });

            try {
                await Promise.all(promises);
                campaign.status = status === "revert" ? "DRAFT" : status === "schedule" ? "SCHEDULED" : "CANCELLED"
                await campaign.save()
                res.status(200).json({ message: "Campaign and associated Klaviyo campaigns deleted successfully" });
            } catch (error) {
                console.error('Error occurred while deleting Klaviyo campaigns:', error);
                // Handle the error appropriately
                return res.status(500).json({ error: "Failed to delete all Klaviyo campaigns" });
            }
        }
        if (campaign.matchedCount === 0) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.status(200).json({ message: 'Campaign status updated successfully' });
    } catch (error) {
        console.error('Error updating campaign status:', error);
        res.status(500).json({ error: 'Error updating campaign status' });
    }
}