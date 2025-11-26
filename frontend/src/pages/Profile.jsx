import React from 'react'
import MyOrdersPage from './MyOrdersPage'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { logout } from '../redux/slices/authSlice'
import { clearCart } from '../redux/slices/cartSlice'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
  }

  return (
    <>
      <div className='min-h-screen w-full md:w-[90%] mx-auto'>
        <div className='flex flex-col md:flex-row space-y-6 space-x-4'>
          {/* Left Section  */}
          <div className='font-sans w-full md:w-[29%] lg:1/4 shadow-lg leading-10 p-6 my-4'>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold'>{user?.name}</h1>
            <p className='font-semibold text-gray-700'>{user?.email}</p>
            <button
              onClick={handleLogout}
              className='bg-red-600 text-white sm:w-full rounded-md'>Logout</button>
          </div>

          {/* Right Section  */}
          <div className='w-full md:w-2/3 lg:w-3/4'>
            <MyOrdersPage />
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile