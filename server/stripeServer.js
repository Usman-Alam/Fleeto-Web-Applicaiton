const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51RBiFTH6dDt990IEShjcNM0AgqwYx1UruNcckD5fLMf8pujNGPdEW1O6UNOSQmqDf8WMqtXFCcW1wuy0sMITO08200HHp5SqKt');

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
    console.log('Payment request received');
    try {
        // Get order details from request body
        const { 
            items = [], 
            total = 0, 
            email = 'customer@example.com',
            orderDetails = {},
            deliveryAddress = ''
        } = req.body;

        console.log(`Processing ${items.length} items, total: $${total}`);

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
                unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
            },
            quantity: item.quantity || 1,
        }));

        // Add delivery fee as a separate line item if present
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

        console.log('Creating Stripe session...');
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/order-confirmation?amount=${total}&orderDetails=${encodeURIComponent(JSON.stringify(orderDetails))}`,
            cancel_url: 'http://localhost:3000/checkout',
            customer_email: email,
        });

        console.log('Stripe session created:', session.id);
        console.log('Redirect URL:', session.url);
        
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

const PORT = 4173;
app.listen(PORT, () => {
    console.log(`Stripe server running on http://localhost:${PORT}`);
});