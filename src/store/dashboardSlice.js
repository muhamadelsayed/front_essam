// src/store/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  summary: {
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    latestProducts: [],
  },
  status: 'idle',
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchSummary', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/stats/summary', config);
  return data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;