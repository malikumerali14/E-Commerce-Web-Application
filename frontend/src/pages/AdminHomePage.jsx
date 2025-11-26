import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { fetchAllOrders } from '../redux/slices/adminOrderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts } from '../redux/slices/adminProductSlice'

const AdminHomePage = () => {
    const dispatch = useDispatch()
    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.products)
    const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector((state) => state.adminOrders)

    useEffect(() => {
        dispatch(fetchAllOrders())
        dispatch(fetchAdminProducts())

    }, [dispatch])


    // const orders = [
    //     {
    //         _id: 12435,
    //         user: {
    //             name: "Malik Umer"
    //         },
    //         totalPrice: 15000,
    //         status: "Processing"

    //     },
    //     {
    //         _id: 12435786,
    //         user: {
    //             name: "Malik Umer"
    //         },
    //         totalPrice: 15000,
    //         status: "Processing"

    //     },
    // ]

    return (
        <>
            <div className='w-full mx-auto p-8 font-sans'>
                <div>
                    <h1 className='text-2xl font-bold '>Admin Dashboard</h1>
                </div>
                {productsLoading || ordersLoading ? (
                    <p>Loading...</p>
                ) : productsError ? (
                    <p className='text-red-500'>Error Fetching Products: {productsError}</p>
                ) : ordersError ? (
                    <p className='text-red-500'>Error Fetching Orders: {ordersError}</p>
                ) : (

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                        <div className='shadow-md roundend-lg p-4'>
                            <h2 className='font-semibold text-xl'>Revenue</h2>
                            <p className='font-semibold text-xl'>${totalSales}</p>
                        </div>
                        <div className='shadow-md roundend-lg p-4'>
                            <h2 className='font-semibold text-xl'>Total Orders</h2>
                            <p className='font-semibold text-xl'>{totalOrders}</p>
                            <Link to={'/admin/orders'} className='text-sm text-blue-800 hover:underline'>Manage Orders</Link>
                        </div>
                        <div className='shadow-md roundend-lg p-4'>
                            <h2 className='font-semibold text-xl'>Total Products</h2>
                            <p className='font-semibold text-xl'>{products.length}</p>
                            <Link to={'/admin/products'} className='text-sm text-blue-800 hover:underline'>Manage Products</Link>
                        </div>
                    </div>

                )}
                <div className='mt-6'>
                    <h2 className='font-bold text-xl'>Recent Orders</h2>

                    <div>
                        <table className='min-w-full text-left'>
                            <thead className='bg-gray-100 text-sm text-gray-700'>
                                <tr className=''>
                                    <th className='py-2 px-4'>Order ID</th>
                                    <th className='py-2 px-4'>USER</th>
                                    <th className='py-2 px-4'>TOTAL PRICE</th>
                                    <th className='py-2 px-4'>STATUS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders?.length > 0 ? (
                                    orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className='border-b'
                                        >
                                            <td className='p-3'>{order._id}</td>
                                            <td className='p-3'>{order?.user?.name}</td>
                                            <td className='p-3'>${order.totalPrice}</td>
                                            <td className='p-3'>{order.status}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className='text-center text-gray-700 py-4'>No Orders Found.</td>
                                    </tr>
                                )}



                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminHomePage