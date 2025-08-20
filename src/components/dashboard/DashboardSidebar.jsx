// src/components/dashboard/DashboardSidebar.jsx
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings'; // استيراد أيقونة

const DashboardSidebar = () => {
  const menuItems = [
    { text: 'نظرة عامة', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'الخدمات/المنتجات', icon: <ShoppingBagIcon />, link: '/dashboard/products' },
    { text: 'الأقسام', icon: <CategoryIcon />, link: '/dashboard/categories' },
    { text: 'المستخدمون', icon: <GroupIcon />, link: '/dashboard/users' },
    { text: 'الإعدادات', icon: <SettingsIcon />, link: '/dashboard/settings' }, // إضافة رابط الإعدادات
  ];

  return (
    
    <Paper
      elevation={2}
      sx={{
        height: { xs: 'auto', md: '100vh' },
        minHeight: { xs: 0, md: 400 },
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: { xs: 'center', md: 'stretch' },
        justifyContent: { xs: 'flex-start', md: 'flex-start' },
        gap: { xs: 1, md: 0 },
        boxSizing: 'border-box',
        overflowX: { xs: 'auto', md: 'visible' },
      }}
    >
      {/* Sidebar title only on desktop */}
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          mb: 2,
          fontWeight: 'bold',
          display: { xs: 'none', md: 'block' },
        }}
      >
        لوحة التحكم
      </Typography>
      <Divider sx={{ display: { xs: 'none', md: 'block' }, mb: { md: 1 } }} />
      <List
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: { xs: 'center', md: 'stretch' },
          width: '100%',
          p: 0,
        }}
      >
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{
              width: { xs: 'auto', md: '100%' },
              justifyContent: { xs: 'center', md: 'flex-start' },
              p: 0,
            }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.link}
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                minWidth: 0,
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: { xs: 0, md: 1 },
                  mb: { xs: 0.5, md: 0 },
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  display: { xs: 'none', md: 'block' },
                  textAlign: { md: 'right' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Divider and Home only on desktop, Home icon only on mobile */}
        <Divider sx={{ my: 1, display: { xs: 'none', md: 'block' } }} />
        <ListItem disablePadding sx={{ width: { xs: 'auto', md: '100%' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <ListItemButton component={RouterLink} to="/" sx={{ flexDirection: { xs: 'column', md: 'row' }, minWidth: 0, px: { xs: 1, md: 2 }, py: { xs: 0.5, md: 1 }, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: { xs: 0, md: 1 }, mb: { xs: 0.5, md: 0 }, display: 'flex', justifyContent: 'center' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="العودة للمتجر" sx={{ display: { xs: 'none', md: 'block' }, textAlign: { md: 'right' } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
};

export default DashboardSidebar;