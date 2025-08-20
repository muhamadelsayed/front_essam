// src/pages/RegisterPage.jsx

import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice'; // استيراد إجراء التسجيل
import { motion } from 'framer-motion';
import { Link as MuiLink } from '@mui/material'; // <-- استيراد Link من MUI
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null); // رسالة خطأ لكلمات المرور غير المتطابقة

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // إذا نجح التسجيل، سيتم تسجيل دخول المستخدم تلقائيًا وتوجيهه
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      setMessage('كلمات المرور غير متطابقة');
    } else {
      setMessage(null);
      dispatch(register({ username, email, password }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            إنشاء حساب جديد
          </Typography>
          {message && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
          {status === 'failed' && error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error.includes("duplicate key") ? "البريد الإلكتروني أو اسم المستخدم مسجل بالفعل." : error}</Alert>}
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="اسم المستخدم"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <CircularProgress size={24} /> : 'تسجيل'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={RouterLink} to="/login" variant="body2">
                  لديك حساب بالفعل؟ سجل الدخول
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default RegisterPage;