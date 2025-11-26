import React from 'react'
import featured from '../../assets/featured.webp'
import { Link } from 'react-router'

const FeaturedCollection = () => {
    return (
        <>
            <section className='p-6 md:p-14 mb-8 '>
                <div className='flex flex-col-reverse md:flex-row md:h-[90vh]'>
                    {/* Left Content  */}
                    <div className='w-full md:w-1/2 flex flex-col justify-center bg-green-100 p-8 rounded-b-3xl md:rounded-none md:rounded-l-3xl'>
                        <div className=' font-sans '>
                            <p className='font-semibold'>Comfort and Style</p>
                            <h1 className='text-2xl md:text-4xl font-bold'>Apparel made for your<br /> everyday life</h1>
                            <p className='tracking-tight my-4'>Discover comfortable, high-quality clothing that effortlessly blends fashion and AR together. Designed to find the best possible outfit size.</p>
                            <Link to={'/collections/all'}>
                                <button className='hover:-translate-y-1 transition-all duration-300 px-5 py-2 mt-2 bg-black text-white rounded-md'>
                                    Shop Now
                                </button>

                            </Link>
                        </div>
                    </div>


                    {/* Right Content  */}
                    <div className='w-full md:w-1/2'>
                        <img src={featured} className='w-full h-full rounded-t-3xl md:rounded-none md:rounded-r-3xl' />

                    </div>
                </div>
            </section>
        </>
    )
}

export default FeaturedCollection