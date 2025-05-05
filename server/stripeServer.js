const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('pk_test_51RC085ITdjoNxqHwhuab4Hug9IAGg3omZPXeACf400flSkXLbcmExkST52L7yErFvowXgPLWYCvOqdne4dBYJ1F000UInvK1rx');

const app = express();

// Enable CORS for your Next.js app
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Add a test endpoint to check connectivity
app.get('/test', (req, res) => {
    res.json({ status: 'OK', message: 'Stripe server is running' });
});

app.post('/payment', async (req, res) => {
    try {
        // Get order details from request body
        const {
            items = [],
            total = 0,
            email = 'customer@example.com',
            orderDetails = {},
            deliveryAddress = ''
        } = req.body;


        // Create line items for Stripe based on cart items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name || 'Product',
                    // Only include images if they exist and have a valid URL
                    ...(item.image && (item.image.startsWith('http') || item.image.startsWith('/'))
                        ? { images: [item.image.startsWith('/') ? `http://localhost:3000${item.image}` : item.image] }
                        : {}),
                    description: `Quantity: ${item.quantity}`
                },
                unit_amount: Math.round((item.price || 0) * 100),
            },
            quantity: item.quantity || 1,
        }));

        if (orderDetails.deliveryFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Delivery Fee',
                        description: orderDetails.deliveryMethod || 'Standard Delivery'
                    },
                    unit_amount: Math.round(orderDetails.deliveryFee * 100),
                },
                quantity: 1,
            });
        }

        // Add tax as a separate line item if present
        if (orderDetails.tax > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tax',
                    },
                    unit_amount: Math.round(orderDetails.tax * 100),
                },
                quantity: 1,
            });
        }


        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/order-confirmation?amount=${total}&orderDetails=${encodeURIComponent(JSON.stringify(orderDetails))}`,
            cancel_url: 'http://localhost:3000/checkout',
            customer_email: email,
        });

       
        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            error: 'Payment Processing Error',
            message: error.message,
            details: error.toString()
        });
    }
});

// Add new endpoint for Fleeto Pro subscription
app.post('/fleeto-pro-subscription', async (req, res) => {
    try {
        const { userId, userEmail, userName } = req.body;

        if (!userEmail) {
            return res.status(400).json({ error: 'Missing user email' });
        }

        // Use email as identifier instead of user ID
        // This is more consistent across systems
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Fleeto Pro Subscription',
                            description: 'Monthly subscription for Fleeto Pro with exclusive benefits',
                            images: ['https://your-website.com/images/fleeto-pro-logo.png'],
                        },
                        unit_amount: 999, // $9.99 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // Use email as the key identifier in the success URL
            success_url: `http://localhost:3000/fleeto-pro/success?userEmail=${encodeURIComponent(userEmail)}&timestamp=${Date.now()}`,
            cancel_url: `http://localhost:3000/fleeto-pro?canceled=true`,
            metadata: {
                userId: userId,
                userEmail: userEmail,
                type: 'fleeto_pro_subscription'
            },
            customer_email: userEmail,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Fleeto Pro subscription session:', error);
        res.status(500).json({ error: 'Failed to create subscription session' });
    }
});

const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});