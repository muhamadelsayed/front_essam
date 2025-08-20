// src/pages/ForgotPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { forgotPassword, clearAuthState } from '../store/authSlice';
import { Box, TextField, Button, Typography, Container, Paper, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // <-- استيراد

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((result) => {
        if (!result.error) {
            setMessage('تم إرسال الرمز بنجاح. تحقق من بريدك الإلكتروني.');
        }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            نسيت كلمة المرور
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>
            أدخل بريدك الإلكتروني وسنرسل لك رمزًا لإعادة التعيين.
          </Typography>
          
          {/* **التعديل هنا: إظهار رسالة ورابط بعد النجاح** */}
          {message && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {message}
              <br />
              <MuiLink component={RouterLink} to="/reset-password" variant="body2" sx={{ fontWeight: 'bold' }}>
                انقر هنا لإدخال الرمز
              </MuiLink>
            </Alert>
          )}

          {status === 'failed' && error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // إخفاء الحقل بعد إرسال الرمز بنجاح
              disabled={!!message}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={status === 'loading' || !!message}>
              {status === 'loading' ? <CircularProgress size={24} /> : 'إرسال الرمز'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default ForgotPasswordPage;