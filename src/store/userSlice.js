// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

// --- Thunks ---
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/users', config);
  return data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  await axios.delete(`/api/users/${id}`, config);
  return id;
});

export const updateUserRole = createAsyncThunk('users/updateUserRole', async ({ id, role }, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    const { data } = await axios.put(`/api/users/${id}`, { role }, config);
    return data;
});

// --- Slice ---
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
          const index = state.users.findIndex(user => user._id === action.payload._id);
          if (index !== -1) {
              state.users[index] = action.payload;
          }
      });
  },
});

export const userSliceReducer = userSlice.reducer;
