import React from 'react'
import { CiFacebook } from "react-icons/ci";
import { PiInstagramLogoThin } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa";
import { SlSocialLinkedin } from "react-icons/sl";

const Footer = () => {
    return (
        <>
            <div className='bg-[#151515] text-white min-h-[75vh] mt-6'>
                {/* Footer-Top */}
                <div className='text-center py-6 border-b border-gray-700 '>
                    <h2 className='text-3xl '>Newsletter</h2>
                    <p className='my-2 text-sm tracking-wider'>Sign up for our newsletter and receive exclusive offers!</p>
                    <form>
                        <div>
                            <input
                                type='email'
                                placeholder='Enter your email'
                                required
                                className='border-l-[1px] border-y-[1px] w-[30%] rounded-l-sm px-2 py-[12px] text-sm text-white focus:outline-none bg-transparent'
                            />
                            <button className='bg-red-700 py-[11px] px-7 rounded-sm hover:bg-red-800 duration-200 '>Subscribe</button>
                        </div>
                        <div className='mt-3 flex justify-center items-center gap-2'>
                            <div>
                                <input type="checkbox" />
                            </div>
                            <p className='text-xs'>I agree to receiving marketing emails and special deals</p>
                        </div>
                    </form>
                </div>
                <div className='px-10 py-4'>
                    <div className='text-xs tracking-wider leading-7 underline'>
                        <p>Email us: help@urbanattire.com</p>
                        <p>Customer Support: 057 2700653</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-gray-300 text-sm border-b border-gray-700 pb-5'>
                        <div>
                            <h3 className='text-md my-2'>Follow Us</h3>
                            <ul className='leading-9 text-gray-300'>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        <CiFacebook className='w-5 h-7' />
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        <PiInstagramLogoThin className='w-5 h-7' />
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        <FaWhatsapp className='w-4 h-6' />
                                        Whatsapp
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        <SlSocialLinkedin className='w-4 h-6' />
                                        aedin
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-lg my-2'>Top Categories</h3>
                            <ul className='leading-7 text-gray-300'>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        
                                        Sale
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       
                                        Summer Lawn
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       
                                        Women Unstitched Premium
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       
                                        Men
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       
                                        Women
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       
                                        Ready to wear
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-lg my-2'>General</h3>
                            <ul className='leading-7 text-gray-300'>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Blogs
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Term & Condition
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-lg my-2'>Customer Care</h3>
                            <ul className='leading-7 text-gray-300'>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                        Delivery & Return
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Exchange Form
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Customer Support: 057 2700653
                                    </a>
                                </li>
                                <li>
                                    <a className='flex items-center gap-3 tracking-wider hover:-translate-y-1 transition-all duration-300' href="#" target='_blank'>
                                       Track Your Order
                                    </a>
                                </li>
                            </ul>
                        </div>
                       
                    </div>
                    <div>
                        <p className='text-xs my-3 text-gray-400 tracking-widest'>© 2025 urbanattire Pakistan, ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Footer