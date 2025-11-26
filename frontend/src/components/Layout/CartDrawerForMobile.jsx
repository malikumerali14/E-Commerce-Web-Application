import React from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { Link } from 'react-router';

const CartDrawerForMobile = ({ drawerOpenMobile, toggleCartDrawerForMobile }) => {
    return (
        <>
            <div className={`left-0 fixed top-0 w-3/4 sm:w-1/2 md:w-1/4 z-50 h-full bg-white transition-transform duration-300 ${drawerOpenMobile ? "translate-x-0" : "-translate-x-full"} `}>
                <div className=' flex justify-end p-4 '>
                    <button onClick={toggleCartDrawerForMobile}>
                        <IoCloseOutline className='w-7 h-8' />
                    </button>
                </div>

                <div className='px-4'>
                    <h2 className='text-2xl pb-5 font-bold tracking-wider'>Menu</h2>
                    <nav>
                        <div className='flex flex-col gap-2 text-lg tracking-wide'>
                            <Link to='/collection/all?gender=Men' onClick={toggleCartDrawerForMobile} className='hover:text-gray-700' >MEN</Link>
                            <Link to='/collection/all?gender=Women' onClick={toggleCartDrawerForMobile} className='hover:text-gray-700' >WOMEN</Link>
                            <Link to='/collection/all?category=Top Wear' onClick={toggleCartDrawerForMobile} className='hover:text-gray-700' >READY TO WEAR</Link>
                            <Link to='/collection/all?category=Bottom Wear' onClick={toggleCartDrawerForMobile} className='hover:text-gray-700' >KIDS</Link>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default CartDrawerForMobile