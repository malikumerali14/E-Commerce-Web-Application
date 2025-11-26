const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/Product')
const User = require('../models/User')
const { protect } = require("../middlewares/authMiddleware")
const Cart = require('../models/Cart')

const router = express.Router()


// Function to get a cart by user ID or guest ID 
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId: guestId.trim() })
    }

    return null;
}


// @route api/cart 
// desc Add a product to the cart for a guest or logged-in user
// @access public

router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found." })
        }

        // Determine if the user is loggin or not 
        let cart = await getCart(userId, guestId)

        // If the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) => {
                return p.productId.toString() === productId && p.size === size && p.color === color
            }) 

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity

            } else {
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity


                })
            }


            // Calculating the total price 
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save()
            res.status(200).json(cart)
        } else {
            // Create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity
                    },
                ],

                totalPrice: product.price * quantity

            })

            return res.status(201).json(newCart)

        }


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})


// @route PUT request api/cart 
// desc Update a product quantity inside the cart
// @access public
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const productIndex = cart.products.findIndex((p) => {
            return p.productId.toString() === productId && p.size === size && p.color === color
        })

        if (productIndex > -1) {
            // update quantity 
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;

            } else {
                cart.products.splice(productIndex, 1) // Remove the product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)

        } else {
            return res.status(404).json({ message: 'Product not found in cart' })
        }


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})



// @route Delete request api/cart 
// desc Delete a product from the cart
// @access public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        // Delete the product and update the total amount
        const productIndex = cart.products.findIndex((p) => {
            return p.productId.toString() === productId;
            //  && p.size === size && p.color === color
        })

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1)

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)


        } else {
            return res.status(404).json({ message: 'Product not found in cart' })
        }



    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


// @route Get request api/cart 
// desc Get cart of logged in user or guest user
// @access public
router.get('/', async (req, res) => {
    const { userId, guestId } = req.query
    try {
        const cart = await getCart(userId, guestId)
        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ message: "Cart not found" })

        }



    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }

})


module.exports = router
