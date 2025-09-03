// src/components/Header.jsx

import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem, Box, IconButton, Avatar, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PaymentIcon from '@mui/icons-material/Payment';
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleDashboard = () => {
    handleClose();
    navigate('/dashboard');
  };

  // **الإصلاح هنا:** بناء الرابط الكامل للشعار
  let logoFullUrl = settings.logoUrl;
  if (logoFullUrl && !logoFullUrl.startsWith('http')) {
    logoFullUrl = logoFullUrl.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');
    logoFullUrl = `${import.meta.env.VITE_BACKEND_URL}/api/uploads/${logoFullUrl}`;
  }

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, sm: 2 }, maxWidth: '100vw!important' }}>
        <Toolbar disableGutters sx={{ flexWrap: 'wrap', minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo and Site Name */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
            {settings.logoUrl && (
              <Box component="img" src={logoFullUrl} alt="Logo" sx={{ height: 40, mr: 2, maxWidth: 120, width: 'auto' }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: 120, sm: 200 } }}>
              {settings.siteName}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Navigation Buttons - full text on sm+, icons on xs */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/payment-methods">طرق الدفع</Button>
            <Button color="inherit" component={RouterLink} to="/contact">تواصل معنا</Button>
            <Button color="inherit" component={RouterLink} to="/about">من نحن</Button>
            <Button color="inherit" component={RouterLink} to="/">الرئيسية</Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
            <Tooltip title="الرئيسية" arrow>
              <IconButton color="inherit" component={RouterLink} to="/">
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="من نحن" arrow>
              <IconButton color="inherit" component={RouterLink} to="/about">
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="تواصل معنا" arrow>
              <IconButton color="inherit" component={RouterLink} to="/contact">
                <ContactMailIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="طرق الدفع" arrow>
              <IconButton color="inherit" component={RouterLink} to="/payment-methods">
                <PaymentIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {/* User menu */}
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
            <Box sx={{ ml: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
