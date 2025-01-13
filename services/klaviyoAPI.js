import axios from "axios";

//TO DO PUT ALL KLAVIYO JUNK HERE



export const getKlaviyoAccount = async (pk, accessToken) => {
    const response = await fetch('https://a.klaviyo.com/api/accounts/', {
        headers: {
            'Authorization': pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${accessToken}`,
            'accept': 'application/json',
            'revision': '2024-10-15'
        }
    });
    const data = await response.json()

    const default_sender_name = data.data[0].attributes.contact_information.default_sender_name
    const default_sender_email = data.data[0].attributes.contact_information.default_sender_email
    const timezone = data.data[0].timezone
    return {
        klaviyoPublic: data.data[0].id, default_sender_email, default_sender_name, timezone
    }
}


export const fetchMetrics = async (pk, accessToken, metrics) => {
    let results = [];
    let url = 'https://a.klaviyo.com/api/metrics/';

    while (url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${accessToken}`,
                    'accept': 'application/json',
                    'revision': '2024-10-15'
                }
            });
            const data = response.data;
            // Filter metrics based on the name and integration key
            const filteredMetrics = data.data.filter(metric =>
                metrics.includes(metric.attributes.name) && metric.attributes.integration.key === "klaviyo"
            ).map(metric => ({
                name: metric.attributes.name,
                id: metric.id
            }));

            // Add filtered metrics to results
            results = results.concat(filteredMetrics);
            // Update the URL to the next page, or null if there is no next page
            url = data.links.next;
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;  // Optionally, handle retries or partial results here
        }
    }
    return results;
};




export async function uploadImageFromFile(formData, pk, access_token) {
    console.log("HERE!")
    const KLAVIYO_API_URL = 'https://a.klaviyo.com/api';
    console.log(formData)
    try {

        const response = await axios.post(
            `${KLAVIYO_API_URL}/image-upload`,
            formData,
            {
                headers: {
                    'Authorization': pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Revision': '2024-10-15' // Use latest API version
                }
            }
        );
        console.log(response.data.data)
        return response.data;
    } catch (error) {
        console.log(error.message)
        throw new Error(error.response?.data?.message || 'Error uploading image file');
    }
}

export async function uploadImageFromUrl(url, pk, access_token) {
    const KLAVIYO_API_URL = 'https://a.klaviyo.com/api';
    console.log(pk)
    console.log(access_token)
    try {
        const response = await axios.post(
            `${KLAVIYO_API_URL}/images`,
            {
                data: {
                    type: 'image',
                    attributes: {
                        import_from_url: url
                    }
                }
            },
            {
                headers: {
                    'Authorization': pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Revision': '2024-10-15' // Use latest API version
                }
            }
        );
        return response.data.data.attributes.image_url
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error uploading image from URL');
    }
}

export const getCampaigns = async (pk, access_token, channel, startDate, endDate, account) => {
    const url =
        `https://a.klaviyo.com/api/campaigns?filter=equals(messages.channel,'${channel}')${startDate}${endDate}&include=tags`
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`,
                accept: "application/json",
                revision: "2024-10-15",
            },
        })
        return response.data.data.map((campaign) => {
            const campaignTags = response.data.included
                .filter(
                    (item) =>
                        item.type === "tag" &&
                        campaign.relationships.tags.data.some(
                            (tag) => tag.id === item.id
                        )
                )
                .map((tag) => tag.attributes.name)

            return {
                id: campaign.id,
                name: campaign.attributes.name,
                status: campaign.attributes.status,
                send_time: campaign.attributes.send_time,
                scheduled_at: campaign.attributes.scheduled_at,
                accountName: account.name,
                klaviyoPublic: account.klaviyoPublic,
                tags: campaignTags,
                type: "campaign"
            }
        })
    } catch (error) {
        console.error(
            `Error fetching campaigns for account ${account.name}: `,
            error.response?.data || error.message
        )
        return [] // Return an empty array if there's an error for this account
    }
}

export const createUniversalContent = async (pk, access_token, ucName, html) => {
    const url = `https://a.klaviyo.com/api/template-universal-content`
    const headers = {
        accept: "application/json",
        revision: "2024-10-15",
        Authorization: pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`
    }
    const payload = {
        "data": {
            "type": "template-universal-content", "attributes": {
                "definition": {
                    "content_type": "block", "type": "html", "data": {
                        "display_options": { "show_on": "all" },
                        "content": html
                    }
                }, "name": ucName
            }
        }
    }
    const response = await axios.post(url, payload, { headers })
    return response.data.data.id
}

export const patchUniversalContent = async (pk, access_token, id, html) => {
    const url = `https://a.klaviyo.com/api/template-universal-content/${id}`
    const headers = {
        accept: "application/json",
        revision: "2024-10-15",
        Authorization: pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`
    }
    const payload = { "data": { "type": "template-universal-content", "attributes": { "definition": { "content_type": "block", "type": "html", "data": { "display_options": { "show_on": "all" }, "content": html } } }, "id": id } }
    try {
        const response = await axios.patch(url, payload, { headers })
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }

}

export const createTestFlow = async (pk, access_token, metricId, templateId, default_sender_email, default_sender_name) => {
    const url = `https://a.klaviyo.com/api/flows`
    const headers = {
        accept: "application/json",
        revision: "2024-10-15.pre",
        Authorization: pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`
    }
    const flowData = {
        "data": {
            "type": "flow",
            "temporary_id": "abc123",
            "attributes": {
                "name": "Khub Send",
                "definition": {
                    "triggers": [
                        {
                            "type": "metric",
                            "id": metricId,
                            "trigger_filter": null
                        }
                    ],
                    "profile_filter": null,
                    "actions": [
                        {
                            "temporary_id": "12345678",
                            "type": "send-email",
                            "links": {
                                "next": null
                            },
                            "data": {
                                "message": {
                                    "from_email": default_sender_email,
                                    "from_label": default_sender_name,
                                    "reply_to_email": null,
                                    "cc_email": null,
                                    "bcc_email": null,
                                    "subject_line": "Test Send",
                                    "preview_text": "",
                                    "template_id": templateId,
                                    "smart_sending_enabled": false,
                                    "transactional": false,
                                    "add_tracking_params": false,
                                    "custom_tracking_params": null,
                                    "additional_filters": null,
                                    "name": "Khub Send Test Email Flow"
                                },
                                "status": "live"
                            }
                        }
                    ],
                    "entry_action_id": "12345678"
                }
            }
        }
    }
    try {
        await axios.post(url, flowData, { headers })
    } catch (error) {
        console.log(error)
    }
}

export const createClientEvent = async (klaviyoPublic, eventName, email, payload = {}, propertyPayload = {}) => {
    const url = `https://a.klaviyo.com/client/events?company_id=${klaviyoPublic}`;
    const headers = { revision: "2024-06-15", "Content-Type": "application/json" }
    const data = {
        "data": {
            "type": "event",
            "attributes": {
                "properties": payload,
                "metric": {
                    "data": {
                        "type": "metric",
                        "attributes": {
                            "name": eventName
                        }
                    }
                },
                "profile": {
                    "data": {
                        "type": "profile",
                        "attributes": {
                            "email": email
                        },
                        "properties": propertyPayload
                    }
                }
            }
        }
    }

    try {
        await axios.post(url, data, { headers })
    } catch (error) {
        console.error('Error creating event:', error.message);
    }
};

export const patchTemplate = async (pk, access_token, id, html, text) => {
    console.log(pk)
    console.log(id)
    console.log(html)
    console.log(text)

    const url = `https://a.klaviyo.com/api/templates/${id}`
    const payload = { "data": { "type": "template", "attributes": { "html": html, "text": text }, "id": id } }
    const headers = {
        accept: 'application/json',
        revision: '2024-10-15',
        'content-type': 'application/json',
        Authorization: pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`
    }
    console.log("POST!")
    await axios.patch(url, payload, { headers })
    console.log("DONE!")
    return true
}

export const getMetricId = async (apiKey, access_token, name) => {
    const url = `https://a.klaviyo.com/api/metrics`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Klaviyo-API-Key ${apiKey}`,
                revision: "2024-06-15"
            },
        });

        const testMetric = response.data.data.find(metric => metric.attributes.name === name)
        return testMetric.id; // The response data will include metric IDs and other details

    } catch (error) {
        console.error('Error fetching metric IDs:', error.message);
        return null;
    }
};


export const createTemplate = async (pk, access_token, name, template, text) => {
    const url = 'https://a.klaviyo.com/api/templates';

    const data = {
        data: {
            type: "template",
            attributes: {
                name,
                editor_type: "CODE",
                html: template,
                text: text
            }
        }
    };

    try {
        const response = await axios.post(
            url, data, {
            headers: {
                revision: '2024-10-15',
                'content-type': 'application/json',
                'Authorization': pk ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}`
            }
        });

        return response.data.data.id
    } catch (error) {
        console.error('Error creating template:', error);
    }
}