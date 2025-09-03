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

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { getState, rejectWithValue }) => {
  const { auth: { userInfo }, userList: { users } } = getState();

  // لا تسمح بالحذف الذاتي
  if (userInfo?._id === id) {
    return rejectWithValue('لا يمكنك حذف حسابك الشخصي.');
  }

  const target = users.find(u => u._id === id);
  if (!target) {
    return rejectWithValue('المستخدم غير موجود.');
  }

  // إذا كان المستخدم الحالي هو admin عادي فلا يسمح بحذف أي admin أو superadmin
  if (userInfo?.role === 'admin' && target.role !== 'user') {
    return rejectWithValue('بصفتك أدمن، يمكنك حذف المستخدمين العاديين فقط.');
  }

  // لا يسمح بحذف superadmin من قبل أي مستخدم (باستثناء حالة سياسات أخرى على الخادم)
  if (target.role === 'superadmin') {
    return rejectWithValue('لا يمكن حذف مستخدم من نوع superadmin.');
  }

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  await axios.delete(`/api/users/${id}`, config);
  return id;
});

export const updateUserRole = createAsyncThunk('users/updateUserRole', async ({ id, role }, { getState, rejectWithValue }) => {
    const { auth: { userInfo }, userList: { users } } = getState();

    const target = users.find(u => u._id === id);
    if (!target) {
      return rejectWithValue('المستخدم غير موجود.');
    }

    // لا يسمح بتعديل دور superadmin (بما في ذلك الذات)
    if (target.role === 'superadmin' || userInfo?._id === id) {
      return rejectWithValue('لا يمكن تعديل دور مستخدم superadmin أو دور حسابك الشخصي.');
    }

    // إذا كان المستخدم الحالي هو admin عادي فلا يسمح له بتغيير الأدوار
    if (userInfo?.role === 'admin') {
      return rejectWithValue('بصفتك أدمن، لا يمكنك تعديل أدوار المستخدمين.');
    }

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
