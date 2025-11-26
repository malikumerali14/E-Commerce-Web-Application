import React, { useEffect, useRef, useState } from 'react'
import { Suspense, lazy } from 'react';
import { toast } from 'sonner'
import ProductGrid from './ProductGrid'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import ARTryOnViewer from '../ARTryOnViewer'; // Keep this component
import axios from 'axios';


const ProductDetails = ({ productId }) => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { selectedProduct = {}, loading, error, similarProducts } = useSelector((state) => state.products)
    const { user, guestId } = useSelector((state) => state.auth)
    const [mainImage, setMainImage] = useState()
    const [selectedColor, setSelectedColor] = useState()
    const [selectedSize, setSelectedSize] = useState('')
    const [totalQuantity, setTotalQuantity] = useState(1)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const garmentDescription = selectedProduct?.description;

    // AR States
    const [isARMode, setIsARMode] = useState(false);

    // NEW VTON States
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [isVtonFormVisible, setIsVtonFormVisible] = useState(false);

    const productModelUrl = `/models/tshirt.glb`;

    // NEW function to open the main selection modal
    const openTryOnModal = () => {
        setIsSelectionModalOpen(true);
    };

    // NEW function to handle selection of Live AR
    const handleSelectAR = () => {
        setIsSelectionModalOpen(false);
        setIsARMode(true); // Toggles the existing AR viewer on
    };

    // NEW function to handle selection of Image VTON
    const handleSelectVTON = () => {
        setIsSelectionModalOpen(false);
        setIsVtonFormVisible(true); // Shows the Image VTON form
    };

    // Existing function to toggle the Live AR Viewer
    const toggleARMode = () => {
        setIsARMode((prev) => !prev);
    };

    // Function to close the VTON form (called from inside VtonImageForm)
    const closeVtonForm = () => {
        setIsVtonFormVisible(false);
    };


    const productFetchId = productId || id;

    useEffect(() => {
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId))
            dispatch(fetchSimilarProducts({ id: productFetchId }))
        }

    }, [dispatch, productFetchId])


    useEffect(() => {
        if (selectedProduct?.images?.length > 0) {
            setMainImage(selectedProduct.images[0].url)
        }
    }, [selectedProduct])


    const handleTotalQuantity = (action) => {
        if (action === 'plus') setTotalQuantity((prev) => prev + 1)
        if (action == 'minus' && totalQuantity > 1) setTotalQuantity((prev) => prev - 1)
    }


    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please Select Size and Color Before Adding to Cart")
            return
        }

        setIsButtonDisabled(true)

        dispatch(addToCart({
            productId: productFetchId,
            quantity: totalQuantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id

        })).then(() => {
            toast.success("Product added to the cart", {
                duration: 1000

            });
        }).finally(() => {
            setIsButtonDisabled(false)
        })
    }


    if (loading) {
        return <p className='text-center'>Loading...</p>;
    }

    if (error) {
        return <p className='text-center'>Error: {error}</p>;
    }


    return (
        <>
            <div className='my-16'>
                {selectedProduct ? (
                    <div>
                        <div className='max-w-6xl mx-auto'>
                            <div className='p-6 flex flex-col md:flex-row gap-10 '>
                                {/* Left Thumbnails  */}
                                <div className='hidden md:flex flex-col gap-6'>
                                    {selectedProduct.images?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url} className={`w-20 h-20 rounded-lg border-[3px] cursor-pointer ${mainImage === image.url ? 'border-black' : ''}`}
                                            alt={image.altText}
                                            onClick={() => setMainImage(image.url)}
                                        />
                                    ))}

                                </div>

                                {/* Main-Image  */}
                                <div className='md:w-1/2 px-6 py-2 md:p-0'>
                                    <img
                                        src={mainImage}
                                        draggable={false}
                                        className='rounded-lg w-full h-[90%] object-cover'
                                        alt={selectedProduct?.name}
                                    />
                                </div>

                                {/* Thumnails Mobile Version  */}
                                <div className='flex md:hidden px-6 gap-2'>
                                    {selectedProduct.images?.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            className={`w-20 h-20 rounded-lg border-[3px] cursor-pointer ${mainImage === image.url ? 'border-black' : ''}`}
                                            alt={image.altText}
                                            onClick={() => setMainImage(image.url)}
                                        />
                                    ))}
                                </div>


                                {/* Right Side  */}
                                <div className='md:w-1/2 ml-4 '>
                                    <h1 className='text-2xl'>
                                        {selectedProduct?.name}
                                    </h1>
                                    <div className='text-gray-500'>
                                        <div className='flex items-center gap-2'>
                                            <p className=' line-through text-sm'>
                                                ${selectedProduct?.originalPrice && `${selectedProduct?.originalPrice}`}
                                            </p>

                                            <p className='text-lg text-red-800 '>
                                                ${selectedProduct?.price}
                                            </p>
                                            <div className='discount-box bg-red-500 text-white text-xs  px-2 py-1 rounded-md font-sans mb-1'>
                                                {`SAVE $ ${selectedProduct?.originalPrice - selectedProduct?.price}`}
                                            </div>
                                        </div>
                                        <p>
                                            {selectedProduct?.description}
                                        </p>

                                        {/* Colors  */}
                                        <div className='my-3'>
                                            <p className='text-black'>Color: </p>
                                            <div className='space-x-2 mt-2'>
                                                {selectedProduct.colors?.map((color) => (
                                                    <button
                                                        onClick={() => setSelectedColor(color)}
                                                        key={color}
                                                        className={`p-4 border rounded-full ${selectedColor === color ? 'border-[3px] border-black' : ''}`}
                                                        style={{ backgroundColor: color, filter: "brightness(0.75)" }}
                                                    ></button>
                                                ))}
                                            </div>
                                        </div>


                                        {/* Sizes  */}
                                        <div className=''>
                                            <p className='text-black'>Size: </p>
                                            <div className='flex gap-3'>
                                                {selectedProduct.sizes?.map((size, index) => (
                                                    <button
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`border-2 rounded-md px-3 py-1 text-black tracking-widest ${selectedSize === size ? 'bg-black text-white' : ''}`}
                                                        key={index}>
                                                        {size}
                                                    </button>

                                                ))}

                                            </div>
                                        </div>

                                        {/* Quantity  */}
                                        <div className='my-3'>
                                            <p className='text-black'>Quantity: </p>
                                            <div className='space-x-3'>
                                                <button
                                                    onClick={() => handleTotalQuantity('minus')}
                                                    className='px-3 py-1 rounded-md border-2 text-xl hover:text-black transition-all duration-300'>-</button>
                                                <span className='text-lg text-black'>{totalQuantity}</span>
                                                <button
                                                    onClick={() => handleTotalQuantity('plus')}
                                                    className='px-3 py-1 rounded-md border-2 text-xl hover:text-black transition-all duration-300'>+</button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart()}
                                            disabled={isButtonDisabled}
                                            className={`bg-black text-white text-lg my-1 tracking-widest py-1 w-full rounded-sm hover:-translate-y-1 transition-all duration-300 ${isButtonDisabled ? "bg-gray-700 bg-opacity-50 cursor-not-allowed" : ""}`}>
                                            {isButtonDisabled ? "Adding..." : "Add to Cart"}
                                        </button>

                                        <div className='mt-10 '>
                                            <h3 className='text-2xl text-black'>Characteristics:</h3>
                                            <table className='p-3 mt-2 w-full text-left font-sans'>
                                                <tbody className='text-sm'>
                                                    <tr className=''>
                                                        <td>Brand</td>
                                                        <td>{selectedProduct?.brand}</td>
                                                    </tr>
                                                    <tr className=''>
                                                        <td>Material</td>
                                                        <td>{selectedProduct?.material}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>


                                        <button
                                            onClick={isARMode ? toggleARMode : openTryOnModal} // Use openTryOnModal when AR is off
                                            className={`text-white p-3 rounded-lg mt-4 ${isARMode ? 'bg-red-600' : 'bg-green-600'}`}
                                        >
                                            {isARMode ? 'Exit Live AR Try-On' : 'Virtual Try-On Options'}
                                        </button>

                                        {/* Conditionally Render the AR Viewer */}
                                        {isARMode && (
                                            <ARTryOnViewer
                                                modelUrl={productModelUrl} />
                                        )}

                                        {/* NEW: Try-On Selection Modal */}
                                        {isSelectionModalOpen && (
                                            <TryOnSelectionModal
                                                onClose={() => setIsSelectionModalOpen(false)}
                                                onSelectAR={handleSelectAR}
                                                onSelectVTON={handleSelectVTON}
                                            />
                                        )}

                                        {/* NEW: VTON Image Upload Form */}
                                        {isVtonFormVisible && (
                                            <VtonImageForm
                                                onClose={closeVtonForm}
                                                // Passes the main product image URL for the VTON background logic
                                                productImageUrl={selectedProduct.images?.[0]?.url}
                                                garmentDescription={garmentDescription}
                                            />
                                        )}

                                    </div>
                                </div>


                            </div>
                        </div>


                        <div className='md:max-w-[75%] mx-auto'>
                            <h2 className='text-center text-4xl md:text-3xl my-10'>You May Also Like</h2>
                            <ProductGrid products={similarProducts} />
                        </div>
                    </div>
                ) : (
                    <p className='text-center text-xl font-sans'>Not yet available</p>
                )}
            </div>
        </>
    )
}

export default ProductDetails





const TryOnSelectionModal = ({ onClose, onSelectAR, onSelectVTON }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg w-96'>
            <h3 className='text-xl mb-4 font-bold'>Choose Try-On Mode</h3>
            <button
                onClick={onSelectAR}
                className="bg-green-600 text-white p-3 rounded-lg w-full mb-3"
            >
                Virtual Try-On (Live AR)
            </button>
            <button
                onClick={onSelectVTON}
                className="bg-blue-600 text-white p-3 rounded-lg w-full mb-4"
            >
                Image Try-On (Upload Photo)
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-black">Close</button>
        </div>
    </div>
);

const VtonImageForm = ({ onClose, productImageUrl, garmentDescription }) => {

    const [userImage, setUserImage] = useState(null);
    const [isLoadingVTON, setIsLoadingVTON] = useState(false);
    const [vtonResultUrl, setVtonResultUrl] = useState(null);
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        console.log("User Image:", userImage)

    }, [userImage])



    // Uploads User Image to Cloudinary
    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image", file)

        try {
            setUploading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            setUserImage({ url: data.imageUrl })
            setUploading(false)

        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!userImage) {
            toast.error("Please upload your photo.");
            return;
        }

        setIsLoadingVTON(true);
        setVtonResultUrl(null);


        const vtonPayload = {
            garm_img: productImageUrl,
            human_img: userImage.url,
            garmentDescription
        }


        try {
            console.log("Simulating VTON API call...");
            await new Promise(resolve => setTimeout(resolve, 3000));

            if (userImage !== null) {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/replicate`, vtonPayload)

                const vtonImage = response?.data.result;
                setVtonResultUrl(vtonImage);
                console.log("vtonImage:", vtonImage)
            }

            toast.success("Virtual Try-On image generated!");

        } catch (error) {
            console.error("VTON API Error:", error);
            toast.error("Failed to generate VTON image.");
        } finally {
            setIsLoadingVTON(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white p-6 rounded-lg w-11/12 md:w-1/2'>
                <h3 className='text-xl mb-4 font-bold'>Image-Based Try-On</h3>

                <p className='mb-4'>Garment: <span className='font-semibold'>{garmentDescription}</span></p>

                <form onSubmit={handleFormSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 font-semibold mb-2'>Upload Your Photo:</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => handleUploadImage(e)}
                            className='w-full p-2 border rounded'
                        />
                        <p className='text-sm text-gray-500 mt-1'>Please upload a clear, full-body photo.</p>
                    </div>

                    <div className='flex justify-end gap-3'>
                        <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoadingVTON}
                            className={`p-2 rounded text-white ${isLoadingVTON ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoadingVTON ? 'Generating...' : 'Generate Try-On Image'}
                        </button>
                    </div>
                </form>

                {vtonResultUrl && (
                    <div className='mt-6 border-t pt-4'>
                        <h4 className='font-bold mb-2'>Try-On Result:</h4>
                        <img src={vtonResultUrl} alt="Virtual Try-On Result" className='w-full h-auto rounded-lg shadow-lg' />
                        <button>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};
