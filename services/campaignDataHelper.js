export function groupAndAggregateCampaigns(campaigns) {
    const grouped = new Map();

    campaigns.forEach(campaign => {
        campaign.tagNames.forEach(tag => {
            if (!grouped.has(tag)) {
                grouped.set(tag, {
                    tag: tag,
                    campaigns: [],
                    statistics: {
                        opens: 0,
                        open_rate: 0,
                        bounced: 0,
                        clicks: 0,
                        clicks_unique: 0,
                        click_rate: 0,
                        delivered: 0,
                        bounced_or_failed: 0,
                        bounced_or_failed_rate: 0,
                        delivery_rate: 0,
                        failed: 0,
                        recipients: 0,
                        opens_unique: 0,
                        bounce_rate: 0,
                        unsubscribe_rate: 0,
                        spam_complaint_rate: 0,
                        conversions: 0,
                        conversion_uniques: 0,
                        conversion_value: 0,
                        conversion_rate: 0,
                        average_order_value: 0,
                        revenue_per_recipient: 0,
                        unsubscribes: 0,
                        spam_complaints: 0
                    }
                });
            }

            let group = grouped.get(tag);
            group.campaigns.push({
                campaignName: campaign.campaignName,
                statistics: campaign.statistics
            });

            Object.keys(campaign.statistics).forEach(stat => {
                if (stat.includes('_rate')) {
                    // Average the rate fields
                    group.statistics[stat] += campaign.statistics[stat];
                } else {
                    // Sum the other fields
                    group.statistics[stat] += campaign.statistics[stat];
                }
            });
        });
    });

    // Calculate averages for rate fields and convert Map to array
    const result = Array.from(grouped.values()).map(group => {
        const totalCampaigns = group.campaigns.length;
        Object.keys(group.statistics).forEach(stat => {
            if (stat.includes('_rate')) {
                group.statistics[stat] /= totalCampaigns;
            }
        });
        return group;
    });

    return result;
}