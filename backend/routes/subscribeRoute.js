const express = require('express')
const Subscriber = require('../models/Subscriber')

const router = express.Router()


// @route api/subscribe
// @desc subscribe to newsletter
// Access Public
router.post('/subscribe', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    try {
        let subscriber = await Subscriber.findOne({ email })

        if (subscriber) {
            return res.status(400).json({ message: "Email is already subscribed" })
        }

        // Create a new subscriber
        subscriber = new Subscriber({email})
        await subscriber.save()

        res.status(201).json({message: "Successfully subscribed to the newsletter"})


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }


})

module.exports = router