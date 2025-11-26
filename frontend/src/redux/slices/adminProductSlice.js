import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`

// async function to fetch all admin products (admin only)
export const fetchAdminProducts = createAsyncThunk('adminProducts/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN,
            }
        })

        return response.data;

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})

// asycn function to create a new product (admin only)
export const createProduct = createAsyncThunk('adminProducts/createProduct', async (productData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
            headers: {
                Authorization: USER_TOKEN,
            }
        })

        return response.data;

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})


// asycn function to update an existing product (admin only)
export const updateProduct = createAsyncThunk('adminProducts/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
            headers: {
                Authorization: USER_TOKEN,
            }
        })

        return id;

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})


// asycn function to delete a product (admin only)
export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct', async ({ id }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: {
                Authorization: USER_TOKEN,
            }
        })

        return id;

    } catch (error) {
        return rejectWithValue(error.response.data)
    }

})


const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = true;
                state.products = action.payload
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            // Create product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload)
            })
            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((product) => product._id = action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload
                }

            })

            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product._id != action.payload);
            }) 

    }

})

export default adminProductSlice.reducer