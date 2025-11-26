import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    })

    const [priceRange, setPriceRange] = useState([0, 100])

    const categories = ['Top Wear', 'Bottom Wear']

    const colors = [
        'Red',
        'Blue',
        'Black',
        'orange',
        'yellow',
        'gray',
        'white',
        'beige',
        'pink',
        'navy'
    ]

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

    const material = ['Cotton', 'Wool', 'Denim', 'Silk', 'Linen', 'Viscose']

    const brands = ['Urban Threads', 'Modern Fit', 'Fashionista', 'ChicStyle', 'Outfitters', 'Edenrobe']

    const genders = ['Men', 'Women']

    useEffect(() => {
        const params = Object.fromEntries([...searchParams])

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        })

        setPriceRange([0, params.maxPrice || 100])

    }, [])



    // Function to handle filter changes 
    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters }

        if (type == 'checkbox') {
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value]
            } else {
                newFilters[name] = newFilters[name].filter((item) => item != value)
            }

        } else {
            newFilters[name] = value
        }

        setFilters(newFilters)
        updateURLParams(newFilters)
    }

    // Function to Update URL 
    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams()

        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(','))
            } else if (newFilters[key]) {
                params.append(key, newFilters[key])
            }
        })

        setSearchParams(params)
        navigate(`?${params.toString()}`)

    }

    //Price Change Function
    const handlePriceChange = (e) => {
        const newPrice = e.target.value
        setPriceRange([0, newPrice])
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice }
        setFilters(newFilters)
        updateURLParams(newFilters)

    }


    return (
        <>
            <div className='p-3'>
                <h3 className='text-lg font-semibold'>Filter</h3>

                {/* Category Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Category</label>
                    {categories.map((category) => (
                        <div
                            key={category}
                            className='flex items-center gap-2 mt-1'>
                            <input
                                type='radio'
                                name='category'
                                value={category}
                                onChange={handleFilterChange}
                                checked={filters.category === category}
                                className='text-orange-500 focus:ring-blue-500 h-4 w-4'
                            />
                            <span className='text-sm'>{category}</span>
                        </div>

                    ))}

                </div>

                {/* Gender Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Gender</label>
                    {genders.map((gender) => (
                        <div
                            key={gender}
                            className='flex items-center gap-2 mt-1'>
                            <input
                                value={gender}
                                onChange={handleFilterChange}
                                checked={filters.gender === gender}
                                type='radio' name='gender' className='text-orange-500 focus:ring-blue-500 h-4 w-4' />
                            <span className='text-sm'>{gender}</span>
                        </div>

                    ))}

                </div>

                {/* Color Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Color</label>
                    <div className='flex flex-wrap gap-2'>
                        {colors.map((color) => (
                            <button
                                key={color}
                                value={color}
                                onClick={handleFilterChange}
                                style={{ backgroundColor: color.toLowerCase() }}
                                className={`h-8 w-8 border border-gray-300 rounded-full hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-700" : ""}`}></button>

                        ))}
                    </div>

                </div>

                {/* Size Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Size</label>
                    {sizes.map((size) => (
                        <div
                            key={size}
                            className='flex items-center gap-2 mt-2'>
                            <input
                                type='checkbox'
                                name='size'
                                value={size}
                                onChange={handleFilterChange}
                                checked={filters.size.includes(size)}
                                className='h-4 w-4 focus:ring-blue-600 text-blue-500' />
                            <span className='text-sm text-gray-700'>{size}</span>
                        </div>

                    ))}

                </div>
                {/* Material Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Material</label>
                    {material.map((material) => (
                        <div
                            key={material}
                            className='flex items-center gap-2 mt-2'>
                            <input
                                type='checkbox'
                                name='material'
                                value={material}
                                onChange={handleFilterChange}
                                checked={filters.material.includes(material)}
                                className='h-4 w-4 focus:ring-blue-600 text-blue-500' />
                            <span className='text-sm text-gray-700'>{material}</span>
                        </div>

                    ))}

                </div>
                {/* Brand Filter */}
                <div className='mt-3 text-gray-700 font-medium'>
                    <label className='text-sm block mb-2'>Brand</label>
                    {brands.map((brand) => (
                        <div
                            key={brand}
                            className='flex items-center gap-2 mt-2'>
                            <input
                                type='checkbox'
                                name='brand'
                                value={brand}
                                checked={filters.brand.includes(brand)}
                                onChange={handleFilterChange}
                                className='h-4 w-4 focus:ring-blue-600 text-blue-500' />
                            <span className='text-sm text-gray-700'>{brand}</span>
                        </div>

                    ))}

                </div>

                {/* Price Range Filter  */}
                <div className='mt-8 text-gray-700 font-medium'>
                    <label className='mb-1'>Price Range</label>
                    <input
                        type='range'
                        name='priceRange'
                        min={0}
                        max={100}
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className='appearance-none cursor-pointer bg-gray-300 rounded-full h-2 w-full'
                    />

                    <div className='flex justify-between'>
                        <span>0</span>
                        <span>${priceRange[1]}</span>
                    </div>

                </div>

            </div>
        </>
    )
}

export default FilterSidebar