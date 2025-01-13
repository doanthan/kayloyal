import Stripe from 'stripe';
import connect from 'services/db';
import { onlyAuthUser } from "services/server-library";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await connect()    // Check if the user is authenticated before proceeding
        const isAuthenticated = await onlyAuthUser(req, res);
        if (!isAuthenticated) {
            console.log("NOT AUTHENTICATED")
            return;
        }
        const stripeId = req.user.stripeId
        console.log(stripeId)
        try {
            const { returnUrl } = req.body;

            // Create the portal session
            const session = await stripe.billingPortal.sessions.create({
                customer: stripeId,
                return_url: returnUrl
            });

            // Respond with the URL to the portal session
            res.status(200).json({ url: session.url });
        } catch (error) {
            console.error('Error creating Stripe portal session:', error);
            res.status(500).json({ error: 'Failed to create portal session' });
        }
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}