import React from 'react'
import heroImage from '../../assets/heroImage.jpg'
import { Link } from 'react-router'
import Hero_Image from '../../assets/Hero_Image.png'
import "animate.css"

const Hero = () => {
  return (
    <>
        <section className='relative bg-black'>
          <img src={Hero_Image} className=' h-[400px] md:h-[550px] lg:h-[650px]  ' />
          <div className='  animate__animated animate__fadeInDown animate_slower absolute sm:top-28 md:top-40 font-semibold bottom-[35%] right-[20%] sm:right-[13%] md:right-[5%] md:font-extrabold sm:w-[25%] md:w-[45%] lg:w-[50%] rounded-md text-center py-1 lg:py-2 tracking-widest transition-all hover:cursor-pointer duration-300 '>
            <h1 className='text-transparent text-3xl sm:text-4xl md:text-6xl lg:text-7xl [-webkit-text-stroke:0.05px_red]'>When AR Meets Style</h1>
          </div>
          <div className='  animate__animated animate__fadeInDown animate_slower absolute md:block bottom-[25%] sm:bottom-[15%] md:bottom-[30%] lg:bottom-[40%] lg:right-[23.5%] md:right-[20%] sm:right-[18%] right-[40%] text-gray-300 bg-red-800 text-xl sm:w-28 md:w-32 lg:w-44 rounded-sm text-center py-1 lg:py-2 tracking-widest hover:-translate-y-2 transition-all hover:cursor-pointer duration-300 font-semibold  '>
            <Link to={'/collection/all'} >
              <button className='hover:text-gray-400 transition-all duration-300'>SHOP NOW</button></Link>
          </div>


        </section>
    </>
  )
}

export default Hero
