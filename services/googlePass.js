import { GoogleAuth } from 'google-auth-library';
import { JWT } from 'google-auth-library';

// Initialize Google credentials
const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Configure JWT client
const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
});

async function generateGooglePassUrl(pass) {
    try {
        // 1. Create pass object
        const loyaltyObject = {
            id: `${process.env.GOOGLE_ISSUER_ID}.${pass.uid}`,
            classId: `${process.env.GOOGLE_ISSUER_ID}.loyalty_class`,
            state: 'ACTIVE',
            heroImage: {
                sourceUri: {
                    uri: pass.heroImage || process.env.DEFAULT_HERO_IMAGE,
                },
            },
            textModulesData: [
                {
                    header: "Points Balance",
                    body: `${pass.points || 0} points`,
                },
                {
                    header: "Member Since",
                    body: new Date(pass.createdAt).toLocaleDateString(),
                },
            ],
            linksModuleData: {
                uris: [
                    {
                        uri: `https://yourapp.com/member/${pass.uid}`,
                        description: "View Account",
                    },
                ],
            },
            imageModulesData: [
                {
                    mainImage: {
                        sourceUri: {
                            uri: pass.logo || process.env.DEFAULT_LOGO,
                        },
                    },
                },
            ],
            barcode: {
                type: 'QR_CODE',
                value: pass.uid,
                alternateText: pass.uid,
            },
            locations: pass.locations || [],
            accountId: pass.customerId,
            accountName: pass.customerName,
            loyaltyPoints: {
                label: 'Points',
                balance: {
                    string: String(pass.points || 0),
                },
            },
        };

        // 2. Create JWT claims
        const claims = {
            iss: credentials.client_email,
            aud: 'google',
            origins: ['https://yourapp.com'],
            typ: 'savetowallet',
            payload: {
                loyaltyObjects: [loyaltyObject],
            },
        };

        // 3. Sign JWT
        const token = await client.signJwt(claims);

        // 4. Generate save URL
        const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

        return saveUrl;

    } catch (error) {
        console.error('Google Pass URL Generation Error:', error);
        throw new Error('Failed to generate Google Pass URL');
    }
}

// Helper function to create class if it doesn't exist
async function createOrUpdateLoyaltyClass() {
    try {
        const loyaltyClass = {
            id: `${process.env.GOOGLE_ISSUER_ID}.loyalty_class`,
            issuerName: 'Your Company Name',
            programName: 'Loyalty Program',
            programLogo: {
                sourceUri: {
                    uri: process.env.PROGRAM_LOGO_URL,
                },
            },
            reviewStatus: 'UNDER_REVIEW',
            allowMultipleUsersPerObject: false,
            locations: [
                {
                    latitude: 37.424015499999996,
                    longitude: -122.09259560000001,
                },
            ],
        };

        const response = await fetch(
            `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${loyaltyClass.id}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await client.getAccessToken()}`,
                },
            }
        );

        if (response.status === 404) {
            // Create new class
            await fetch(
                'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${await client.getAccessToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loyaltyClass),
                }
            );
        }

        return true;
    } catch (error) {
        console.error('Error creating loyalty class:', error);
        throw error;
    }
}

// Usage example:
/*
const pass = {
    uid: 'PASS_123',
    points: 100,
    customerId: 'CUST_123',
    customerName: 'John Doe',
    createdAt: '2024-01-01',
    heroImage: 'https://example.com/hero.jpg',
    logo: 'https://example.com/logo.png',
    locations: [
        {
            latitude: 37.424015499999996,
            longitude: -122.09259560000001,
        }
    ]
};

const saveUrl = await generateGooglePassUrl(pass);
*/

export { generateGooglePassUrl, createOrUpdateLoyaltyClass };