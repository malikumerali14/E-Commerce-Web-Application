import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserOrders } from '../redux/slices/orderSlice'

const MyOrdersPage = () => {
    // const [orders, setOrders] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.orders)

    // const mockOrders = [
    //     {
    //         _id: 11243,
    //         shippingAddress: { city: 'Islamabad', country: 'Pakistan' },
    //         createdAt: new Date(),
    //         orderItems: [
    //             {
    //                 name: "Product 1",
    //                 image: "https://picsum.photos/400/400?random=49"
    //             },
    //         ],
    //         totalPrice: 14999,
    //         isPaid: true

    //     },
    //     {
    //         _id: 15476,
    //         shippingAddress: { city: 'Lahore', country: 'Pakistan' },
    //         createdAt: new Date(),
    //         orderItems: [
    //             {
    //                 name: "Product 2",
    //                 image: "https://picsum.photos/400/400?random=45"
    //             },
    //         ],
    //         totalPrice: 14999,
    //         isPaid: false

    //     },


    // ]


    useEffect(() => {
        dispatch(fetchUserOrders())

    }, [dispatch])


    // useEffect(() => {
    //     setTimeout(() => {
    //         setOrders(mockOrders)


    //     }, 1000);


    // }, [])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }


    // if(loading) return <p>Loading...</p>;
    // if(error) return <p>Error: {error}</p>;

    return (
        <>
            <div className='font-sans mx-auto px-4 shadow-md rounded-lg max-w-7xl'>
                <h1 className='text-2xl font-extrabold my-4'>My Orders</h1>

                <div>
                    <table className='min-w-full text-left text-gray-700'>
                        <thead>
                            <tr className='font-light bg-gray-200 rounded-md'>
                                <th className='px-4 py-2'>Image</th>
                                <th className='px-4 py-2'>Order ID</th>
                                <th className='px-4 py-2'>Created</th>
                                <th className='px-4 py-2'>Items</th>
                                <th className='px-4 py-2'>Shipping Address</th>
                                <th className='px-4 py-2'>Price</th>
                                <th className='px-4 py-2'>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        onClick={() => handleRowClick(order._id)}
                                        className='border-b hover:cursor-pointer'>
                                        <td className='p-3'>
                                            <img src={order.orderItems[0]?.image}
                                                className='w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg'
                                            />
                                        </td>
                                        <td className='p-3 font-bold'>
                                            #{order._id}
                                        </td>
                                        <td className='p-3'>
                                            {new Date(order.createdAt).toLocaleDateString()}{"  "}
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </td>
                                        <td className='p-3'>
                                            {order.orderItems.length}
                                        </td>
                                        <td className='p-3'>
                                            {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                                                :
                                                "N/A"
                                            }
                                        </td>
                                        <td className='p-3'>
                                            {order.totalPrice}
                                        </td>
                                        <td className='p-3'>
                                            <span className={`px-2 py-1 font-semibold rounded-md ${order.isPaid ? "bg-green-100 text-green-700 " : "bg-red-100 text-red-700"}`}>
                                                {order.isPaid ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='font-semibold text-lg py-4 px-2'>You Have No Orders to Show</td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>


            </div>

        </>
    )
}

export default MyOrdersPage