require('dotenv').config();
const express = require('express');
var cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_API_KEY)

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
    const items = req.body.items;

     // Initialize an array to hold line items for Stripe
    let lineItems = [];

    // Convert each item to the format expected by Strip
    items.forEach((item) => {
        lineItems.push(
            {
               price: item.id,
               quantity: item.quantity 
            }
        )
    });

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:3001/success",
        cancel_url: "http://localhost:3001/cancel"
    });
    res.send(JSON.stringify({
        url: session.url
    }))
})

app.listen(4000, () => console.log("Listening on port 4000"))
