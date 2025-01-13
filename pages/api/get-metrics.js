import { getKlaviyoAPI } from 'services/server-library'
import { onlyAuthUser } from "services/server-library";
const Bottleneck = require('bottleneck');

export default async function handler(req, res) {
    const klavyioPublic = req.query.klavyioPublic
    console.log(klavyioPublic)
    const isAuthenticated = await onlyAuthUser(req, res, klavyioPublic);
    if (!isAuthenticated) {
        console.log("not authenticated!!")
        return;
    }

    console.log(req.account)
    const api_key = req.account.access_token
    const listUrl = 'https://a.klaviyo.com/api/metrics/?fields[list]=name'
    console.log(listUrl)
    if (api_key) {
        // Create a new limiter that allows up to 75 calls per second
        const limiter = new Bottleneck({
            maxConcurrent: 1,  // Adjust based on how many concurrent requests you want to allow
            minTime: 1000 / 75  // Minimum time between each task in milliseconds
        });
        const limitedGetApi = limiter.wrap(getKlaviyoAPI);
        console.log("HERE")
        const response = await limitedGetApi(api_key, listUrl, 1, req.account.refresh_token, req.account.uid)
        console.log(response)
        const finalResponse = response.map(list => ({
            value: list.id,
            label: list.attributes.name
        }));
        res.status(200).json({ data: finalResponse })

    } else {
        res.status(200).json({ data: [] })
    }


}