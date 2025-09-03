// src/pages/AboutUsPage.jsx
import { useSelector } from 'react-redux';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Meta from '../components/Meta';

const AboutUsPage = () => {
  const { settings } = useSelector((state) => state.settings);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Meta title={`من نحن - ${settings.siteName}`} />
      <Paper sx={{ p: { xs: 2, md: 4 }, direction: 'rtl' }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'right'
          }}
        >
          من نحن
        </Typography>
        <Box
          className="ql-editor"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: settings.aboutUsContent }}
          sx={{
            p: 0,
            textAlign: 'right',
            '& h1, & h2, & h3': {
              borderBottom: 'none',
              paddingBottom: '0.5em',
              marginBottom: '1em',
              textAlign: 'right'
            },
            '& p, & li': {
              lineHeight: 1.7,
              textAlign: 'right'
            },
            // Responsive images
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '70vh',
              display: 'block',
              margin: '1rem auto',
              borderRadius: 2
            }
          }}
        />
      </Paper>
    </motion.div>
  );
};

export default AboutUsPage;