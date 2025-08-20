// src/store/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  page: 1,
  pages: 1,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts',
  async ({ pageNumber = 1, keyword = '', category = '', price_gte = '', price_lte = '' } = {}) => {
    let url = `/api/products?pageNumber=${pageNumber}`;
    if (keyword) url += `&keyword=${keyword}`;
    if (category) url += `&category=${category}`;
    if (price_gte) url += `&price_gte=${price_gte}`;
    if (price_lte) url += `&price_lte=${price_lte}`;
    
    const { data } = await axios.get(url);
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { getState }) => {
    // هذا الجزء هو المهم: جلب التوكن من حالة المصادقة
    const { auth: { userInfo } } = getState();
    console.log(userInfo);

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/products/${productId}`, config);
    return productId;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post('/api/products', productData, config);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData }, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/products/${productId}`, productData, config);
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;