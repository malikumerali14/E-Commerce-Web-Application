const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const { protect, admin } = require('../middlewares/authMiddleware')

const router = express.Router()

// Create Product 
// @route POST /api/products
// Access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku } = req.body

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id // Reference to the admin user who created the product
        })

        const createdProduct = await product.save()
        res.status(201).json(createdProduct)

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")

    }

})



// @route PUT /api/products/:id
// Update an existing product
// Access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku } = req.body


        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured =
                isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished =
                isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Saving product
            const updatedProduct = await product.save()
            res.json(updatedProduct)

        } else {
            res.status(404).send({ message: "Product not found" })
        }


    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }

})


// @route /api/products/
// To delete the product
// Access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const product = await Product.findById(id)

        if (product) {
            await product.deleteOne()
            res.json({ message: "Product Delete Successfully" })
        } else {
            res.status(404).json({ message: "Product not found" })
        }

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }



})


// @route api/products
// To Fetch the required products
// Public

router.get('/', async (req, res) => {
    try {
        const { collection,
            size,
            color,
            material,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            brand,
            limit } = req.query

        let query = {}

        if (collection && collection.toLocaleLowerCase() !== 'all') {
            query.collection = collection
        }

        if (category && category.toLocaleLowerCase() !== 'all') {
            query.category = category
        }

        if (material) {
            query.material = { $in: material.split(',') }
        }

        if (brand) {
            query.brand = { $in: brand.split(',') }
        }

        if (size) {
            query.sizes = { $in: size.split(',') }
        }

        if (color) {
            query.colors = { $in: [color] }
        }

        if (gender) {
            query.gender = gender
        }

        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$lte = Number(maxPrice)

        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        // Sort Logic 
        let sort = {}
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 }
                    break;
                case 'priceDesc':
                    sort = { price: -1 }
                    break;
                case 'popularity':
                    sort = { rating: -1 }
                    break;
                default:
                    break;

            }
        }


        //Fetch products and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0)
        res.json(products)



    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


// @route /api/products/best-seller
// Get Reqeust to fetch products from best sellers
// Public Access
router.get('/best-seller', async (req, res) => {
    try {
        const bestProduct = await Product.find().sort({ rating: -1 })
        res.json(bestProduct)


    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// @route /api/products/new-arrivals
// Get Reqeust to fetch latest arrival 
// Public Access
router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrival = await Product.find().sort({ createdAt: -1 }).limit(8)
        res.json(newArrival)

    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }

})


// @route /api/products/:id
// Get Request to fetch single product
// Public Access
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json(product)


    } catch (error) {
        res.status(500).send("Server Error")
    }


})

// @route /api/products/similar/:id
// Get Request to fetch similar products
// Public Access
router.get('/similar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found." })
        }

        const similarProducts = await Product.find({
            _id: { $ne: id }, // Excluding the current Product ID because we don't want to display it in similar products
            gender: product.gender,
            category: product.category

        }).limit(4)

        res.json(similarProducts)


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


module.exports = router

