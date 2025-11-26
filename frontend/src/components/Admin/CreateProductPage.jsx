import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { createProduct } from '../../redux/slices/productsSlice'
import axios from 'axios'
import { toast } from 'sonner'

const EditProductPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
        dispatch(createProduct(productData))
        toast.success("Product Created Successfully")
        navigate('/admin/products')
    }

    // if (loading) return <p>Loading...</p>
    // if (error) return <p>Error: {error}</p>


    return (
        <>
            <div className='max-w-7xl mx-auto font-sans py-10 px-20'>
                <div className='shadow-md p-6'>
                    <h2 className='text-2xl font-bold mb-8'>Create New Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Product Name</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded'
                                name='name'
                                type='text'
                                required
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
                                required
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
                                required
                                value={productData.sku}
                                onChange={handleChange}

                            />
                        </div>

                        

                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Category</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='category'
                                type='text'
                                value={productData.category}
                                onChange={handleChange}

                            />
                        </div>

                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Brand</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='brand'
                                type='text'
                                value={productData.brand}
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
                                required
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
                                required
                                value={productData.colors.join(', ')}
                                onChange={(e) => setProductData({
                                    ...productData,
                                    colors: e.target.value.split(',').map((color) => color.trim())
                                })}

                            />
                        </div>

                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Collections</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='collections'
                                type='text'
                                value={productData.collections}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Material</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='material'
                                type='text'
                                value={productData.material}
                                onChange={handleChange}

                            />
                        </div>
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Gender</label>
                            <input
                                className='w-full border px-4 py-1 my-1 rounded '
                                name='gender'
                                type='text'
                                value={productData.gender}
                                onChange={handleChange}

                            />
                        </div>

                        {/* Images  */}
                        <div className='my-2'>
                            <label className='font-semibold text-sm'>Upload Image</label>
                            <input
                                className='w-full py-1 my-1 rounded text-sm'
                                type='file'
                                required
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
                                Create Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default EditProductPage