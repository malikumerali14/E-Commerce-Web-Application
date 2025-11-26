import React, { useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router';

const AdminLayout = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }

  return (
    <>
      <div className='min-h-screen flex'>
        <div>
          {/* Mobile Sidebar Toggle Button  */}
          <div className='md:hidden fixed w-full flex items-center gap-2 bg-black p-2'>
            <button
              onClick={toggleSideBar}
              className='block'>
              <RxHamburgerMenu className='text-white' size={22} />
            </button>
            <h1 className='text-white font-bold font-sans tracking-wide'>
              Admin Dashboard
            </h1>
          </div>

          {/* Mobile Sidebar Overlay  */}
          {isSideBarOpen && (
            <div
              onClick={toggleSideBar}
              className='fixed bg-black bg-opacity-50 inset-0 md:hidden '>
            </div>

          )}

          {/* Sidebar  */}
          <div className={`md:block inset-y-0 min-h-full z-50 bg-gray-900 text-white w-64 transition-transform duration-300 ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
            <AdminSidebar />
          </div>


        </div>
        <main className='w-full'>
          <Outlet />
        </main>
      </div>

    </>
  )
}

export default AdminLayout