// this is used to get Lists, Segments, and Campaigns from Klaviyo

import { getKlaviyoAPI } from 'services/server-library'
import { onlyAuthUser } from "services/server-library";
const Bottleneck = require('bottleneck');



export default async function handler(req, res) {
    const { klavyioPublic, url } = req.query
    const isAuthenticated = await onlyAuthUser(req, res, klavyioPublic);
    if (!isAuthenticated) {
        console.log("not authenticated!!")
        // If onlyAuthUser returns false, it means authentication failed
        // and it has already handled the response, so we stop further execution.
        return;
    }

    console.log(req.account)
    const api_key = req.account.access_token
    const segmentUrl = 'https://a.klaviyo.com/api/segments/?fields[segment]=name'

    if (api_key) {
        // Create a new limiter that allows up to 75 calls per second
        const limiter = new Bottleneck({
            maxConcurrent: 1,  // Adjust based on how many concurrent requests you want to allow
            minTime: 1000 / 75  // Minimum time between each task in milliseconds
        });
        const limitedGetApi = limiter.wrap(getKlaviyoAPI);
        const segmentResponse = await limitedGetApi(api_key, segmentUrl, 1, req.account.refresh_token, req.account.uid)
        console.log(segmentResponse)
        const finalResponse = segmentResponse.map(segment => ({
            value: segment.id,
            label: segment.attributes.name
        }));
        res.status(200).json({ data: finalResponse })

    } else {
        res.status(200).json({ data: [] })
    }


}