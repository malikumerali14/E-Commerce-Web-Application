import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice'

const OrderManagment = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { orders, loading, error } = useSelector((state) => state.adminOrders)

    // const orders = [
    //     {
    //         _id: 1545,
    //         user: {
    //             name: "Malik Umer",
    //         },
    //         totalPrice: 15999,
    //         status: 'Processing'
    //     },


    // ]

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        }

        if (user && user.role == 'admin') {
            dispatch(fetchAllOrders())

        }

    }, [user, dispatch, navigate])


    const handleStatusChange = (id, status) => {
        dispatch(updateOrderStatus({ id: id, status }))
    }


    if (loading) return <p className='w-full h-full text-center'>Loading...</p>
    if (error) return <p className='w-full h-full text-center'>Error: {error}</p>

    return (
        <>
            <div className='max-w-7xl mx-auto p-12 font-sans font-extrabold'>
                <h2 className='text-2xl mb-8'>Order Managment</h2>

                <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                    <table className='min-w-full text-left text-gray-500'>
                        <thead className='text-gray-900 bg-gray-100'>
                            <tr>
                                <th className='px-3 py-2'>Order ID</th>
                                <th className='px-3 py-2'>Customer</th>
                                <th className='px-3 py-2'>Total Price</th>
                                <th className='px-3 py-2'>Status</th>
                                <th className='px-3 py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='w-full text-gray-900 font-normal text-sm bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={index}>
                                        <td className='px-4 py-3 font-semibold'>#{order._id}</td>
                                        <td className='px-4 py-3'>{order.user.name}</td>
                                        <td className='px-4 py-3'><span className='font-semibold'>Rs:</span> {order.totalPrice.toFixed(2)}</td>
                                        <td className='px-4 py-3'>
                                            <select
                                                className='border p-1 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 font-semibold bg-gray-100 text-gray-600 hover:bg-gray-100 cursor-pointer'
                                                value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                                                <option value='Processing'>Processing</option>
                                                <option value='Shipped'>Shipped</option>
                                                <option value='Delivered'>Delivered</option>
                                                <option value='Cancelled'>Cancelled</option>
                                            </select>
                                        </td>
                                        <td className='px-3 py-2'>
                                            <button
                                                onClick={() => handleStatusChange(order._id, "Delivered")}
                                                className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'>Mark as Delivered</button>
                                        </td>
                                    </tr>

                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className='-translate-x-10 text-center font-semibold text-gray-700 py-4'>No Orders to Show</td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>
            </div >
        </>
    )
}

export default OrderManagment