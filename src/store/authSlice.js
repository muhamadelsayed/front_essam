// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// جلب معلومات المستخدم من localStorage إذا كانت موجودة
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  const { data } = await axios.post('/api/users/login', { email, password }, config);
  localStorage.setItem('userInfo', JSON.stringify(data));
  return data;
});

export const register = createAsyncThunk('auth/register', async ({ username, email, password }) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users/register', { username, email, password }, config);
    // تسجيل الدخول مباشرة بعد التسجيل
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
});
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users/forgotpassword', { email }, config);
    return data;
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.put('/api/users/resetpassword', { token, password }, config);
    return data;
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async ({ oldPassword, newPassword }, { getState }) => {
    const { auth: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };
    const { data } = await axios.put('/api/users/updatepassword', { oldPassword, newPassword }, config);
    return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
    clearAuthState: (state) => {
            state.status = 'idle';
            state.error = null;
        }
  },
  extraReducers: (builder) => {
    builder
      // حالات الـ Login
      .addCase(login.pending, (state) => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // حالات الـ Register
      .addCase(register.pending, (state) => { state.status = 'loading'; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});



export const { logout , clearAuthState } = authSlice.actions;
export default authSlice.reducer;