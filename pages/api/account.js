import User from "models/user"
import { onlyAuthUser, returnUserAccountsOnly } from "services/server-library";
import connect from "services/db";
import axios from "axios";
import { createClientEvent, getMetricId, createTestFlow, createUniversalContent, createTemplate, getKlaviyoAccount, fetchMetrics } from 'services/klaviyoAPI'
import { updateKlaviyoAuth } from 'services/server-library'

export default async function handler(req, res) {

    await connect()    // Check if the user is authenticated before proceeding
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        console.log("NOT AUTHENTICATED")
        return;
    }
    const userId = req.user.id

    if (req.method === 'POST') {
        try {
            console.log("THIS IS HIT")
            const { pkKey, accessToken, name } = req.body

            if (pkKey || accessToken) {
                const { klaviyoPublic, default_sender_name, default_sender_email } = await getKlaviyoAccount(pkKey)


                if (!klaviyoPublic) {
                    return res.status(401).json({
                        success: false,
                        message: 'Could not retrieve public API key from account'
                    });
                }

                await createClientEvent(klaviyoPublic, "kayloyal Test Send", "test@kayloyal.com")
                const testMetricId = await getMetricId(pkKey, null, "kayloyal Test Send")
                const testUniversalContentId = await createUniversalContent(pkKey, null, "kayloyal Test Send", "<p>test content</p>")
                const templateId = await createTemplate(pkKey, null, "kayloyal Test Send", "{{event.html|safe}}", "")
                await createTestFlow(pkKey, null, testMetricId, templateId, default_sender_email, default_sender_name)

                // Find the user and push the new account to their accounts array
                const user = await User.findById(userId)
                console.log(user)
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }
                const metrics = ["Clicked Email", "Opened Email", "Subscribed to Email Marketing", "Subscribed to SMS Marketing", "Received SMS", "Clicked SMS", "Received Email", "Unsubscribed from SMS Marketing", "Unsubscribed from Email Marketing"];
                const metricResults = await fetchMetrics(pkKey, null, metrics);
                await updateKlaviyoAuth(user, name, pkKey, null, klaviyoPublic, default_sender_name, default_sender_email, metricResults, testUniversalContentId, testMetricId, templateId)

                // Return the updated user accounts
                const filteredAccounts = await returnUserAccountsOnly(user);
                res.status(200).json({ success: true, accounts: filteredAccounts.accounts });


            } else {
                const user = await User.findByIdAndUpdate(
                    userId,
                    { lastAccountName: req.body.name, lastKlaviyoVerifier: req.body.klaviyoVerification }
                );
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                }

                res.status(200).json({ success: true, userId });
            }


        } catch (error) {
            console.log(error.message)
            res.status(400).json({ success: false, message: 'Not a valid PK Key. Please check your permissions in Klaviyo.' });
        }
    } else if (req.method === 'GET') {
        try {
            const klaviyoPublic = req.query.klaviyoPublic; // Get the uid from the query parameter

            // Find the user and specifically the account with the given uid
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Find the specific account in the accounts array
            const account = user.accounts.find(account => account.klaviyoPublic === klaviyoPublic);
            if (!account) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }
            console.log(account)
            // Return the found account
            return res.status(200).json({ success: true, account: account });
        } catch (error) {
            console.log("TEST")
            res.status(400).json({ success: false, message: error.message });
        }
    } else if (req.method === 'PATCH') {
        const klaviyoPublic = req.query.klaviyoPublic;
        const { name, conversion, default_sender_name, default_sender_email, inclusionAudience, exclusionAudience, timezone, conversionMetric, tags } = req.body;
        const user = req.user
        try {
            // Find the account in the user's accounts array by klaviyoPublic
            const accountIndex = user.accounts.findIndex(acc => acc.klaviyoPublic === klaviyoPublic);

            if (accountIndex === -1) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }
            console.log(timezone)
            // Update the arrays directly
            user.accounts[accountIndex].name = name;
            user.accounts[accountIndex].conversion = conversion;
            user.accounts[accountIndex].default_sender_name = default_sender_name;
            user.accounts[accountIndex].default_sender_email = default_sender_email;
            user.accounts[accountIndex].inclusionAudience = inclusionAudience;
            user.accounts[accountIndex].exclusionAudience = exclusionAudience;
            user.accounts[accountIndex].timezone = timezone;
            user.accounts[accountIndex].conversionMetric = conversionMetric
            user.accounts[accountIndex].tags = tags

            // Mark the specific elements of the array as modified
            user.markModified(`accounts.${accountIndex}`);

            await user.save();

            const filteredAccounts = await returnUserAccountsOnly(user)
            return res.status(200).json({ accounts: filteredAccounts.accounts, message: 'Account updated successfully' });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: 'Error updating account', error: error.message });
        }
    } else if (req.method === 'DELETE') {
        const { idx } = req.query; // Get the klaviyoPublic from the query parameter

        try {
            // Create the update path using the index
            const updatePath = `accounts.${idx}`;

            // First, set the element at the specified index to null
            const unsetResult = await User.updateOne(
                { _id: req.user.id },
                { $unset: { [updatePath]: 1 } }
            );

            // Then, remove all null elements from the array
            const pullResult = await User.updateOne(
                { _id: req.user.id },
                { $pull: { accounts: null } }
            );

            if (unsetResult.modifiedCount === 0 && pullResult.modifiedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No account found at the specified index'
                });
            }

            // Get the updated user data
            const updatedUser = await User.findById(req.user.id);
            const filteredAccounts = await returnUserAccountsOnly(updatedUser);

            return res.status(200).json({
                success: true,
                message: 'Account removed successfully',
                accounts: filteredAccounts.accounts
            });
        } catch (error) {
            console.error('Error removing account:', error);
            return res.status(500).json({ success: false, message: 'Error removing account', error: error.message });
        }

    }
    else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST', 'GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // update the account

}






