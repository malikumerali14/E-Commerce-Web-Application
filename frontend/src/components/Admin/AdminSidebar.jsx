import React from 'react'
import { IoMenuOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore } from "react-icons/fa";
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { clearCart } from '../../redux/slices/cartSlice'

const AdminSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
    }

    return (
        <div className='p-6 font-sans space-y-2 min-h-screen'>

            <div className='mb-4'>
                <Link to={'/'} className='font-bebas-neue tracking-wider text-2xl'>
                    Urban Attire
                </Link>
            </div>
            <div className='flex gap-1 items-center px-4'>
                <p>Admin Dashboard</p>
            </div>

            <nav className='flex flex-col justify-center'>
                <NavLink
                    to={'/admin/users'}
                    className={({ isActive }) => isActive ? "flex bg-gray-700 text-white py-3 px-4 rounded items-center gap-3" : "flex text-gray-300 gap-3 py-3 px-4 rounded items-center"}
                >
                    <CiUser size={22} />
                    <span>Users</span>
                </NavLink>
                <NavLink
                    to={'/admin/products'}
                    className={({ isActive }) => isActive ? "flex bg-gray-700 text-white py-3 px-4 rounded items-center gap-3" : "flex text-gray-300 gap-3 py-3 px-4 rounded items-center"}
                >
                    <FaBoxOpen size={20} />
                    <span>Products</span>
                </NavLink>
                <NavLink
                    to={'/admin/orders'}
                    className={({ isActive }) => isActive ? "flex bg-gray-700 text-white py-3 px-4 rounded items-center gap-3" : "flex text-gray-300 gap-3 py-3 px-4 rounded items-center"}
                >
                    <FaClipboardList size={20} />
                    <span>Orders</span>
                </NavLink>
                <NavLink
                    to={'/admin/shop'}
                    className={({ isActive }) => isActive ? "flex bg-gray-700 text-white py-3 px-4 rounded items-center gap-3" : "flex text-gray-300 gap-3 py-3 px-4 rounded items-center"}
                >
                    <FaStore size={20} />
                    <span>Shop</span>
                </NavLink>

            </nav>

            <div>
                <button
                    onClick={handleLogout}
                    className='flex gap-2 mt-6 bg-red-700 text-white w-full justify-center items-center rounded-sm px-2 py-1 hover:bg-red-800 transition-colors '>
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar