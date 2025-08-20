// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl', // اتجاه الموقع
  palette: {
    primary: {
      main: '#264653', // لون أساسي (أزرق مخضر غامق)
    },
    secondary: {
      main: '#2a9d8f', // لون ثانوي (أخضر فيروزي)
    },
    background: {
      default: '#f7f9fa', // لون خلفية الصفحة
    },
  },
  typography: {
    fontFamily: 'Cairo, sans-serif', // الخط الرئيسي
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
});