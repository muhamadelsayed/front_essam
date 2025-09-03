// src/pages/PaymentMethodsPage.jsx

import { useSelector, useDispatch } from 'react-redux';
import { Paper, Typography, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Meta from '../components/Meta';

// استيراد الإجراء لجلب الإعدادات إذا لم تكن موجودة
import { fetchSettings } from '../store/settingsSlice';

const PaymentMethodsPage = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.settings);
  
  // استخدام قيمة افتراضية آمنة في حال كانت settings غير موجودة مؤقتًا
  const paymentMethods = settings?.paymentMethods || [];

  useEffect(() => {
    // جلب الإعدادات فقط إذا لم تكن موجودة بالفعل في الحالة
    if (!settings) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Meta title={`طرق الدفع - ${settings?.siteName || 'المتجر'}`} />
      <Paper sx={{ p: { xs: 2, md: 4 }, overflow: 'hidden' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          طرق الدفع المتاحة
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => {
              // --- **الإصلاح الرئيسي هنا: بناء الرابط الكامل للصورة** ---
              // نتحقق من وجود رابط للصورة وأنه ليس رابط معاينة محلي (blob:)
              let imageUrl = method.imageUrl;
              if (imageUrl && !imageUrl.startsWith('blob:')) {
                // Remove any leading /api/uploads/ or /uploads/ to avoid double
                imageUrl = imageUrl.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');
                imageUrl = `${import.meta.env.VITE_API_BASE_URL}/api/uploads/${imageUrl}`;
              }

              return (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {method.imageUrl && (
                        <CardMedia
                          component="img"
                          height="160"
                          // استخدام الرابط الكامل الذي قمنا ببنائه
                          image={imageUrl}
                          alt={method.title}
                          sx={{ objectFit: 'contain', p: 2 }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                          {method.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              );
            })
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                <Typography>لا توجد طرق دفع محددة حاليًا.</Typography>
            </Box>
          )}
        </Grid>
      </Paper>
    </motion.div>
  );
};

export default PaymentMethodsPage;