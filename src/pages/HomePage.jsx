// src/pages/HomePage.jsx

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';

// --- الإجراءات والمكونات ---
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Message from '../components/Message';

// --- مكونات وأيقونات MUI ---
import {
    Grid, Typography, Box, TextField, Pagination, Slider, Button, Paper,
    InputAdornment, Chip, Skeleton, Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

import Meta from '../components/Meta';


// ====================================================================
// إعدادات الحركة (Animation)
// ====================================================================
const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
};
const pageTransition = { duration: 0.5 };
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// ====================================================================
// مكون نافذة الفلاتر المتقدمة
// ====================================================================
const AdvancedFiltersModal = ({ open, onClose, onApply, initialPriceRange }) => {
    const [priceRange, setPriceRange] = useState(initialPriceRange);
    
    const handleApply = () => onApply({ price_gte: priceRange[0], price_lte: priceRange[1] === 1000 ? '' : priceRange[1] });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                فلاتر متقدمة
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography gutterBottom sx={{ fontWeight: 500 }}>السعر</Typography>
                        <Paper variant="outlined" sx={{ px: 1.5, py: 0.5, borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                ${priceRange[0]} - ${priceRange[1]}{priceRange[1] === 1000 ? '+' : ''}
                            </Typography>
                        </Paper>
                    </Box>
                    <Slider value={priceRange} onChange={(e, newValue) => setPriceRange(newValue)} valueLabelDisplay="auto" min={0} max={1000} step={50} />
                    <Button variant="contained" fullWidth onClick={handleApply} sx={{ mt: 2 }}>تطبيق</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

// ====================================================================
// المكون الرئيسي للصفحة الرئيسية (تصميم جديد)
// ====================================================================
const HomePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- جلب البيانات من Redux ---
  const { products, page, pages, status, error } = useSelector((state) => state.productList);
  const { categories, status: categoryStatus } = useSelector((state) => state.categoryList);

  // --- الحالة المحلية ---
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    price_gte: searchParams.get('price_gte') || '',
    price_lte: searchParams.get('price_lte') || '',
  });

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setFilters({ keyword: '', category: '', price_gte: '', price_lte: '' });
    setSearchParams({});
  };
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedKeyword = useDebounce(filters.keyword, 500);

  // --- تحميل البيانات ---
  const loadProducts = useCallback((pageNumber = 1) => {
    const params = {
      pageNumber,
      keyword: debouncedKeyword,
      category: filters.category,
      price_gte: filters.price_gte,
      price_lte: filters.price_lte,
    };
    dispatch(fetchProducts(params));
    // تحديث رابط الصفحة
    setSearchParams(Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== '')));
  }, [dispatch, debouncedKeyword, filters.category, filters.price_gte, filters.price_lte, setSearchParams]);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  // --- معالجات الأحداث ---
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  const handleAdvancedFilterApply = (priceFilters) => {
      setFilters(prev => ({ ...prev, ...priceFilters }));
      setModalOpen(false);
  };
  
  const handlePageChange = (event, value) => { loadProducts(value); };

  return (
    <>
      <Meta title="الصفحة الرئيسية" description="مرحبًا بكم في متجرنا" keywords="متجر, إلكترونيات, ملابس" />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', width: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} dir="rtl" lang="ar" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 1. منطقة العنوان والفلاتر */}
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, mb: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>استكشف مجموعتنا</Typography>
            <Typography color="text.secondary">اعثر على أفضل الخدمات التي تناسب احتياجاتك</Typography>
          </Box>
          <Button onClick={handleResetFilters} variant="outlined" color="secondary" sx={{ minWidth: 140, fontWeight: 500, borderRadius: 2, boxShadow: 1 }}>
            إعادة تعيين الفلاتر
          </Button>
        </Box>

        {/* --- الفلاتر الأفقية --- */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="ابحث بالاسم، الوصف، أو القسم..."
              size="medium"
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: '#f7f7fa' }
              }}
              sx={{ borderRadius: 2, bgcolor: '#f7f7fa' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: 1 }}>
              <Chip label="الكل" onClick={() => handleFilterChange('category', '')} color={!filters.category ? 'primary' : 'default'} clickable sx={{ fontWeight: 500, px: 2, borderRadius: 2 }} />
              {categoryStatus === 'loading' ? (
                <Skeleton variant="rounded" width={80} height={32} />
              ) : (
                categories.map((cat) => (
                  <Chip key={cat._id} label={cat.name} onClick={() => handleFilterChange('category', cat._id)} color={filters.category === cat._id ? 'primary' : 'default'} clickable sx={{ fontWeight: 500, px: 2, borderRadius: 2 }} />
                ))
              )}
              <Button variant="contained" size="small" onClick={() => setModalOpen(true)} startIcon={<TuneIcon />} sx={{ flexShrink: 0, ml: 'auto', borderRadius: 2, fontWeight: 500, bgcolor: 'primary.light', color: 'primary.main', boxShadow: 1 }}>
                السعر
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. منطقة عرض المنتجات */}
      <motion.div layout variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {status === 'loading' && Array.from(new Array(8)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ProductCardSkeleton />
            </Grid>
          ))}
          {status === 'succeeded' && products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* 3. منطقة الرسائل والترقيم */}
      {status === 'failed' && <Message variant="danger">{error}</Message>}
      {status === 'succeeded' && products.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">لا توجد منتجات تطابق بحثك</Typography>
          <Typography color="text.secondary">حاول تغيير الفلاتر.</Typography>
        </Box>
      )}
      {pages > 1 && status === 'succeeded' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, py: 2 }}>
          <Pagination count={pages} page={page} onChange={handlePageChange} color="primary" size="large" />
        </Box>
      )}

      {/* 4. النافذة المنبثقة للفلاتر المتقدمة */}
      <AdvancedFiltersModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={handleAdvancedFilterApply}
        initialPriceRange={[
            Number(filters.price_gte) || 0,
            Number(filters.price_lte) || 1000
        ]}
      />
        </motion.div>
      </Box>
    </>
  );
};

HomePage.defaultProps = {
  dir: 'rtl',
  lang: 'ar'
};

export default HomePage;