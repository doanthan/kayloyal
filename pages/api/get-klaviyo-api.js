import { getKlaviyoAPI } from 'services/server-library'
import { onlyAuthUser } from "services/server-library";
const Bottleneck = require('bottleneck');


export default async function handler(req, res) {
    const { klaviyoPublic, type } = req.query
    console.log(klaviyoPublic)
    let url = ""
    switch (type) {
        case 'lists':
            url = 'https://a.klaviyo.com/api/lists/?fields[list]=name';
            break;
        case 'metrics':
            url = 'https://a.klaviyo.com/api/metrics/?fields[metric]=name';
            break;
        case 'segments':
            url = 'https://a.klaviyo.com/api/segments/?fields[segment]=name';
            break;
        default:
            url = '';
            break;
    }

    console.log(klaviyoPublic)
    const isAuthenticated = await onlyAuthUser(req, res, klaviyoPublic);
    if (!isAuthenticated) {
        console.log("not authenticated!!")
        return;
    }

    console.log(req.account)
    const api_key = process.env.NEXT_PUBLIC_ENV === "DEV" ? req.account.pk : req.account.access_token

    if (api_key) {
        // Create a new limiter that allows up to 75 calls per second
        const limiter = new Bottleneck({
            maxConcurrent: 1,  // Adjust based on how many concurrent requests you want to allow
            minTime: 1000 / 75  // Minimum time between each task in milliseconds
        });
        const limitedGetApi = limiter.wrap(getKlaviyoAPI);

        const response = await limitedGetApi(api_key, url, 1, req.account.refresh_token, klaviyoPublic, req.user._id)
        console.log(response)
        const finalResponse = response.map(result => ({
            value: result.id,
            label: result.attributes.name
        }));
        res.status(200).json({ data: finalResponse })

    } else {
        res.status(200).json({ data: [] })
    }


}