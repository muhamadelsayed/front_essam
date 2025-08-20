// src/store/productDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  product: null, // سيبدأ فارغًا ثم يحتوي على كائن المنتج
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk لجلب تفاصيل منتج واحد بناءً على الـ ID
export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchDetails',
  async (productId) => {
    const { data } = await axios.get(`/api/products/${productId}`);
    return data;
  }
);

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
        state.product = null; // تنظيف المنتج القديم عند بدء طلب جديد
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload; // تخزين المنتج الذي تم جلبه
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productDetailsSlice.reducer;