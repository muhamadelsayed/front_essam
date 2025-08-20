// src/store/mediaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  files: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  uploadStatus: 'idle', // حالة الرفع منفصلة
  error: null,
};

// --- Thunks ---
export const fetchMedia = createAsyncThunk('media/fetchMedia', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/media', config);
  return data;
});

export const uploadMedia = createAsyncThunk('media/uploadMedia', async (file, { getState }) => {
  const { auth: { userInfo } } = getState();
  const formData = new FormData();
  formData.append('file', file); // اسم الحقل يجب أن يطابق ما يتوقعه multer ('file')
  const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.post('/api/media/upload', formData, config);
  return data;
});

export const deleteMedia = createAsyncThunk('media/deleteMedia', async (id, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  await axios.delete(`/api/media/${id}`, config);
  return id;
});

// --- Slice ---
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMedia.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      // Upload
      .addCase(uploadMedia.pending, (state) => { state.uploadStatus = 'loading'; })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.files.unshift(action.payload); // إضافة الملف الجديد في بداية المصفوفة
      })
      .addCase(uploadMedia.rejected, (state, action) => { state.uploadStatus = 'failed'; state.error = action.error.message; })
      // Delete
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file._id !== action.payload);
      });
  },
});

export default mediaSlice.reducer;