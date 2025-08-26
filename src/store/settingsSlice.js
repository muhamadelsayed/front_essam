// src/store/settingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  settings: {
    siteName: 'متجري',
    logoUrl: '',
  },
  publicCssRules: [],
  status: 'idle',
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
  const { data } = await axios.get('/api/settings');
  return data;
});

export const updateSettings = createAsyncThunk('settings/updateSettings', async (settingsData, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const { data } = await axios.put('/api/settings', settingsData, config);
    return data;
});

export const fetchPublicCss = createAsyncThunk('settings/fetchPublicCss', async () => {
    const { data } = await axios.get('/api/custom-css/public');
    return data;
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.settings = action.payload;
      })
       .addCase(updateSettings.pending, (state) => {
          state.status = 'loading';
       })
       .addCase(fetchPublicCss.fulfilled, (state, action) => {
        state.publicCssRules = action.payload;
      });
  },
});

export default settingsSlice.reducer;