import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderDetails } from '../redux/slices/orderSlice'

const OrderDetailsPage = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const id = params.id;
    const { orderDetails, loading, error } = useSelector((state) => state.orders)

    // useEffect(() => {
    //     const mockOrders = {
    //         _id: id,
    //         createdAt: new Date(),
    //         isPaid: true,
    //         isDelivered: false,
    //         paymentMethod: 'Paypal',
    //         shippingMethod: 'Standard',
    //         shippingAddress: {
    //             city: "Islamabad",
    //             country: "Pakistan"
    //         },
    //         orderItems: [  
    //             {
    //                 productId: 1,
    //                 name: "Denim Jeans",
    //                 price: 3999,
    //                 color: 'Dark Blue',
    //                 size: "L",
    //                 quantity: 1,
    //                 image: 'https://picsum.photos/300/400?random=1',
    //             },
    //             {
    //                 productId: 5,
    //                 name: "Denim Jacket",
    //                 price: 6999,
    //                 color: 'Black',
    //                 size: "XL",
    //                 quantity: 2,
    //                 image: 'https://picsum.photos/300/400?random=68',
    //             },
    //         ]



    //     }

    //     setOrderDetails(mockOrders)

    // }, [id])

    useEffect(() => {
        dispatch(fetchOrderDetails(id))

    }, [id])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
            <div className=' font-sans max-w-5xl mx-auto mb-12'>
                <h1 className='font-extrabold text-2xl my-4'>Order Details</h1>
                <div className='p-4 border-2'>
                    {!orderDetails ?
                        (
                            <div className='text-xl '>
                                No Order details found
                            </div>
                        ) :
                        (
                            <>
                                <div className='p-4 sm:p-6'>
                                    {/* Order ID  */}
                                    <div className='flex justify-between'>
                                        <div>
                                            <h3 className='font-semibold text-lg'>Order ID: #{orderDetails._id}</h3>
                                            <p className='text-sm'>{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        <div className='flex flex-col gap-1 items-end'>
                                            <p className={`text-[12px] px-2 py-1 rounded-full font-semibold ${orderDetails.isPaid ? "bg-green-200 text-green-900" : ""}`}>{orderDetails.isPaid ? "Approved" : "Pending"}</p>
                                            <p className={`text-[12px] px-2 py-1 rounded-full font-semibold ${orderDetails.isDelivered ? "bg-green-200 text-green-900" : "bg-yellow-200 text-yellow-800 "}`}>{orderDetails.isDelivered ? "Delivered" : "Pending"}</p>
                                        </div>
                                    </div> 

                                    {/* Payment and Shipping Information  */}
                                    <div className='grid grid-cols-2 mt-16'>
                                        {/* Payment Details  */}
                                        <div>
                                            <h4 className='font-bold'>Payment Info</h4>
                                            <p className='text-gray-900'>Payment Method: {orderDetails.paymentMethod}</p>
                                            <p className='text-gray-900'>Status: {orderDetails.isPaid}</p>
                                        </div>

                                        {/* Delivery Details  */}
                                        <div>
                                            <h4 className='font-bold'>Shipping Info</h4>
                                            <p className='text-gray-900'>Shipping Method: {orderDetails.shippingMethod}</p>
                                            <p className='text-gray-900'>Address: {orderDetails.shippingAddress.city}, {" "} {orderDetails.shippingAddress.country}</p>
                                        </div>
                                    </div>

                                    {/* Products Detail */}
                                    <div className='mt-10'>
                                        <h3 className='font-bold mb-3'>Products</h3>

                                        <table className='min-w-full '>
                                            <thead>
                                                <tr className='bg-gray-200'>
                                                    <th>Name</th>
                                                    <th>Unit Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead> 
                                            <tbody>
                                                {orderDetails?.orderItems?.map((item) => (
                                                    <tr className='border-b' key={item.productId}>
                                                        <td className='flex items-center gap-2 my-2'>
                                                            <img src={item.image} className='w-12 h-12 rounded-md' />
                                                            <Link className='text-blue-700'>{item.name}</Link>
                                                        </td>
                                                        <td className='text-center'>Rs: {item.price}</td>
                                                        <td className='text-center'>Rs: {item.quantity}</td>
                                                        <td className='text-center'>Rs: {item.price * item.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>

                                    <div className='mt-4'>
                                        <Link to={'/my-orders'} className='text-blue-700 hover:underline'>Back to My Orders</Link>
                                    </div>

                                </div>
                            </>
                        )}
                </div>

            </div>
        </>
    )
}

export default OrderDetailsPage