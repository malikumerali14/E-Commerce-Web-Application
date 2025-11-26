import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice'

const ProductManagment = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { products, loading, error } = useSelector((state) => state.adminProducts)

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [products])


    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        }

        if (user && user.role == 'admin') {
            dispatch(fetchAdminProducts())

        }

    }, [dispatch, navigate, user])

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct({ id: productId }))
        }

    }

    return (
        <>
            <div className='max-w-7xl mx-auto p-10 font-sans'>
                <h2 className='text-2xl font-extrabold mb-6'>Product Managment</h2>

                <div>
                    <button className='bg-green-600 font-semibold px-5 py-2 rounded-md text-white hover:bg-green-700 transition-all duration-300'>
                        <Link to={'/admin/products/create'}>Create New Product</Link>
                    </button>
                </div>

                <div className='mt-6'>
                    <table className='w-full '>
                        <thead className='uppercase text-sm text-left bg-gray-100'>
                            <tr>
                                <th className='py-2 px-4'>name</th>
                                <th className='py-2 px-4'>price</th>
                                <th className='py-2 px-4'>sku</th>
                                <th className='py-2 px-4'>actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td className='py-2 px-4 font-semibold'>{product.name}</td>
                                        <td className='py-2 px-4 font-semibold'>${product.price}</td>
                                        <td className='py-2 px-4'>{product.sku}</td>
                                        <td className='flex gap-2 py-2 px-4'>
                                            <Link
                                                className='bg-yellow-500 rounded px-2 py-1 text-white hover:bg-yellow-600 duration-300'
                                                to={`/admin/products/${product._id}/edit`}>Edit</Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className=' bg-red-700 px-2 py-1 text-white rounded hover:bg-red-600 duration-300'>Delete</button>
                                        </td>
                                    </tr>
                                ))

                            ) : (
                                <tr>
                                    <td
                                        className='text-center font-semibold text-gray-700 py-4 -translate-x-5'
                                        colSpan={4}>No Products to Show
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                </div>
            </div>
        </>
    )
}

export default ProductManagment