// src/store/store.js (النسخة المحدثة)
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import productDetailsReducer from './productDetailsSlice'; // <-- استيراد
import authReducer from './authSlice';
import categoryReducer from './categorySlice'; // <-- استيراد
import { userSliceReducer } from './userSlice'; // <-- استيراد
import settingsSliceReducer from './settingsSlice'; // <-- استيراد
import dashboardReducer from './dashboardSlice'; // <-- استيراد
import mediaReducer from './mediaSlice'; // <-- إضافة جديدة


export const store = configureStore({
  reducer: {
    productList: productReducer,
    productDetails: productDetailsReducer, // <-- إضافة
    categoryList: categoryReducer, // <-- إضافة
    auth: authReducer,
    userList: userSliceReducer, // <-- إضافة
    settings: settingsSliceReducer, // <-- إضافة
    dashboard: dashboardReducer, // <-- إضافة
    media: mediaReducer,
  },
});