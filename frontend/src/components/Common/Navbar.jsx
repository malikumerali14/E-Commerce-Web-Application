import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CiUser } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMenuOutline } from "react-icons/io5";
import CartDrawerForMobile from '../Layout/CartDrawerForMobile';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerOpenMobile, setDrawerOpenMobile] = useState(false)
    const navigate = useNavigate()
    const { cart } = useSelector((state) => state.cart)
    const {user} = useSelector((state) => state.auth)


    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0

    const handleTransition = (e) => {
        e.preventDefault()
        const body = document.querySelector('body')

        body?.classList.add("page-transition")

        setTimeout(() => {
            navigate('/login')
            body?.classList.remove("page-transition")

        }, 250);

    }

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const toggleCartDrawerForMobile = () => {
        setDrawerOpenMobile(!drawerOpenMobile)
    }

    return (
        <>
            <nav className='flex justify-between items-center px-7 py-1 mx-4 mt-4 mb-2 border-b-[2px]'>
                <Link to={'/'} className='flex font-semibold text-2xl'>Urban Attire</Link>
                <div className='hidden sm:flex gap-6 text-lg'>
                    <Link to='/collection/all?gender=Men' className='hover:text-gray-700 hover:-translate-y-1 transition-all duration-300' >MEN</Link>
                    <Link to='/collection/all?gender=Women' className='hover:text-gray-700 hover:-translate-y-1 transition-all duration-300' >WOMEN</Link>
                    <Link to='/collection/all?category=Top Wear' className='hover:text-gray-700 hover:-translate-y-1 transition-all duration-300' >READY TO WEAR</Link>
                    <Link to='/collection/all?category=Bottom Wear' className='hover:text-gray-700 hover:-translate-y-1 transition-all duration-300' >KIDS</Link>
                </div>

                <div className='flex gap-3 items-center'>
                    {user && user.role == 'admin' && (
                        <Link to={'/admin'} className='block mt-1 text-white bg-black px-2 rounded tracking-widest hover:-translate-y-1 duration-300 transition-transform'>admin</Link>

                    )}

                    <button
                        onClick={toggleCartDrawer}
                        className='hover:text-orange relative'>
                        <HiOutlineShoppingBag className='w-7 h-7' />
                        {cartItemCount > 0 && (
                            <span className='absolute top-0 -right-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs'>
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    <SearchBar />

                    <Link
                        onClick={handleTransition}
                        className='hidden sm:block hover:text-orange'>
                        <CiUser className='w-8 h-7' />
                    </Link>

                    <button
                        onClick={toggleCartDrawerForMobile}
                        className='sm:hidden'>
                        <IoMenuOutline className='w-8 h-7' />
                    </button>

                </div>

            </nav>
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
            <CartDrawerForMobile drawerOpenMobile={drawerOpenMobile} toggleCartDrawerForMobile={toggleCartDrawerForMobile} />
        </>
    )
}

export default Navbar