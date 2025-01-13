import Stripe from 'stripe';
import axios from 'axios';
import { onlyAuthUser } from "services/server-library";
import connect from 'services/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    if (req.method === 'POST') {
        await connect()    // Check if the user is authenticated before proceeding
        const isAuthenticated = await onlyAuthUser(req, res);
        if (!isAuthenticated) {
            console.log("NOT AUTHENTICATED")
            return;
        }
        const { billingCycle, quantity } = req.body;
        const user = req.user

        // Check if billingCycle or numAccounts is not provided
        if (!billingCycle || !quantity) {
            return res.status(400).json({
                error: "Missing required parameters: 'billingCycle' and/or 'numAccounts'"
            });
        }

        const planPrice = billingCycle === "annual" ? process.env.STRIPE_ANNUAL_PLAN : process.env.STRIPE_MONTHLY_PLAN
        try {

            const sessionConfig = {
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: planPrice, // Regular subscription price ID
                        quantity
                    }
                ],
                mode: 'subscription',
                success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/payment`,
                metadata: {
                    userId: user.id, // Include userId in the metadata
                    billingCycle,
                    quantity
                },
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);
            res.status(200).json({ sessionId: session.id });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}