import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router'
import { fetchProductsByFilters } from '../../redux/slices/productsSlice';

const ProductGrid = ({ products, loading, error }) => {

    const dispatch = useDispatch()

    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    if (error) {
        return <p className='text-center'>Error: {error}</p>;
    }



    return (
        <>
            {products ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center h-full'>
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            className=' p-2 rounded-lg hover:scale-105 transition-all duration-200 mb-2'>
                            <Link to={`/product/${product._id}`} key={index} className='block '>
                                <div className='w-full h-[470px] relative'>
                                    <img
                                        className='h-96 rounded-lg object-cover'
                                        src={product?.images?.[0]?.url} />
                                    <div className='mt-3 leading-4 font-sans'>
                                        <p className='text-lg font-semibold'>{product.name}</p>
                                        <p className='text-orange-700'>
                                            <span className="font-bold">$</span>
                                            {product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                    ))}

                </div>
            ) : (
                <p>Hello</p>
            )}
        </>
    )
}

export default ProductGrid