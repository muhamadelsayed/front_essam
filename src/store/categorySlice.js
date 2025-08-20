// src/store/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
};

// --- Thunks غير المتزامنة ---

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const { data } = await axios.get('/api/categories');
  return data;
});

export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData, { getState }) => {
  const { auth: { userInfo } } = getState();
  console.log(userInfo);
  
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.post('/api/categories', categoryData, config);
  return data;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, name }, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.put(`/api/categories/${id}`, { name }, config);
  return data;
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  await axios.delete(`/api/categories/${id}`, config);
  return id;
});

// --- تعريف الشريحة ---

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;