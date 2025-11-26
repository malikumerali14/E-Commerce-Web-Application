import React from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrival from '../components/Products/NewArrival'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturedSection from '../components/Products/FeaturedSection'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import axios from 'axios'


const Home = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [bestSellerProduct, setbestSellerProduct] = useState(null)


  useEffect(() => {
    // Fetching products for a specific collection
    dispatch(fetchProductsByFilters({
      gender: "Women",
      category: 'Bottom Wear',
      limit: 8
    }));


    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
        setbestSellerProduct(response.data)

      } catch (error) {
        console.error(error)
      }

    }

    fetchBestSeller()

  }, [dispatch])


  // useEffect(() => {
  //   console.log(products)
  // }, [products])


  return (
    <>
      <Hero />
      <GenderCollection />
      <NewArrival />


      <h2 className='text-4xl text-center my-6'>Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct[0]._id} />
      ) : (
        <p className='text-center'>Loading best seller product...</p>
      )}

      <div className='my-20 md:max-w-[90%] mx-auto'>
        <h2 className='text-4xl md:text-3xl text-center tracking-wide my-10'>Wears for Women</h2>
        {products ? (
          <ProductGrid products={products} loading={loading} error={error} />
        ) : (
          <p className='text-center'>Loading products...</p>
        )}

      </div>

      <FeaturedCollection />
      <FeaturedSection />
    </>
  )
}

export default Home