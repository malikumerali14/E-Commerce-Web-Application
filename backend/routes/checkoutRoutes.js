const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')
const { protect } = require("../middlewares/authMiddleware")
const Cart = require('../models/Cart')
const Checkout = require('../models/Checkout')
const Order = require('../models/Order')
const stripe = require('stripe')('sk_test_51SEW0iIHo7nRqd1YcnY9Yt473eExCLmB7G6Olag2zqoaQevLhJN13cxXKEyCmVu1jwr8EnY1QsxLmu7MyrkLhC4v00BEnFfJnq');


const router = express.Router()


// @route api/checkout
// Desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items in cart" })
    }


    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false

        })
        // console.log(`Checkout created for user: ${req.user_id}`)
        // res.status(201).json(newCheckout) 

        const lineItems = checkoutItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image]
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: 1
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONT_END_URL}/order-confirmation?checkout_id=${newCheckout._id}`,
            cancel_url: `${process.env.FRONT_END_URL}/checkout`,
            metadata: {
                checkoutId: newCheckout._id.toString(),
                userId: req.user._id.toString()
            }
        })

        return res.json({ url: session.url, newCheckout })


    } catch (error) {
        console.log("🔥 STRIPE ERROR DETAILS 🔥");
        console.log(error.message);
        console.log(error.raw);

        return res.status(500).json({
            status: "error",
            message: error.message,
            details: error.raw || null
        });
    }

})


// @route api/checkout/webhook
// Desc Update checkout to mark as paid and create order after successful payment
// @access public
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    console.log("Stripe hitting webhook")
    const sig = req.headers["stripe-signature"];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("❌ Webhook signature invalid:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const checkout = await Checkout.findById(session.metadata.checkoutId);

        if (!checkout) return res.status(404).json({ message: "Checkout not found" });

        checkout.isPaid = true;
        checkout.paymentStatus = "paid";
        checkout.paymentDetails = session.payment_intent;
        checkout.paidAt = Date.now();
        await checkout.save();

        // Create order
        const order = await Order.create({
            user: session.metadata.userId,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: Date.now()
        });

        // Delete user cart
        await Cart.findOneAndDelete({ user: session.metadata.userId });

        console.log("✔ Order created:", order._id);
    }

    res.json({ received: true });
}
);



// @route api/checkout
// Desc Update checkout to mark as paid after successful payment
// @access Private
router.put('/:id/pay', protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }


        if (paymentStatus === 'paid') {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save()

            res.status(200).json(checkout)
        } else {
            res.status(400).json({ message: "Invalid Payment Status" })
        }


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


// @route api/checkout/:id/finalize
// Desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post('/:id/finalize', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            // Creating final order based on checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: 'paid',
                paymentDetails: checkout.paymentDetails
            })


            // Mark the checkout as finalized 
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now()
            await checkout.save()

            // Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder)

        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" })

        }


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


module.exports = router;