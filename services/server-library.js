import User from 'models/user';
import axios from 'axios';
import connect from "services/db";
import jwt from 'jsonwebtoken';
import S3 from 'aws-sdk/clients/s3.js';
import Pass from 'models/pass'  // Add this import
import Plan from 'models/plan'
import { parse } from 'cookie';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_', 24);
const s3 = new S3({
    endpoint: `https://${process.env.CLOUDFLARE_ID}.r2.cloudflarestorage.com`,
    accessKeyId: `${process.env.CLOUDFLARE_ACCESS_KEY}`,
    secretAccessKey: `${process.env.CLOUDFLARE_SECRET_KEY}`,
    signatureVersion: 'v4',
});

export const updateKlaviyoAuth = async (user, name, pk, tokenData, klaviyoPublic, default_sender_name, default_sender_email, metricResults, testUniversalContentId, testMetricId, templateId) => {

    // Create a new account object and add it to the accounts array
    const account = {
        name: name,
        klaviyoPublic: klaviyoPublic,
        conversion: 1,
        timezone: "America/New_York",
        default_sender_name: default_sender_name,
        default_sender_email: default_sender_email,
        inclusionAudience: [],
        exclusionAudience: [],
        tags: [],
        metrics: metricResults,
        testUniversalContentId: testUniversalContentId,
        testMetricId: testMetricId,
        templateId: templateId,
        ...(pk && { pk: pk })  // Conditionally spread pk if it exists
    };
    // Add token data if it exists
    if (tokenData) {
        const { access_token, refresh_token, expires_in, scope } = tokenData;
        Object.assign(account, {
            access_token,
            refresh_token,
            expires_in,
            scope
        });
    }


    user.accounts.push(account);

    // Save the user document
    try {
        await user.save();
        return { success: true, message: 'Account updated successfully' };
    } catch (error) {
        throw new Error(error.message)
    };
}


export async function refreshAccessToken(refreshToken, klaviyoPublic, userId) {
    const tokenEndpoint = 'https://a.klaviyo.com/oauth/token';
    const credentials = Buffer.from(`${process.env.NEXT_PUBLIC_KLAVIYO_APP_CLIENT_ID}:${process.env.KLAVIYO_APP_CLIENT_SECRET}`).toString('base64');
    const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    try {
        const response = await axios.post(tokenEndpoint, params, { headers });
        await saveNewAccessToken(response.data.access_token, klaviyoPublic, userId)
        return response.data;  // This should include access_token, refresh_token, expires_in, etc.
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw new Error('Failed to refresh access token');
    }
}

export async function saveNewAccessToken(newToken, klaviyoPublic, userId) {
    try {
        // Find the user and update the specific account's access token
        const updateResult = await User.updateOne(
            { _id: userId, "accounts.klaviyoPublic": klaviyoPublic },
            { $set: { "accounts.$.access_token": newToken } }
        );
        if (updateResult.matchedCount === 0) {
            console.error('No user found with the specified userId and klaviyoPublic');
            throw new Error('User not found or account not found');
        }
        return updateResult;
    } catch (error) {
        console.error('Failed to update accessToken:', error);
    }
}


export const getKlaviyoAPI = async (apiKey, url, maxRetries = 1, refreshToken, klaviyoPublic, userId) => {
    let currentToken = apiKey;
    let attempt = 0;
    let result = []
    let nextUrl = url

    while (nextUrl && attempt <= maxRetries) {
        try {
            const response = await axios.get(nextUrl, {
                headers: {
                    'Authorization': process.env.NEXT_PUBLIC_ENV ? `Klaviyo-API-Key ${currentToken}` : `Bearer ${currentToken}`,
                    'accept': 'application/json',
                    'revision': '2024-07-15'
                }
            });
            result = [...result, ...response.data.data]
            nextUrl = response.data.links.next
        } catch (error) {
            if (error.response && error.response.status === 401 && attempt < maxRetries && refreshToken) {
                // Token might be expired, try to refresh it
                const newTokens = await refreshAccessToken(refreshToken, klaviyoPublic, userId);
                currentToken = newTokens.access_token;  // Update the token
                attempt++;  // Increment the attempt counter
            } else {
                console.log("ERROR", error.message)
            }
        }
    }
    return result
}



//this is used for API
export const onlyAuthUser = async (req, res, passId = null) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log("NO TOKEN")
        return res.status(401).json({ error: "No token provided" });
    }
    const decodedToken = parseToken(token);
    if (!decodedToken) {
        console.log("INVALID TOKEN")
        return res.status(403).json({ error: "Invalid token" });
    }

    try {
        await connect();

        // If planId is provided, populate just that specific plan
        const query = passId ?
            User.findById(decodedToken.userId).populate({
                path: 'pass',
                match: { _id: passId }
            }) :
            User.findById(decodedToken.userId);

        const tokenUser = await query;

        if (!tokenUser) {
            console.log("USER NOT FOUND")
            return res.status(404).json({ error: "User not found" });
        }
        if (!tokenUser.isVerified) {
            console.log("USER NOT VERIFIED")
            return res.status(404).json({ error: "Verify your account first!" });
        }

        // If planId was provided, check if it was found in the populated plans
        if (planId) {
            console.log("Checking plan access:", planId)

            const plan = tokenUser.plans[0]; // Will be undefined if plan wasn't found
            if (!plan) {
                console.log("PLAN ACCESS DENIED")
                return res.status(403).json({ error: "No access to this plan" });
            }

            // Set both user and plan in req object
            req.user = tokenUser;
            req.plan = plan;
            console.log("Plan access granted:", plan.name)

        } else {
            // If no planId, just set the user
            req.user = tokenUser;
        }

        return true;
    } catch (error) {
        console.error("Error in onlyAuthUser:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// this is used for SSR
export const onlyAuthUserSSR = async (req, populatePath = null, populateId = null) => {
    await connect();
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.kayloyal_jwt || null;


    try {
        let user
        const decoded = parseToken(token, true);

        if (populatePath) {
            // Create populate options object
            console.log("POPULATE PATH", populatePath)
            console.log("POPULATE ID", populateId)

            const populateOptions = {
                path: populatePath,
                select: 'name uid cardType images status createdAt planName'
            }

            // Only add match if populatePassId exists
            if (populateId) {
                populateOptions.match = { _id: populateId }
            }
            console.log("FIND!!!")
            // Get user with or without specific pass
            user = await User.findOne({ _id: decoded.userId })
                .populate(populateOptions)
                .lean()
            console.log(user)
        } else {
            user = await User.findOne({ _id: decoded.userId })
        }

        if (!user) {
            return null;
        }

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

// Helper Method to Parse Token
export function parseToken(token, isSSR = false) {
    let actualToken = token;
    try {
        // Assuming the token format is "Bearer <token>", split and take the second part
        if (!isSSR) {
            actualToken = token.split(" ")[1];
        }
        const decoded = jwt.verify(actualToken, process.env.JWT_TOKEN_KEY);
        return decoded;
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return null;
    }
}

export const fileUploadCloudFlare = async (data, path = 'images') => {
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const imageUrl = `${path}/logo-${nanoid()}.png`;
    try {
        const data = await s3.upload({
            Bucket: "kaypush",
            Key: imageUrl,
            Body: buffer,
            ContentType: 'image/png'
        }).promise();
        return (`https://cdn.kaypush.com/${imageUrl}`)
    } catch (error) {
        throw error
    }
}

export const uploadJsonFileCloudFlare = async (jsonData, uid, path = 'accounts') => {
    const url = `${path}/${uid}.json`
    const params = {
        Bucket: "kaypush",
        Key: url,
        Body: JSON.stringify(jsonData),
        ContentType: 'application/json'
    };

    try {
        await s3.upload(params).promise();
        console.log('File uploaded successfully');
        return url
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};


export const updateCloudFlareCache = async (fileUrl) => {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const apiToken = process.env.CLOUDFLARE_PURGE_KEY;
    const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;

    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };

    const data = {
        files: [fileUrl],
    };

    try {
        const response = await axios.post(apiUrl, data, { headers });
        console.log('Cache purged successfully:', response.data);
    } catch (error) {
        console.error('Error purging cache:', error);
    }
};

export const updateJsonFileCloudFlare = async (uid, newJson) => {
    let originalJSON = {};
    try {
        const response = await axios.get(`https://cdn.kaypush.com/accounts/${uid}.json`);
        originalJSON = response.data;
    } catch (fetchError) {
        console.error('Error fetching original JSON:', fetchError.message);
    }
    const updatedJSON = { ...originalJSON, ...newJson };
    const updateUrl = await uploadJsonFileCloudFlare(updatedJSON, uid)
    await updateCloudFlareCache(`https://cdn.kaypush.com/${updateUrl}`)

}
