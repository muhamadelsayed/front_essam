// src/components/dashboard/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import { Grid, Box, Paper } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';
import Footer from '../Footer';


const DashboardLayout = () => {
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'flex' },
        minHeight: '100vh',
        bgcolor: 'grey.100',
        p: { xs: 0, sm: 1, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar on top for mobile, left for desktop */}
      <Box
        sx={{
          width: { xs: '100%', md: 260 },
          flexShrink: 0,
          height: { xs: 'auto', md: '100vh' },
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          zIndex: 10,
          mb: { xs: 2, md: 0 },
        }}
      >
        <DashboardSidebar />
      </Box>
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { md: 3 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            p: { xs: 1, sm: 2, md: 3 },
            borderRadius: 2,
            flex: 1,
            minHeight: 0,
            boxSizing: 'border-box',
            overflowX: 'auto',
          }}
        >
          <Outlet />
        </Paper>
      <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;