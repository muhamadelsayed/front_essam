// src/pages/ContactPage.jsx
import { useSelector } from 'react-redux';
import { Paper, Typography, Box, Grid, Icon, Divider, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Meta from '../components/Meta';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactInfoItem = ({ icon, text }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                direction: 'rtl' // Added RTL direction
            }}
        >
            <Icon 
                component={icon} 
                sx={{ 
                    ml: 2, // Changed from mr to ml for RTL
                    color: 'primary.main', 
                    fontSize: '2.5rem',
                    backgroundColor: 'primary.light',
                    p: 1,
                    borderRadius: '50%',
                }} 
            />
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {text}
            </Typography>
        </Box>
    </motion.div>
);

const ContactPage = () => {
  const { settings } = useSelector((state) => state.settings);

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        dir="rtl" // Added RTL direction
    >
      <Meta title={`تواصل معنا - ${settings.siteName}`} />
      <Container maxWidth="lg">
        <Paper 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                overflow: 'hidden',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
                direction: 'rtl' // Added RTL direction
            }}
        >
            <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                    fontWeight: 'bold', 
                    mb: 6, 
                    textAlign: 'right', // Changed to right alignment
                    color: 'primary.main',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                تواصل معنا
            </Typography>

            <Grid container spacing={6} alignItems="stretch" direction="row-reverse"> {/* Added row-reverse */}
                <Grid item xs={12} md={6}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3, 
                            fontWeight: 'bold',
                            color: 'secondary.main',
                            textAlign: 'right' // Added right alignment
                        }}
                    >
                        معلومات التواصل
                    </Typography>
                    <Divider sx={{ mb: 4, borderColor: 'primary.light' }} />
                    {settings.contactEmail && <ContactInfoItem icon={EmailIcon} text={settings.contactEmail} />}
                    {settings.contactPhone && <ContactInfoItem icon={PhoneIcon} text={settings.contactPhone} />}
                    {settings.contactAddress && <ContactInfoItem icon={LocationOnIcon} text={settings.contactAddress} />}
                </Grid>

                <Grid item xs={12} md={6}>
                    {settings.googleMapsUrl ? (
                        <Box
                            component="iframe"
                            src={settings.googleMapsUrl}
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: { xs: 300, md: 450 },
                                border: 0,
                                borderRadius: 4,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    ) : (
                        <Box 
                            sx={{ 
                                height: '100%',
                                minHeight: { xs: 300, md: 450 }, 
                                bgcolor: 'grey.100', 
                                borderRadius: 4, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Typography color="text.secondary">الخريطة غير متاحة حاليًا</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default ContactPage;