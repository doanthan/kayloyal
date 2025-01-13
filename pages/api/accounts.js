import User from "models/user"
import { onlyAuthUser } from "services/server-library";
import connect from "services/db";
export default async function handler(req, res) {

    await connect()    // Check if the user is authenticated before proceeding
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        console.log("NOT AUTHENTICATED")
        return;
    }

    if (req.method === 'GET') {
        try {
            return res.status(200).json({ success: true, accounts: req.user.accounts });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }


    else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // update the account

}


