// src/components/Footer.jsx
import { Box, Typography, Container, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import CodeIcon from '@mui/icons-material/Code'; // أيقونة لإضافة لمسة جمالية

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSelector((state) => state.settings);
  const siteName = settings.siteName || 'متجري';

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 2, sm: 3 }, // تعديل الهوامش لتكون متجاوبة
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: '1px solid', // إضافة خط علوي رقيق
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // عمودي على الشاشات الصغيرة، أفقي على الكبيرة
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1, // مسافة بين العناصر
          }}
        >
          {/* قسم حقوق الملكية (الخاص بالموقع) */}
          <Typography variant="body2" color="text.secondary" align="center">
            {`© ${currentYear} ${siteName}. جميع الحقوق محفوظة.`}
          </Typography>
          
          {/* قسم المطور (محتوى منفصل) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CodeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Developer:
            </Typography>
            <Link
              href="https://mostaql.com/u/abdelrahman_am"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{
                fontWeight: 'medium',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              muhammed sleem
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;