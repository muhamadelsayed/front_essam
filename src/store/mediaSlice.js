// src/store/mediaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  files: [],
  page: 1,
  pages: 1,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// **تحديث: Thunk الآن يرسل رقم الصفحة ويستقبل بيانات الترقيم**
export const fetchMedia = createAsyncThunk('media/fetchMedia', async ({ page = 1 }, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get(`/api/media/files?page=${page}`, config);
  return data; // إرجاع الكائن الكامل { mediaFiles, page, pages }
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    // **إضافة: Reducer لإعادة تعيين الحالة عند فتح النافذة**
    resetMediaState: (state) => {
        state.files = [];
        state.page = 1;
        state.pages = 1;
        state.status = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // **تحديث: دمج النتائج الجديدة بدلاً من استبدالها**
        if (action.payload.page === 1) {
            state.files = action.payload.mediaFiles;
        } else {
            state.files = [...state.files, ...action.payload.mediaFiles];
        }
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;