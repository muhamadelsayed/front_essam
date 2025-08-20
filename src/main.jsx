// src/main.jsx (النسخة المحدثة)
import "react-image-gallery/styles/css/image-gallery.css"; // <-- أضف هذا السطر
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles'; // <-- استيراد
import { theme } from './theme'; // <-- استيراد
import { store } from './store/store';
import App from './App';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}> {/* <-- تطبيق الثيم */}
        <HelmetProvider> {/* <-- إضافة المغلف */}
          <App />
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);