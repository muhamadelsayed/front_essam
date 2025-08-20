// src/pages/dashboard/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  createProduct,
  updateProduct,
} from '../../store/productSlice';
import { fetchProductDetails } from '../../store/productDetailsSlice';
import { fetchCategories } from '../../store/categorySlice';

import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const isEditMode = !!productId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- الحالة المحلية للنموذج ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [isVirtual, setIsVirtual] = useState(true);
  const [executionTime, setExecutionTime] = useState('');

  // --- الحالة المحلية للملفات والمعاينة ---
  const [imageFile, setImageFile] = useState(null); // الصورة الرئيسية
  const [imagesFiles, setImagesFiles] = useState([]); // صور المعرض
  const [imagePreview, setImagePreview] = useState('');
  const [imagesPreview, setImagesPreview] = useState([]);
  
  // --- حالة للأخطاء المحلية ---
  const [formError, setFormError] = useState('');
  
  // --- جلب الحالات من Redux ---
  const productDetails = useSelector((state) => state.productDetails);
  const { product, status: productDetailsStatus } = productDetails;
  
  const productList = useSelector((state) => state.productList);
  const { status: productListStatus, error: productListError } = productList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  
  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId, isEditMode]);

  useEffect(() => {
    if (isEditMode && product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setOriginalPrice(product.originalPrice || '');
      setDescription(product.description || '');
      setCategory(product.category?._id || '');
      setCountInStock(product.countInStock || '');
      setIsVirtual(product.isVirtual || false);
      setExecutionTime(product.executionTime || '');
      if (product.image) {
        setImagePreview(`${import.meta.env.VITE_BACKEND_URL}${product.image}`);
      }
      if (product.images && product.images.length > 0) {
        setImagesPreview(product.images.map(img => `${import.meta.env.VITE_BACKEND_URL}${img}`));
      }
    }
  }, [product, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // *** التحسين هنا: إضافة قيد على عدد صور المعرض ***
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 1. التحقق من العدد
    if (files.length > 5) {
      setFormError('لا يمكن رفع أكثر من 5 صور للمعرض.');
      return; // إيقاف العملية
    }
    
    // 2. التحقق من الحجم الإجمالي (اختياري لكن جيد)
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) { // 10MB
        setFormError('الحجم الإجمالي للصور يجب أن يكون أقل من 10 ميجابايت.');
        return;
    }

    setFormError(''); // مسح أي خطأ سابق
    setImagesFiles(files);
    setImagesPreview(files.map(file => URL.createObjectURL(file)));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormError(''); // مسح الأخطاء قبل الإرسال

    // *** التحسين هنا: التأكد من وجود الصورة الرئيسية في وضع الإنشاء ***
    if (!isEditMode && !imageFile) {
        setFormError('يجب رفع صورة رئيسية للمنتج.');
        return; // إيقاف العملية
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('originalPrice', originalPrice);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('countInStock', isVirtual ? 0 : countInStock);
    formData.append('isVirtual', isVirtual);
    formData.append('executionTime', executionTime);

    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (imagesFiles.length > 0) {
        imagesFiles.forEach(file => {
            formData.append('images', file);
        });
    }

    if (isEditMode) {
      dispatch(updateProduct({ productId, productData: formData })).then(() => {
        navigate('/dashboard/products');
      });
    } else {
      dispatch(createProduct(formData)).then(() => {
        navigate('/dashboard/products');
      });
    }
  };

  if (productDetailsStatus === 'loading' && isEditMode) return <CircularProgress />;


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: { xs: 'center', md: 'right' }, mb: 3 }}
        >
          {isEditMode ? `تعديل المنتج: ${product?.name || ''}` : 'إنشاء منتج جديد'}
        </Typography>

        {/* عرض الأخطاء */}
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        {productListError && <Alert severity="error" sx={{ mb: 2 }}>{productListError}</Alert>}

        <Box component="form" onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: { xs: 2, md: 0 },
                  borderRadius: 3,
                  boxShadow: { xs: 1, md: 3 },
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                }}
              >
                <TextField
                  name="name"
                  label="اسم المنتج"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  label="الوصف"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField 
                  name="executionTime"
                  label="وقت التنفيذ (مثال: 3 أيام عمل)" 
                  value={executionTime} 
                  onChange={(e) => setExecutionTime(e.target.value)} 
                  fullWidth 
                  sx={{ my: 2 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="price"
                      label="السعر الحالي (بعد الخصم)"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="originalPrice"
                      label="السعر الأصلي (قبل الخصم)"
                      helperText="اتركه فارغًا إذا لم يكن هناك خصم"
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  {!isVirtual && (
                    <Grid item xs={12}>
                      <TextField
                        name="countInStock"
                        label="الكمية في المخزون"
                        type="number"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                  )}
                </Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isVirtual}
                      onChange={(e) => setIsVirtual(e.target.checked)}
                      name="isVirtual"
                    />
                  }
                  label="منتج افتراضي / خدمة (لا يتطلب مخزون)"
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: { xs: 1, md: 3 },
                  background: 'linear-gradient(135deg, #f0f4fa 0%, #e3e9f3 100%)',
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: { xs: 'center', md: 'right' }, fontWeight: 600 }}
                >
                  الصور
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  fullWidth
                  sx={{ mb: 2, borderRadius: 2 }}
                >
                  تحميل الصورة الرئيسية
                  <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                </Button>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      mt: 2,
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                  />
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternateIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  تحميل صور المعرض (5 كحد أقصى)
                  <input type="file" hidden multiple onChange={handleImagesChange} accept="image/*" />
                </Button>
                {imagesPreview.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 2,
                      flexWrap: 'wrap',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    {imagesPreview.map((src, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={src}
                        sx={{
                          width: 70,
                          height: 70,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 1,
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  boxShadow: { xs: 1, md: 3 },
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>القسم</InputLabel>
                  <Select
                    value={category}
                    label="القسم"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>بدون قسم</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 4, px: 6, py: 1.5, borderRadius: 3, fontWeight: 600, fontSize: '1.1rem', boxShadow: 2 }}
              disabled={productListStatus === 'loading'}
            >
              {productListStatus === 'loading' ? (
                <CircularProgress size={24} />
              ) : (
                isEditMode ? 'حفظ التعديلات' : 'إنشاء المنتج'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProductEditPage;
