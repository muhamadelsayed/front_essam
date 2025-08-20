// src/components/Footer.jsx
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSelector((state) => state.settings);
  const siteName = settings.siteName || 'متجري';

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
       
      <Typography variant="body2" color="text.secondary" align="center">
        {`${siteName} © ${currentYear}`}
      </Typography>
    </Box>
  );
};

export default Footer;