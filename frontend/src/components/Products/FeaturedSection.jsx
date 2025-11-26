import React from 'react'
import { IoBagHandle } from "react-icons/io5";
import { RiRefreshLine } from "react-icons/ri";
import { MdShoppingCartCheckout } from "react-icons/md";

const FeaturedSection = () => {
    return (
        <>
            <section className='my-20 w-full md:w-[90%] mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0'>
                    <div className='flex flex-col items-center'>
                        <IoBagHandle />
                        <h3 className='tracking-wider mt-5 mb-1'>FREE INTERNATIONAL SHIPPING</h3>
                        <p className='text-[13px] text-gray-600 font-sans font-semibold '>On all orders over <span className='font-extrabold'>USD </span>99</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <RiRefreshLine />
                        <h3 className='tracking-wider mt-5 mb-1'>30 DAYS RETURN POLICY</h3>
                        <p className='text-[13px] text-gray-600 font-sans font-semibold '>Money back gurantee</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <MdShoppingCartCheckout />
                        <h3 className='tracking-wider mt-5 mb-1'>SECURE CHECKOUT</h3>
                        <p className='text-[13px] text-gray-600 font-sans font-semibold '>100% secure checkout process</p>
                    </div>

                </div>

            </section>
        </>
    )
}

export default FeaturedSection