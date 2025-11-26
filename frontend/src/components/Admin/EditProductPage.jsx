import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice'
import axios from 'axios'

const EditProductPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const { selectedProduct, loading, error } = useSelector((state) => state.products)
    const [uploading, setUploading] = useState(false)


    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: '',
        images: []

    },
    )

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id))
        }
    }, [dispatch, id])


    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct)

        }
    }, [selectedProduct])



    const handleChange = (e) => {
        const { name, value } = e.target
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    }


    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)

        const token = localStorage.getItem("userToken");
        try {
            setUploading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }]
            }))
            setUploading(false)

        } catch (error) {
            console.error(error)
            setUploading(false)
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProduct({ id: id, productData }))
        navigate('/admin/products')
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>


    return (
        <>
            <div className='max-w-7xl mx-auto font-sans py-10 px-20'>
                <div className='shadow-md p-6'>
                    <h2 className='text-2xl font-bold mb-8'>Edit Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Product Name</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded'
                                name='name'
                                type='text'
                                value={productData.name}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Description</label>
                            <textarea
                                className='w-full border px-4 py-1 my-1 rounded'
                                name='description'
                                rows={4}
                                value={productData.description}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Price</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded'
                                name='price'
                                type='text'
                                value={productData.price}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Count in Stock</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded'
                                name='countInStock'
                                type='number'
                                value={productData.countInStock}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>SKU</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='sku'
                                type='text'
                                value={productData.sku}
                                onChange={handleChange}

                            />
                        </div>

                        {/* Sizes  */}
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Sizes (Comma-separated)</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='sizes'
                                type='text'
                                value={productData.sizes.join(', ')}
                                onChange={(e) => setProductData({
                                    ...productData,
                                    sizes: e.target.value.split(',').map((size) => size.trim())
                                })}

                            />
                        </div>

                        {/* Colors  */}
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Colors (Comma-separated)</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='colors'
                                type='text'
                                value={productData.colors.join(', ')}
                                onChange={(e) => setProductData({
                                    ...productData,
                                    colors: e.target.value.split(',').map((color) => color.trim())
                                })}

                            />
                        </div>

                        

                        {/* Images  */}
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Upload Image</label>
                            <input
                                className='w-full py-1 my-1 rounded text-sm'
                                type='file'
                                onChange={(e) => handleUploadImage(e)}
                            />
                            {uploading && <p>Uploading...</p>}
                            <div className='flex gap-2 mt-3'>
                                {productData.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image.url} alt='product-image' className='w-20 h-20 rounded-md object-cover' />
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div>
                            <button type='submit' className='w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-all hover:-translate-y-1 duration-300'>
                                Update Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default EditProductPage