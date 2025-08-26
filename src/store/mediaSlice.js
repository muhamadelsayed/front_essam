// src/store/mediaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  files: [],
  page: 1,
  pages: 1,
  status: 'idle',
  error: null,
};

export const fetchMedia = createAsyncThunk('media/fetchMedia', async ({ page = 1 }, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get(`/api/media/files?page=${page}`, config);
  return data;
});

// --- **إضافة جديدة: Thunk لحذف ملف وسائط** ---
export const deleteMediaFile = createAsyncThunk(
  'media/deleteFile',
  async (filename, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    // استخدام encodeURIComponent لضمان أن أسماء الملفات التي تحتوي على رموز خاصة تعمل بشكل صحيح
    await axios.delete(`/api/media/files/${encodeURIComponent(filename)}`, config);
    
    // إرجاع اسم الملف المحذوف لتحديث الحالة
    return filename;
  }
);
// --- **نهاية الإضافة** ---

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
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
      // حالات fetchMedia
      .addCase(fetchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
      })
      // --- **إضافة جديدة: حالات deleteMediaFile** ---
      .addCase(deleteMediaFile.fulfilled, (state, action) => {
        // حذف الملف من الحالة المحلية بدون الحاجة لإعادة تحميل
        state.files = state.files.filter(file => file.fileName !== action.payload);
      })
      .addCase(deleteMediaFile.rejected, (state, action) => {
        // يمكنك هنا عرض رسالة خطأ للمستخدم إذا أردت
        console.error("Failed to delete media file:", action.error.message);
        state.error = "فشل في حذف الملف.";
      });
      // --- **نهاية الإضافة** ---
  },
});

export const { resetMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;