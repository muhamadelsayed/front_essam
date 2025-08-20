// src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem, Box, IconButton, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };
  // **الإصلاح هنا:** بناء الرابط الكامل للشعار
  const logoFullUrl = settings.logoUrl && !settings.logoUrl.startsWith('http') 
                    ? `${import.meta.env.VITE_BACKEND_URL}${settings.logoUrl}` 
                    : settings.logoUrl;

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* عرض الشعار واسم الموقع */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            {settings.logoUrl && (
              <Box component="img" src={logoFullUrl} alt="Logo" sx={{ height: 40, mr: 2 }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {settings.siteName}
            </Typography>
          </Box>


          <Box sx={{ flexGrow: 1 }} /> {/* فاصل مرن */}
            <Button color="inherit" component={RouterLink} to="/payment-methods">طرق الدفع</Button> {/* <-- إضافة الرابط */}
            <Button color="inherit" component={RouterLink} to="/contact">تواصل معنا</Button> {/* <-- إضافة الرابط */}
            <Button color="inherit" component={RouterLink} to="/about">من نحن</Button>
            <Button color="inherit" component={RouterLink} to="/">الرئيسية</Button>
          {/* التحقق إذا كان المستخدم مسجلاً دخوله */}
          {userInfo ? (
            <div>
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : 'A'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {(userInfo.role === 'admin' || userInfo.role === 'superadmin') && (
                  <MenuItem onClick={handleDashboard}>لوحة التحكم</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
              </Menu>
            </div>
          ) : (
            <Box>
              <Button variant="outlined" component={RouterLink} to="/login" sx={{ ml: 1 }}>
                تسجيل الدخول
              </Button>
              <Button variant="contained" component={RouterLink} to="/register">
                حساب جديد
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
