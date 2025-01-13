
import Stripe from 'stripe';
import { onlyAuthUserSSR } from 'services/server-library';
import User from 'models/user';
import axios from 'axios';
import connect from 'services/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function GET(req, res) {
    await connect();

    let userId = req.query.id
    let user = null
    if (!userId) {
        user = await onlyAuthUserSSR(req, true, true)
    } else {
        user = await User.findById(userId);
    }
    if (!user) {
        return res.status(500).json({ message: 'User ID is required' });
    }
    try {
        // get Total Tokens
        const tokens = await fetchUserTokens(user.accounts);
        const totalTokens = calculateTotalTokens(tokens);

        const price = await stripe.prices.retrieve(process.env.STRIPE_PRO_PLAN, {
            expand: ['product', 'tiers']
        });

        const tiers = price.tiers || [];
        let { monthPrice, upTo } = getFlatAmountForTokens(tiers, totalTokens);
        // If upTo is null (maximum tier), set it to totalTokens
        if (upTo === null) {
            upTo = totalTokens;
        }

        // Calculate monthlySendCap (assuming it's 10 times the 'upTo' value)
        const monthlySendCap = upTo * 10;

        //get Total Sends
        const { totalMonthSends, dailySummary } = await getUserSendsForMonth(user.stripeId);
        const monthSendsLeft = monthlySendCap - totalMonthSends

        const activeAccounts = await user.accounts.filter(account => account.isActive);
        const totalActiveAccounts = activeAccounts.length;

        // Calculate overage
        const overageSends = totalMonthSends > monthlySendCap ? totalMonthSends - monthlySendCap : 0;

        return res.status(200).json({ success: true, data: { plan: user.paymentPlan, tokens, totalTokens, totalMonthSends, totalActiveAccounts, monthPrice, upTo, monthlySendCap, monthSendsLeft, overageSends } });
    } catch (error) {
        console.error('Error fetching price:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// This function should be implemented to fetch the user's subscription from your database
async function fetchUserTokens(accounts) {
    const uids = accounts.map(account => account.uid).join(',');
    const url = `${process.env.NEXT_PUBLIC_WEBPUSH_SERVER_URL}/getTokenCount?uids=${uids}`;
    const response = await axios.get(url);
    if (!response.status == 200) throw new Error('Failed to fetch token count');
    const tokensCounts = await response.data;
    return tokensCounts;
}

function getFlatAmountForTokens(tiers, totalTokens) {
    for (const tier of tiers) {
        if (totalTokens <= tier.up_to || tier.up_to === null) {
            return { monthPrice: tier.flat_amount, upTo: tier.up_to };
        }
    }

    const lastTier = tiers[tiers.length - 1];
    return { monthPrice: lastTier.flat_amount, upTo: lastTier.up_to };
}

async function getUserSendsForMonth(stripeId) {
    const now = new Date();
    const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
    const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 0, 0, 0, 0));

    try {
        const response = await axios.get(
            `https://api.stripe.com/v1/billing/meters/${process.env.STRIPE_METER_ID}/event_summaries`,
            {
                params: {
                    customer: stripeId,
                    start_time: Math.floor(firstDayOfMonth.getTime() / 1000),
                    end_time: Math.floor(lastDayOfMonth.getTime() / 1000),
                    value_grouping_window: 'day'
                },
                headers: {
                    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
                }
            }
        );

        const events = response.data;
        const totalMonthSends = events.data.reduce((sum, event) => sum + event.aggregated_value, 0);
        return { totalMonthSends, dailySummary: events.data };
    } catch (error) {

        console.error('Error fetching meter events:', error.response ? error.response.data : error.message);
        throw error;
    }
}

function calculateTotalTokens(tokens) {
    return tokens.reduce((sum, token) => sum + token.total, 0);
}