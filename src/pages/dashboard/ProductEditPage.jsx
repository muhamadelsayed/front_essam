// client/src/pages/dashboard/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createProduct, updateProduct } from '../../store/productSlice';
import { fetchProductDetails } from '../../store/productDetailsSlice';
import { fetchCategories } from '../../store/categorySlice';
import {
  Box, TextField, Button, Typography, Grid, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel, Paper, FormControlLabel, Checkbox, Divider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

// مكون صغير لعرض معاينة الوسائط
const MediaPreview = ({ src, file }) => {
    const fileType = file ? file.type : '';
    const srcExt = typeof src === 'string' ? src.split('.').pop().toLowerCase() : '';
    const isVideo = fileType.startsWith('video/') || ['mp4', 'mov', 'avi', 'mpeg'].includes(srcExt);
    const isAudio = fileType.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(srcExt);
    const style = { width: 80, height: 80, objectFit: 'cover', borderRadius: 2, boxShadow: 1 };
    
    if (isVideo) return <video src={src} style={style} controls />;
    if (isAudio) return <audio src={src} style={{ width: 80, height: 80 }} controls />;
    return <Box component="img" src={src} sx={style} />;
};

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [executionTime, setExecutionTime] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]); // سيحتوي على كائنات File
  const [imagePreview, setImagePreview] = useState('');
  const [imagesPreview, setImagesPreview] = useState([]); // سيحتوي على كائنات للمعاينة
  const [formError, setFormError] = useState('');
  
  const { product, status: productDetailsStatus } = useSelector((state) => state.productDetails);
  const { status: productListStatus, error: productListError } = useSelector((state) => state.productList);
  const { categories } = useSelector((state) => state.categoryList);
  
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
      if (product.image) setImagePreview(`${import.meta.env.VITE_BACKEND_URL}${product.image}`);
      if (product.images?.length) {
        setImagesPreview(product.images.map(img => ({ url: `${import.meta.env.VITE_BACKEND_URL}${img}`, file: null })));
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
  
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if ((imagesFiles.length + files.length) > 10) {
      setFormError('لا يمكن رفع أكثر من 10 ملفات للمعرض.');
      return;
    }
    setFormError('');
    setImagesFiles(prev => [...prev, ...files]);
    setImagesPreview(prev => [...prev, ...files.map(file => ({ url: URL.createObjectURL(file), file }))]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormError('');
    if (!isEditMode && !imageFile) {
        setFormError('يجب رفع صورة أو مقطع رئيسي للمنتج.');
        return;
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

    // **تأكد من أن أسماء الحقول هنا تطابق تماماً ما في الواجهة الخلفية**
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (imagesFiles.length > 0) {
        imagesFiles.forEach(file => {
            formData.append('images', file);
        });
    }

    const action = isEditMode
      ? updateProduct({ productId, productData: formData })
      : createProduct(formData);
    
    dispatch(action).then((res) => {
        if (!res.error) {
            navigate('/dashboard/products');
        }
    });
  };

  if (productDetailsStatus === 'loading' && isEditMode) return <CircularProgress />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'right', mb: 3 }}>
          {isEditMode ? `تعديل: ${product?.name || ''}` : 'إنشاء منتج/خدمة جديدة'}
        </Typography>

        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        {productListError && <Alert severity="error" sx={{ mb: 2 }}>{productListError}</Alert>}

        <Box component="form" onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <TextField name="name" label="اسم المنتج/الخدمة" value={name} onChange={(e) => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />
                <TextField name="description" label="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} required sx={{ mb: 2 }} />
                <TextField name="executionTime" label="وقت التنفيذ (مثال: 3 أيام عمل)" value={executionTime} onChange={(e) => setExecutionTime(e.target.value)} fullWidth sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField name="price" label="السعر الحالي" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField name="originalPrice" label="السعر الأصلي (قبل الخصم)" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} fullWidth />
                  </Grid>
                  {!isVirtual && (
                    <Grid item xs={12}><TextField name="countInStock" label="الكمية في المخزون" type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} fullWidth required /></Grid>
                  )}
                </Grid>
                <FormControlLabel control={<Checkbox checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)} />} label="منتج افتراضي/خدمة (لا يتطلب مخزون)" sx={{ mt: 1 }} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>الوسائط</Typography>
                <Button variant="outlined" component="label" startIcon={<PhotoCamera />} fullWidth sx={{ mb: 2 }}>
                  الصورة/المقطع الرئيسي
                  <input type="file" hidden onChange={handleImageChange} accept="image/*,video/*,audio/*" />
                </Button>
                {imagePreview && ( <MediaPreview src={imagePreview} file={imageFile} /> )}
                <Divider sx={{ my: 2 }} />
                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth>
                  معرض الوسائط ({imagesPreview.length}/10)
                  <input type="file" hidden multiple onChange={handleImagesChange} accept="image/*,video/*,audio/*" />
                </Button>
                {imagesPreview.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {imagesPreview.map((preview, index) => (
                      <MediaPreview key={index} src={preview.url} file={preview.file} />
                    ))}
                  </Box>
                )}
              </Paper>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>القسم</InputLabel>
                  <Select value={category} label="القسم" onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value=""><em>بدون قسم</em></MenuItem>
                    {categories.map((cat) => ( <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem> ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button type="submit" variant="contained" size="large" disabled={productListStatus === 'loading'}>
              {productListStatus === 'loading' ? <CircularProgress size={24} /> : (isEditMode ? 'حفظ التعديلات' : 'إنشاء المنتج')}
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProductEditPage;