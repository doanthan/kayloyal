import { buffer } from 'micro';
import Stripe from 'stripe';
import connect from 'services/db';
import User from 'models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                await handlePaymentSucceeded(invoice);
                break;
            case 'checkout.session.completed':
                const session = event.data.object;
                // Update the user's profile
                await handleCheckoutSessionCompleted(session);
                break;
            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                // Handle the payment failure
                await handlePaymentFailure(failedInvoice);
                break;
            case 'customer.subscription.updated':
                const subscriptionUpdated = event.data.object;
                await handleSubscriptionUpdated(subscriptionUpdated);
                break;
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                await handleSubscriptionCancellation(subscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

async function handlePaymentSucceeded(invoice) {
    await connect();
    console.log("PAYMENT SUCCESEED")
    console.log(invoice)
    const stripeId = invoice.customer;

    const user = await User.findOne({ stripeId });

    if (user) {
        user.lastStripePaymentDate = new Date(invoice.created * 1000); // Stripe timestamps are in seconds
        user.nextPayDate = new Date(invoice.next_payment_attempt * 1000);
        await user.save();
    } else {
        console.error('User not found');
    }
}

async function handleSubscriptionCancellation(subscription) {
    await connect();
    console.log('Subscription cancelled:', subscription.id);
    const user = await User.findOne({ stripeId: subscription.customer });
    if (user) {
        user.paymentPlan = "Free";
        await user.save();
    }
}

async function handleCheckoutSessionCompleted(session) {
    await connect();

    console.log(session)
    const user = await User.findById({ _id: session.metadata.userId });

    if (user) {
        // Update the user's plan field
        user.paymentPlan = session.metadata.billingCycle
        user.stripeSubscription = session.subscription
        user.stripeId = session.customer
        const quantityToAdd = parseInt(session.metadata.quantity, 10);
        user.numberOfAccounts = user.numberOfAccounts + quantityToAdd;
        await user.save();
    } else {
        console.error('User not found');
    }
}

async function handlePaymentFailure(invoice) {
    await connect();
    // Access userId from the invoice metadata
    const stripeId = invoice.customer;

    const user = await User.findOne({ stripeId });

    if (user) {
        // Update the user's paymentPlan field to "Suspended"
        user.paymentPlan = "Suspended";
        await user.save();
    } else {
        console.error('User not found');
    }
}

async function handleSubscriptionUpdated(subscription) {
    await connect();
    console.log(subscription)
    // Access userId from the subscription metadata
    const stripeId = subscription.customer;

    // Find the user by their userId (assuming userId is stored as a string)


}