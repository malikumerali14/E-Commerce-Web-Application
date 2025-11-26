const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

// @route api/users/register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Logic for user Registration
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        else {
            user = new User({ name, email, password })
            await user.save()

            // JWT Payload
            const payload = { user: { id: user._id, role: user.role } }

            // Sign and return the token along with user data
            jwt.sign(payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;

                    // Send the user and token in response
                    res.status(201).json({
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        },
                        token
                    })

                })

        }

    } catch (err) {
        console.log("Error due to:", err)
        res.status(500).send("Server Error")
    }
})

// @route /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const isMatch = await user.matchPassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        // JWT Payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        }

        // Sign and return the token along with user data
        jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error("JWT Signing Error:", err);
                    return res.status(500).send("Server Error: Failed to generate token.");
                }

                // Send the user and token in response
                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                })
            }
        )


    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }

})


// Get request to get user's profile 
// Protected Route
router.get('/profile', protect, async (req, res) => {
    res.json(req.user)


})



module.exports = router