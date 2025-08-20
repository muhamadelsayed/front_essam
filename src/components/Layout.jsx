// src/components/Layout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Outlet />
          </div>
        </AnimatePresence>
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;