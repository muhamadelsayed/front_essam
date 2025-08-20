// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as MuiLink} from '@mui/material'; // <-- استيراد Link من MUI
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { motion } from 'framer-motion';
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // إذا كان المستخدم admin أو superadmin، وجهه إلى لوحة التحكم (سننشئها لاحقًا)
      if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
          navigate('/dashboard');
      } else {
          // وإلا، وجهه إلى الصفحة الرئيسية
          navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const UpdatePasswordForm = () => {
    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'كلمات المرور الجديدة غير متطابقة', type: 'error' });
            return;
        }
        dispatch(updatePassword({ oldPassword, newPassword })).then(result => {
            if(result.error) {
                 setMessage({ text: 'كلمة المرور القديمة غير صحيحة', type: 'error' });
            } else {
                 setMessage({ text: 'تم تغيير كلمة المرور بنجاح!', type: 'success' });
                 setOldPassword('');
                 setNewPassword('');
                 setConfirmPassword('');
            }
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>تغيير كلمة المرور</Typography>
            {message.text && <Alert severity={message.type} sx={{mb: 2}}>{message.text}</Alert>}
            <TextField label="كلمة المرور الحالية" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <TextField label="كلمة المرور الجديدة" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <TextField label="تأكيد كلمة المرور الجديدة" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <Button type="submit" variant="contained">حفظ كلمة المرور</Button>
        </Box>
    );
}

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            تسجيل الدخول
          </Typography>
          {status === 'failed' && error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <CircularProgress size={24} /> : 'دخول'}
            </Button>
            <Grid container>
              <Grid item xs>
                  <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
                      نسيت كلمة المرور؟
                  </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink component={RouterLink} to="/register" variant="body2">
                  ليس لديك حساب؟ سجل الآن
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default LoginPage;