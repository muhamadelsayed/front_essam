// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { resetPassword, clearAuthState } from '../store/authSlice';
import { Box, TextField, Button, Typography, Container, Paper, Alert, CircularProgress } from '@mui/material';

const ResetPasswordPage = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setMessage('كلمات المرور غير متطابقة');
        return;
    }
    setMessage('');
    dispatch(resetPassword({ token, password })).then((result) => {
        if (!result.error) {
            alert('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
            navigate('/login');
        }
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            إعادة تعيين كلمة المرور
          </Typography>
          
          {message && <Alert severity="warning" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
          {status === 'failed' && error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1, width: '100%' }}>
            <TextField margin="normal" required fullWidth label="الرمز" value={token} onChange={(e) => setToken(e.target.value)} />
            <TextField margin="normal" required fullWidth label="كلمة المرور الجديدة" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField margin="normal" required fullWidth label="تأكيد كلمة المرور الجديدة" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={status === 'loading'}>
              {status === 'loading' ? <CircularProgress size={24} /> : 'حفظ كلمة المرور'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default ResetPasswordPage;