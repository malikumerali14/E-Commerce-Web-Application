import React from 'react'
import { useSearchParams } from 'react-router'

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy)
    setSearchParams(searchParams)
  }


  
  return (
    <>
      <div className='flex justify-end items-center'>
        <select
          id='sort'
          onChange={handleSortChange}
          value={searchParams.get('sortBy') || ""}
          className='border text-sm p-1 focus:outline-none'>
          <option value="">Default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="popularity">Popularity</option>

        </select>
      </div>
    </>
  )
}

export default SortOptions