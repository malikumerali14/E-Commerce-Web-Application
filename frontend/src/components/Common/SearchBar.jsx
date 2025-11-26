import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from 'react-redux'
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice';
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearchToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(setFilters({ search: searchTerm }))
        dispatch(fetchProductsByFilters({ search: searchTerm }))
        navigate(`/collection/all?search=${searchTerm}`)
        setIsOpen(false)
    }

    return (
        <div className={` ${isOpen ? "w-full absolute left-0 transition-all duration-300 top-10 h-24 z-50 bg-white flex justify-center items-center" : ""}`}>
            {
                isOpen ? (
                    <>
                        <form
                            onSubmit={handleSearch}
                            className='w-full relative flex justify-center items-center'>
                            <div className='relative w-1/2 flex'>
                                <input
                                    placeholder='Search'
                                    type='text'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='focus:outline-none bg-gray-200 px-4 py-2 pr-12 rounded-lg w-full placeholder:text-gray-700' />
                                <button
                                    type='submit'
                                >
                                    <CiSearch className='w-8 h-7 -translate-x-10' />
                                </button>
                            </div>

                            <button onClick={handleSearchToggle} className='-translate-x-4'>
                                <IoMdClose className='h-8 w-7' />
                            </button>
                        </form>
                    </>
                ) : (
                    <button onClick={handleSearchToggle}>
                        <CiSearch className='w-8 h-7 mt-2' />
                    </button>
                )
            }
        </div>
    )
}

export default SearchBar