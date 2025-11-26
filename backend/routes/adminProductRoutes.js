const express = require('express')
const Product = require('../models/Product')
const { protect, admin } = require('../middlewares/authMiddleware')

const router = express.Router()


//@route api/admin/products
// @desc Get all products (Admin only)
//@access Private/Admin 
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find()
        if (products) {
            return res.status(200).json(products)
        }

        res.json(products)


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }


})


module.exports = router