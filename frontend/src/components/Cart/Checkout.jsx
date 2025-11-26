import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { createCheckout } from '../../redux/slices/checkoutSlice'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { clearCart } from '../../redux/slices/cartSlice';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)

    const [checkoutId, setCheckoutId] = useState(null)
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",

    })

    useEffect(() => {
        console.log("CheckoutID:", checkoutId)

    }, [checkoutId])


    const handleCreateCheckOut = async (e) => {
        e.preventDefault();
        if (!cart || cart.products.length === 0) return;

        const stripe = await loadStripe('pk_test_51SEW0iIHo7nRqd1YDXJNYjYbarSgeJvOAwHGJxu9QoBjwgBvfvsXtSNLMHjyRmmT1UMSxvPxqOS4iXbcKWD0q9kL0036UAQmBZ');
        const body = {
            products: cart
        }

        const headers = {
            "Content-Type": "application/json"
        }


        try {
            const response = await dispatch(createCheckout({
                checkoutItems: cart.products,
                shippingAddress,
                paymentMethod: "Stripe",
                totalPrice: cart.totalPrice
            }));

            const newCheckout = response?.payload?.newCheckout;
            const sessionUrl = response?.payload?.url;

            if (!newCheckout?._id) throw new Error("Checkout creation failed");

            setCheckoutId(newCheckout._id);


            if (sessionUrl) {
                window.location.href = sessionUrl;

            }





        } catch (err) {
            console.error("Checkout creation failed:", err);
        }
    }

    useEffect(() => {
        if (checkoutId) {
            handlePaymentSuccess(checkoutId);
            dispatch(clearCart())

        }
    }, [checkoutId])



    const handlePaymentSuccess = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: 'paid', paymentDetails: { simulated: true } },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }

            );

            await handleFinalizeCheckout()  // Finalize checkout if payment is successful 

        } catch (error) {
            console.error(error)
        }

    }

    const handleFinalizeCheckout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            )

            navigate(`/order-confirmation?checkout_id=${response.data._id}`)

        } catch (error) {
            console.error(error)
        }
    }

    const handleMakePayment = async () => {


        if (!checkoutId) return;

        await handlePaymentSuccess()

        if (result.error) {
            console.log(result.error)
        }
    }



    if (loading) return <p>Loading cart...</p>
    if (loading) return <p>Error: {error}</p>
    if (!cart || !cart.products || cart.products.length < 0) {
        return <p>Your cart is empty.</p>

    }



    return (
        <>
            <div className='font-sans grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto p-4'>
                {/* Left Section  */}
                <div className='p-5'>
                    <h2 className='font-semibold text-2xl'>CHECKOUT</h2>
                    <div>
                        <form
                            onSubmit={handleCreateCheckOut}
                            className='mt-3 w-[90%]'>
                            <h3 className='text-[17px] font-semibold mb-3 '>Contact Details</h3>
                            <div>
                                <label className='block text-sm'>Email</label>
                                <input
                                    type='email'
                                    value={user ? user.email : ""}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                                    className='border-2 w-full px-3 py-1 bg-gray-100'

                                />
                            </div>

                            <h3 className='text-[17px] font-semibold mt-3 mb-2'>Delivery</h3>
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-sm'>First Name</label>
                                    <input
                                        type='text'
                                        value={shippingAddress.firstName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                        className='border-2 w-full px-3 py-1'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm'>Last Name</label>
                                    <input
                                        type='text'
                                        value={shippingAddress.lastName}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                        className='border-2 w-full px-3 py-1'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mt-3'>
                                <label className='block'>Address</label>
                                <input
                                    type='text'
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    className='border-2 w-full px-3 py-1'

                                />
                            </div>

                            <div className='grid grid-cols-2 gap-3 mt-3'>
                                <div>
                                    <label className='block text-sm'>City</label>
                                    <input
                                        type='text'
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        className='border-2 w-full px-3 py-1'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm'>Postal Code</label>
                                    <input
                                        type='text'
                                        value={shippingAddress.postalCode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        className='border-2 w-full px-3 py-1'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mt-3'>
                                <label className='block'>Country</label>
                                <input
                                    type='text'
                                    value={shippingAddress.country}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                    className='border-2 w-full px-3 py-1'

                                />
                            </div>

                            <div className='mt-3'>
                                <label className='block'>Phone</label>
                                <input
                                    type='tel'
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                    className='border-2 w-full px-3 py-1'

                                />
                            </div>

                            <div>
                                {!checkoutId ? (
                                    <div className='my-6 bg-black text-white  rounded-md'>
                                        <button
                                            type='submit'
                                            className=' font-semibold w-full py-2 hover:-translate-y-1 duration-300 transition-transform'>
                                            Continue to Payment
                                        </button>
                                    </div>
                                )
                                    :

                                    (
                                        <div className='mt-6 bg-[#4237d2] rounded-md cursor-pointer '>
                                            <h3
                                                onClick={handleCreateCheckOut}
                                                className='font-semibold px-3 p-2 text-white duration-300 hover:-translate-y-1'>Pay with Stripe</h3>
                                        </div>
                                    )
                                }
                            </div>

                        </form>
                    </div>


                </div>

                {/* Right Section  */}
                <div className='p-8 bg-gray-100 rounded-lg'>
                    <h3 className='font-semibold'>Order Summary</h3>

                    {cart.products.map((product, index) => (
                        <div key={index} className='border-t-2 flex justify-between my-2 py-4 '>
                            <div className='flex gap-2'>
                                <div>
                                    <img src={product.image || product.images?.[0]?.url?.url} className='w-16 h-20 object-cover' />
                                </div>
                                <div>
                                    <h3 className='font-semibold'>{product.name}</h3>
                                    <p className='text-gray-600 text-sm'>Size: {product.size}</p>
                                    <p className='text-gray-600 text-sm'>Color: {product.color}</p>
                                </div>
                            </div>

                            <div className='font-semibold'>${product.price}</div>
                        </div>

                    ))}

                    <div className='flex justify-between my-2 font-semibold border-t-2 py-4'>
                        <p>Subtotal</p>
                        <p>${cart.totalPrice}</p>
                    </div>
                    <div className='flex justify-between my-2 font-semibold'>
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Checkout