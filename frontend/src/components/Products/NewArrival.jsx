import React, { useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router';
import axios from 'axios';

const NewArrival = () => {
    const scrollRef = useRef()
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const [newItems, setnewItems] = useState([])

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setnewItems(response.data)

            } catch (error) {
                console.error(error)
            }

        }

        fetchNewArrivals()

    }, [])



    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -400 : 400;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }


    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > container.scrollLeft + container.clientWidth


            setCanScrollLeft(leftScroll > 0)
            setCanScrollRight(rightScrollable)
        }


        // console.log({
        //     scrollLeft: container.scrollLeft,
        //     clientWidth: container.clientWidth,
        //     containerScrollWidth: container.scrollWidth
        // })
    }

    useEffect(() => {
        const container = scrollRef.current
        if (container) {
            container.addEventListener('scroll', updateScrollButtons)
        }

    }, [newItems])



    return (
        <>
            <section className='max-w-[95%] mx-auto px-2 py-16 md:px-0'>
                <div className='container text-center mb-10 relative leading-8'>
                    <h1 className='text-3xl tracking-wider'>New Arrivals</h1>
                    <p className='text-gray-500'>Discover the Latest Style with Prestige </p>



                    {/* Scrollable Buttons  */}
                    <div className='flex gap-2 absolute right-8 -bottom-7 '>
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`border-2 p-1 ${canScrollLeft ? '' : "bg-gray-200 text-gray-400"}`}>
                            <MdKeyboardArrowLeft className='w-6 h-6' />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className={`border-2 p-1 ${canScrollRight ? '' : "bg-gray-200 text-gray-400"}`}>
                            <MdKeyboardArrowRight className='w-6 h-6' />
                        </button>
                    </div>

                </div>


                {/* New Scrollable Articles */}
                <div ref={scrollRef} className='container flex space-x-6 overflow-x-scroll overflow-y-hidden mx-auto h-[500px]'>
                    {newItems.map((item) => (
                        <div key={item._id} className='min-w-[100%] h-full md:min-w-[50%] lg:min-w-[30%] relative border rounded-lg'>
                            <Link to={`/product/${item._id}`}>
                                <img src={item.images[0]?.url} className='w-full rounded-lg object-cover' draggable={false} />
                                <div className='absolute bottom-0 right-0 left-0  text-black backdrop-blur-md p-4 leading-4 hover:bottom-2 transition-all duration-300'>

                                    <h4 className='text-2xl'>{item.name}</h4>
                                    <p>Rs: {item.price}</p>
                                </div>
                            </Link>


                        </div>
                    ))}
                </div>



            </section>
        </>
    )
}

export default NewArrival