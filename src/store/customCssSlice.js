// src/store/customCssSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  rules: [],
  status: 'idle',
  error: null,
};

// Thunks
export const fetchCssRules = createAsyncThunk('css/fetchAll', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/custom-css', config);
  return data;
});

export const saveCssRule = createAsyncThunk('css/save', async (ruleData, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.post('/api/custom-css', ruleData, config);
  return data;
});

export const deleteCssRule = createAsyncThunk('css/delete', async (id, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  await axios.delete(`/api/custom-css/${id}`, config);
  return id;
});

const customCssSlice = createSlice({
  name: 'customCss',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCssRules.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCssRules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rules = action.payload;
      })
      .addCase(fetchCssRules.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      .addCase(saveCssRule.fulfilled, (state, action) => {
        const existingIndex = state.rules.findIndex(rule => rule._id === action.payload._id);
        if (existingIndex >= 0) {
          state.rules[existingIndex] = action.payload;
        } else {
          state.rules.push(action.payload);
        }
      })
      .addCase(deleteCssRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter(rule => rule._id !== action.payload);
      });
  },
});

export default customCssSlice.reducer;