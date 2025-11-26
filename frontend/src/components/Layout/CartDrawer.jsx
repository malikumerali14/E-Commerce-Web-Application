import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
    const navigate = useNavigate()
    const { user, guestId } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user._id : null;


    const handleCheckout = () => {
        if (!user) {
            navigate('/login?redirect=checkout')

        } else {
            navigate('/checkout')

        }
        toggleCartDrawer()
    }

    return (
        <>
            <div className={`w-3/4 sm:w-[60%] md:w-[50%] lg:w-[30%] right-0 bg-white fixed h-full top-0 transition-all duration-300 border-l-2 z-50 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className='flex justify-between border-b-2'>
                    <div className='p-4 text-lg  tracking-wide'>
                        Shopping Bag <span className='lowercase'> (items)</span>
                    </div>
                    <button onClick={toggleCartDrawer}>
                        <IoMdClose className='w-7 h-5 mx-4 hover:text-gray-500' />
                    </button>
                </div>

                {/* Cart Items with scrolable area */}
                {/* <div className='p-6 tracking-wide'>Your cart is currently empty. </div> */}
                <div className='p-6 tracking-wide'>
                    <div className='text-xl'>Your Cart</div>
                    {cart && cart?.products?.length > 0 ? (
                        <CartContents cart={cart} userId={userId} guestId={guestId} />
                    ) : (
                        <p className='tracking-wider text-gray-600 px-4 pt-2'>Your Cart is currently empty.</p>
                    )}

                </div>

                {/* CheckOut Button  */}
                <div className='h-20 bg-white text-center absolute w-full sm:bottom-0 font-sans font-bold'>
                    {cart && cart?.products?.length > 0 && (
                        <>
                            <button
                                onClick={handleCheckout}
                                className='text-white tracking-wider rounded-sm w-[95%]  bg-black py-2 hover:-translate-y-2 transition-transform duration-300 '>
                                Checkout
                            </button>
                        </>
                    )}

                </div>

            </div>
        </>
    )
}

export default CartDrawer