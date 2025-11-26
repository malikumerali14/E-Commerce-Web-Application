const express = require('express')
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const streamifier = require('streamifier')
const dotenv = require('dotenv')
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});



// Multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        // Function to handle the stream upload to Cloudinary 
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result)

                    } else {
                        reject(error)

                    }
                })

                //Streamfier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream)


            })

        }

        // Calling the streamUpload Function 
        const result = await streamUpload(req.file.buffer)
        res.status(200).json({ imageUrl: result.secure_url })


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")

    }


})

module.exports = router
