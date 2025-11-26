const express = require('express');
const axios = require('axios');
const Replicate = require('replicate');
const { useState } = require('react');

const router = express.Router();
const app = express();

app.use(express.json());

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

// @route   POST api/replicate
// @desc    Generate VTON image from URLs
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { human_img, garm_img, garmentDescription } = req.body;

        if (!human_img || !garm_img) {
            return res.status(400).json({ error: "human_img and garm_img URLs are required" });
        }

        // Call Replicate with image URLs directly
        const output = await replicate.run(
            "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            {
                input: {
                    garm_img,
                    human_img,
                    garment_des: garmentDescription
                }
            }
        );

        if (output instanceof ReadableStream) {
            const reader = output.getReader();
            let chunks = [];
            let done = false;

            while (!done) {
                const { value, done: isDone } = await reader.read();
                done = isDone;
                if (value) chunks.push(value);
            }

            const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

            // Convert to Base64 URL
            const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

            return res.json({ result: base64Image });
        }


    } catch (error) {
        console.error("Replicate Error:", error);
        res.status(500).json({ error: "Failed to generate VTON image." });
    }
});

module.exports = router;
