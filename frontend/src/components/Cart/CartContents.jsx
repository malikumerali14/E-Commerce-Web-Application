import React from 'react'
import { IoMdColorFill } from 'react-icons/io'
import { IoTrashBinOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';


const CartContents = ({ userId, guestId, cart }) => {
  const dispatch = useDispatch()


  const handleAddToCart = (productId, delta, quantity, size, color) => {
    console.log("True to be")
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity, size, color, guestId, userId }))
    }

  }

  const handleRemoveItemCart = (productId, size, color) => {
    dispatch(removeItemFromCart({ productId, userId, guestId, size, color }))

  }

  return (
    <>
      <div>
        {cart?.products?.length > 0 && (
          cart.products.map((product, index) => (
            <div key={index} className='flex justify-between mt-6'>
              <div className='flex gap-3 border-b'>
                <img src={product.image} className='w-20 h-24 mb-3' />
                <div>
                  <p>{product.name}</p>
                  <p className='text-sm'>Size: {product.size} | color: {product.color}</p>

                  <div className=' mt-2'>
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          -1,
                          product.quantity,
                          product.size,
                          product.color)}
                      className='px-2 border-2 rounded text-xl '>-</button>
                    <span className='mx-3'>{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          1,
                          product.quantity,
                          product.size,
                          product.color)}
                      className='px-2 border-2 rounded text-xl '>+</button>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-center'>
                <p>${product.price}</p>
                <button onClick={() => handleRemoveItemCart(product.productId, product.color, product.size)}>
                  <IoTrashBinOutline className='text-red-800 w-6 h-8' />
                </button> 
              </div>

            </div>
          )

          )
        )}
      </div>
    </>
  )
}

export default CartContents