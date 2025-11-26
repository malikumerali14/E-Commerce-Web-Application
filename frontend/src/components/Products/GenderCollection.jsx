import React from 'react'
import mensCollection from "../../assets/mensCollection.webp"
import womensCollection from "../../assets/womensCollection.webp"
import { Link } from 'react-router'

const GenderCollection = () => {
    return (
        <>
            <section className='py-16 px-4 lg:px-10'>
                <div className='container mx-auto flex flex-col md:flex-row gap-8'>
                    {/* Women Collection  */}
                    <div className='flex-1 relative'>
                        <img className='w-full h-[600px] object-cover' src={womensCollection} />
                        <Link to='/collection/all?gender=Women' className='absolute bottom-10 bg-gray-300 px-8 py-4 left-8 hover:cursor-pointer hover:-translate-y-1 transition-all duration-300 rounded-md'>
                            <h2 className='text-2xl'>Women's Collection</h2>
                            <p className='underline text-sm tracking-wider'>Shop Now</p>
                        </Link>

                    </div>

                    {/* Men Collection  */}
                    <div className='flex-1 relative'>
                        <img className='w-full h-[600px] object-cover' src={mensCollection} />
                        <Link to='/collection/all?gender=Men' className='absolute bottom-10 bg-gray-300 px-8 py-4 left-8 hover:cursor-pointer hover:-translate-y-1 transition-all duration-300 rounded-md'>
                            <h2 className='text-2xl'>Men's Collection</h2>
                            <p  className='underline text-sm tracking-wider'>Shop Now</p>
                        </Link>

                    </div>

                </div>

            </section>
        </>
    )
}

export default GenderCollection 
