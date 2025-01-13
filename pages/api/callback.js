// pages/api/callback.js

import User from "models/user";
import connect from "services/db";
import { createClientEvent, getMetricId, createTestFlow, createUniversalContent, createTemplate, fetchMetrics, getKlaviyoAccount } from 'services/klaviyoAPI'
import { updateKlaviyoAuth } from 'services/server-library'

export default async function handler(req, res) {
    const { code, state, error, error_description } = req.query;

    // Check if there was an error in the authorization process
    if (error) {
        console.error('Authorization error:', error_description);
        // Redirect to an error page or handle the error appropriately
        return res.redirect(`/error?message=${error_description}`);
    }

    // If no error, proceed to exchange the code for an access token
    if (code && state) {
        try {
            const uid = state

            await connect()
            const user = await User.findById(uid);
            const verification = user.lastKlaviyoVerifier
            const name = user.lastAccountName

            if (!user) {
                throw new Error('User not found or update failed');
            }


            // Create a base64 encoded string from client_id and client_secret
            const clientId = process.env.NEXT_PUBLIC_KLAVIYO_APP_CLIENT_ID;
            const clientSecret = process.env.KLAVIYO_APP_CLIENT_SECRET;
            const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            const authorizationHeader = `Basic ${credentials}`;
            // Convert the JSON object to a URL-encoded string
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('redirect_uri', process.env.NEXT_PUBLIC_ENV === "DEV" ? 'http://localhost:3000/api/callback' : 'https://kaypush.com/api/callback');
            params.append('code_verifier', verification)

            const tokenResponse = await fetch('https://www.klaviyo.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authorizationHeader
                },
                body: params
            });

            const data = await tokenResponse.json();
            const { klaviyoPublic, default_sender_name, default_sender_email } = await getKlaviyoAccount(null, data.access_token)

            const accountExists = await checkIfAccountExists(user, klaviyoPublic)
            if (accountExists) {
                return res.redirect('/account-settings?error=Klaviyo account already exists');
            } else {


                await createClientEvent(klaviyoPublic, "kayloyal Test Send", "test@kayloyal.com")
                const testMetricId = await getMetricId(null, data.access_token, "kayloyal Test Send")
                const testUniversalContentId = await createUniversalContent(null, data.access_token, "kayloyal Test Send", "<p>test content</p>")
                const templateId = await createTemplate(null, data.access_token, "kayloyal Test Send", "{{event.html|safe}}", "")
                await createTestFlow(null, data.access_token, testMetricId, templateId, default_sender_email, default_sender_name)

                const metrics = ["Clicked Email", "Opened Email", "Subscribed to Email Marketing", "Subscribed to SMS Marketing", "Received SMS", "Clicked SMS", "Received Email", "Unsubscribed from SMS Marketing", "Unsubscribed from Email Marketing"];
                try {
                    const metricResults = await fetchMetrics(null, data.access_token || null, metrics);
                    await updateKlaviyoAuth(user, name, null, data, klaviyoPublic, default_sender_name, default_sender_email, metricResults, testUniversalContentId, testMetricId, templateId)

                    return res.redirect(`/account-settings?name=${name}&klaviyoPublic=${klaviyoPublic}`);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to retrieve metrics' });
                }

            }


        } catch (error) {
            console.error('Failed to exchange token:', error);
            return res.redirect(`/error?message=Failed to exchange token`);
        }
    }

    // If no code and no error, unexpected state
    return res.status(400).json({ error: 'Unexpected state' });
}

const checkIfAccountExists = async (user, klaviyoPublic) => {
    // Find the account in the user's accounts array using the klaviyoPublic key
    const account = user.accounts.find(acc => acc.klaviyoPublic === klaviyoPublic);

    if (account) {
        return true;
    } else {
        return false;
    }
}





