require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.post('/subscribe', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log(amount);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: amount,
                        product_data: {
                            name: 'Subscription',
                            description: 'Subscription for the product',
                        },
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 7, // Add this line for a 14-day trial period
            },
            success_url: 'https://gptbot-4j8.pages.dev/payment-success',
            cancel_url: 'https://gptbot-4j8.pages.dev/cancel',
        });
        res.json({ id: session.id });
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
