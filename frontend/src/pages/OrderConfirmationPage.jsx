import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { clearCart } from '../redux/slices/cartSlice'


const OrderConfirmationPage = () => {
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchOrder = async () => {
            const params = new URLSearchParams(window.location.search)
            const orderId = params.get('checkout_id')

            if (!orderId) {
                navigate('/my-orders')
                return
            }

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                })
                setOrder(data)
                dispatch(clearCart())
                
            } catch (error) {
                console.error("Error fetching order:", error)
                navigate('/my-orders')
            }
        }

        fetchOrder()
    }, [])

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt)
        orderDate.setDate(orderDate.getDate() + 10)
        return orderDate.toLocaleDateString()
    }

    if (!order) return <p>Loading order...</p>

    return (
        <div className='max-w-3xl mx-auto p-4 font-sans'>
            <h2 className='text-4xl font-bold text-green-700 text-center py-6'>
                Thank You for Your Order!
            </h2>

            <div className='border-2 p-4'>
                <div className='flex justify-between mb-6'>
                    <div>
                        <h3 className='font-bold'>Order ID: {order._id}</h3>
                        <p className='text-gray-600'>Order date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className='text-emerald-700 text-sm font-semibold'>
                            Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Ordered Items */}
                {order.orderItems.map((item, index) => (
                    <div key={index} className='flex justify-between m-3'>
                        <div className='flex gap-3'>
                            <img src={item.image} className='w-16 h-16 object-cover rounded-md' />
                            <div>
                                <p className='font-bold'>{item.name}</p>
                                <p>{item.color} | {item.size}</p>
                            </div>
                        </div>
                        <div>
                            <p className='font-semibold'>Rs: {item.price}</p>
                            <p className='text-gray-500'>Qty: {item.quantity || 1}</p>
                        </div>
                    </div>
                ))}

                {/* Payment & Delivery */}
                <div className='grid grid-cols-2 mt-6'>
                    <div>
                        <h4 className='font-bold'>Payment</h4>
                        <p className='text-gray-600'>{order.paymentMethod}</p>
                    </div>
                    <div>
                        <h4 className='font-bold'>Delivery</h4>
                        <p className='text-gray-600'>{order.shippingAddress.address}</p>
                        <p className='text-gray-600'>
                            {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmationPage
