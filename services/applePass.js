import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs/promises';

// Separate initialization function
async function initializeTemplate() {
    try {
        const template = new Template('storeCard', {
            passTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER,
            teamIdentifier: process.env.APPLE_TEAM_IDENTIFIER,
            organizationName: process.env.ORGANIZATION_NAME,
            description: 'Loyalty Card',
        });

        // Load certificates
        const wwdr = await fs.readFile(path.join(process.cwd(), 'certificates/wwdr.pem'));
        const signerCert = await fs.readFile(path.join(process.cwd(), 'certificates/signerCert.pem'));
        const signerKey = await fs.readFile(path.join(process.cwd(), 'certificates/signerKey.pem'));

        // Set certificates
        await template.loadCertificate(signerCert, signerKey);
        await template.loadWWDR(wwdr);

        // Load default images
        await template.images.add('icon', path.join(process.cwd(), 'assets/icon.png'));
        await template.images.add('logo', path.join(process.cwd(), 'assets/logo.png'));

        return template;
    } catch (error) {
        console.error('Failed to initialize Apple Pass template:', error);
        throw new Error('Pass template initialization failed');
    }
}

// Main pass generation function
export async function generateApplePass(passData) {
    try {
        const template = await initializeTemplate();

        // Create new pass from template
        const pass = template.createPass({
            // Barcode
            barcodes: [{
                message: passData.uid,
                format: 'PKBarcodeFormatQR',
                messageEncoding: 'iso-8859-1',
                altText: passData.uid
            }],

            // Colors
            backgroundColor: passData.backgroundColor || 'rgb(60, 65, 76)',
            foregroundColor: passData.foregroundColor || 'rgb(255, 255, 255)',
            labelColor: passData.labelColor || 'rgb(255, 255, 255)',

            // Store Card specific settings
            storeCard: {
                primaryFields: [
                    {
                        key: 'balance',
                        label: 'Points Balance',
                        value: passData.points || 0
                    }
                ],
                auxiliaryFields: [
                    {
                        key: 'tier',
                        label: 'Member Tier',
                        value: passData.tier || 'Standard'
                    }
                ],
                backFields: [
                    {
                        key: 'terms',
                        label: 'Terms and Conditions',
                        value: passData.terms || 'Standard terms apply'
                    }
                ]
            },

            // Expiration
            expirationDate: passData.expiryDate,
            voided: !passData.isActive,
        });

        // Add custom images if provided
        if (passData.logo) {
            await pass.images.add('logo', passData.logo);
        }
        if (passData.icon) {
            await pass.images.add('icon', passData.icon);
        }

        // Generate and return pass
        const buffer = await pass.asBuffer();
        return buffer;

    } catch (error) {
        console.error('Failed to generate Apple Pass:', error);
        throw new Error('Pass generation failed');
    }
}

// Optional: Export update function
export async function updateApplePass(passData) {
    try {
        const updatedPass = await generateApplePass(passData);

        // Implement push notification logic here if needed
        if (passData.shouldNotify && passData.pushToken) {
            await sendPushNotification(passData.pushToken);
        }

        return updatedPass;
    } catch (error) {
        console.error('Failed to update Apple Pass:', error);
        throw new Error('Pass update failed');
    }
}

// Helper function for push notifications
async function sendPushNotification(pushToken) {
    // Implement Apple Push Notification Service (APNS) logic here
}

// Usage example:
/*
const passData = {
    uid: 'PASS_123',
    points: 100,
    tier: 'Gold',
    isActive: true,
    backgroundColor: 'rgb(60, 65, 76)',
    foregroundColor: 'rgb(255, 255, 255)',
    labelColor: 'rgb(255, 255, 255)',
    terms: "Terms and conditions apply..."
};

const buffer = await generateApplePass(passData);
*/
