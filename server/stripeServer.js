const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51RBiFTH6dDt990IEShjcNM0AgqwYx1UruNcckD5fLMf8pujNGPdEW1O6UNOSQmqDf8WMqtXFCcW1wuy0sMITO08200HHp5SqKt');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/payment', async (req, res) => {
    try {
        const product = await stripe.products.create({
            name: "T-Shirt",
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 100 * 100, // 100 INR
            currency: 'usd',
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/payment-success',
            cancel_url: 'http://localhost:3000/cancel',
            customer_email: 'demo@gmail.com',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4173, () => {
    console.log('Server running on port 4173');
});