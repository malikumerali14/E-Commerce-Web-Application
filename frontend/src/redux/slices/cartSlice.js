import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get cart from localStorage
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? (JSON.parse(storedCart)) : { products: [] }

}

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk('cart/fetchCart', async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            params: { userId, guestId }
        })

    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }

})

// Add an item to the cart for user or guest
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            { productId, quantity, size, color, guestId, userId }
        )

        return response.data

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})


// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {

    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId, quantity, size, color, guestId, userId
        })
        return response.data

    } catch (error) {
        return rejectWithValue(error.response.data)
    }


})

//Remove an item from the cart 
export const removeItemFromCart = createAsyncThunk('cart/removeItemFromCart', async ({ productId, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            data: { productId, size, color, guestId, userId }
        })

        return response.data

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: loadCartFromLocalStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] }
            localStorage.removeItem("cart")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToLocalStorage(action.payload)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "Falid to fetch cart";
            })

            // Handle adding items to the cart            
            .addCase(addToCart.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToLocalStorage(action.payload)
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Falid to add item to cart";
            })

            // Handle updating cart items
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToLocalStorage(action.payload)
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Falid to update item quantity to cart";
            })

            // Handle removing items from cart
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true
                state.error = false
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToLocalStorage(action.payload)
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || "Falid to remove item from cart";
            })
    }

})


export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer