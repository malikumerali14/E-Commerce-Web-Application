const express = require('express')
const Order = require('../models/Order')
const { protect, admin } = require('../middlewares/authMiddleware')


const router = express.Router()


//@route api/admin/orders
// @desc Get all orders (Admin only)
//@access Private/Admin 
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email")
        res.json(orders)


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }


})


////@route api/admin/orders/:id
// @desc Update order status (Admin only)
//@access Private/Admin 
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name")
        if (order) {
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered
            order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : order.deliveredAt


            const updatedOrder = await order.save()
            res.json(updatedOrder)

        } else {
            res.status(404).json({ message: 'Order not found' })
        }


    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }


})



// @route api/admin/orders/:id
// @desc To delete user (Admin only)
// Access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            await order.deleteOne()
            res.json({ message: "Order deleted successfully" })

        } else {
            res.status(404).json({ message: "Order not found" })
        }



    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }


})


module.exports = router