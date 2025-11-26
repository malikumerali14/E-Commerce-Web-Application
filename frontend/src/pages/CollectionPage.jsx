import React, { useEffect, useRef, useState, useMemo } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Layout/FilterSidebar';
import ProductGrid from '../components/Products/ProductGrid';
import SortOptions from '../components/Products/SortOptions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const CollectionPage = () => {
  const { collection } = useParams()
  const [searchParams] = useSearchParams()
  const { products, loading, error } = useSelector((state) => state.products)

  const dispatch = useDispatch()
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const sideBarRef = useRef()


  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries())
    dispatch(fetchProductsByFilters({ collection, ...queryParams }))

  }, [dispatch, collection, searchParams])


  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }


  // Close Sidebar if user clicks outside of it 
  const handleClickOutside = (e) => {
    if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
      setIsSideBarOpen(false)
    }
  }



  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])



  return (
    <>
      {/* Filter Mobile Button  */}
      <button
        onClick={toggleSideBar}
        className='border p-1 lg:hidden w-full flex justify-center items-center gap-1'>
        <FaFilter />
        <span className='font-semibold'>Filters</span>
      </button>

      <div className='font-sans flex flex-col md:flex-row'>
        {/* Filter Sidebar  */}
        <div
          className={`overflow-y-auto bg-white shadow-lg inset-y-0 w-[65%] h-full sm:w-[60%] md:w-[50%] lg:w-[15%] fixed transition-transform duration-300 left-0 top-0 z-10 ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
          ref={sideBarRef}>
          <FilterSidebar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
        </div>

        <div className='p-4 w-full font-bold flex-grow'>
          <h2 className='text-2xl md:text-3xl font-bebas-neue tracking-wider my-4 md:my-1'>
            <Link to={'/collection/all'}>ALL COLLECTION </Link>
          </h2>

          {/* Sort Options  */}
          <SortOptions />

          {/* Product Grid - Add loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <ProductGrid products={products} error={error} />
          )}
        </div>
      </div>
    </>
  )
}

export default CollectionPage