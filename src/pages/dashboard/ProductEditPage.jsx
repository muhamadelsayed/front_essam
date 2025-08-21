// client/src/pages/dashboard/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createProduct, updateProduct } from '../../store/productSlice';
import { fetchProductDetails } from '../../store/productDetailsSlice';
import { fetchCategories } from '../../store/categorySlice';
import MediaLibraryModal from '../../components/dashboard/MediaLibraryModal'; // <-- استيراد
import {
  Box, TextField, Button, Typography, Grid, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel, Paper, FormControlLabel, Checkbox, Divider, IconButton, Tooltip
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

// مكون صغير لعرض معاينة الوسائط
const MediaPreview = ({ src, onRemove, sx }) => {
    const isVideo = /\.(mp4|mov|avi|mpeg|webm)$/i.test(src);
    const isAudio = /\.(mp3|wav|ogg|aac|flac)$/i.test(src);
    const baseStyle = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, display: 'block' };

    return (
        <Box sx={{ position: 'relative', ...sx }}>
            {isVideo ? (
                <video src={src} style={baseStyle} controls />
            ) : isAudio ? (
                <Box sx={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
                    <audio src={src} controls style={{ width: '100%' }} />
                </Box>
            ) : (
                <Box component="img" src={src} sx={baseStyle} />
            )}
            {onRemove && (
                 <IconButton size="small" onClick={onRemove} sx={{ position: 'absolute', top: 2, right: 2, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)'} }}>
                    <CloseIcon fontSize="small"/>
                </IconButton>
            )}
        </Box>
    );
};

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // حالات النموذج
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [executionTime, setExecutionTime] = useState('');
  const [formError, setFormError] = useState('');
  
  // حالات الوسائط
  const [image, setImage] = useState({ file: null, url: '' });
  const [gallery, setGallery] = useState([]);
  
  // حالات النافذة المنبثقة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null);
  
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
      if (product.image) setImage({ file: null, url: `${import.meta.env.VITE_BACKEND_URL}${product.image}` });
      if (product.images?.length) {
        setGallery(product.images.map(imgUrl => ({ file: null, url: `${import.meta.env.VITE_BACKEND_URL}${imgUrl}` })));
      }
    }
  }, [product, isEditMode]);

  const handleOpenModal = (target) => {
    setMediaTarget(target);
    setIsModalOpen(true);
  };
  
  const handleFileUpload = (e, target) => {
    const files = Array.from(e.target.files);
    if (target === 'image') {
        setImage({ file: files[0], url: URL.createObjectURL(files[0]) });
    } else {
        const newItems = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setGallery(prev => [...prev, ...newItems]);
    }
  };

  const handleMediaSelect = (selectedUrls) => {
      const formattedUrls = selectedUrls.map(url => `${import.meta.env.VITE_BACKEND_URL}${url}`);
      if (mediaTarget === 'image') {
          setImage({ file: null, url: formattedUrls[0] });
      } else {
          const newItems = formattedUrls.map(url => ({ file: null, url }));
          setGallery(prev => [...prev, ...newItems]);
      }
  };

  const handleRemoveGalleryItem = (index) => {
      setGallery(prev => prev.filter((_, i) => i !== index));
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setFormError('');
    if (!image.url && !image.file) {
        setFormError('يجب تحديد صورة أو مقطع رئيسي للمنتج.');
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

    if (image.file) {
      formData.append('image', image.file);
    } else if (image.url) {
      formData.append('existingImage', image.url.replace(`${import.meta.env.VITE_BACKEND_URL}`, ''));
    }

    const newGalleryFiles = gallery.filter(item => item.file).map(item => item.file);
    const existingGalleryUrls = gallery.filter(item => !item.file).map(item => item.url.replace(`${import.meta.env.VITE_BACKEND_URL}`, ''));
    
    newGalleryFiles.forEach(file => formData.append('images', file));
    formData.append('existingImages', JSON.stringify(existingGalleryUrls));
    
    const action = isEditMode
      ? updateProduct({ productId, productData: formData })
      : createProduct(formData);
      
    dispatch(action).then(res => !res.error && navigate('/dashboard/products'));
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
              <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>الصورة/المقطع الرئيسي</Typography>
                {image.url && <MediaPreview src={image.url} sx={{ height: 200, mb: 1 }} />}
                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth sx={{ mt: 1 }}>
                  تحميل من الجهاز
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, 'image')} accept="image/*,video/*,audio/*" />
                </Button>
                <Button variant="outlined" startIcon={<PhotoLibraryIcon />} onClick={() => handleOpenModal('image')} fullWidth sx={{ mt: 1 }}>مكتبة الوسائط</Button>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>معرض الوسائط ({gallery.length}/10)</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {gallery.map((item, index) => (
                    <Grid item xs={4} key={index}>
                      <MediaPreview src={item.url} onRemove={() => handleRemoveGalleryItem(index)} sx={{ height: 80 }} />
                    </Grid>
                  ))}
                </Grid>
                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternateIcon />} fullWidth sx={{ mt: 2 }}>
                  تحميل من الجهاز
                  <input type="file" hidden multiple onChange={(e) => handleFileUpload(e, 'gallery')} accept="image/*,video/*,audio/*" />
                </Button>
                <Button variant="outlined" startIcon={<PhotoLibraryIcon />} onClick={() => handleOpenModal('gallery')} fullWidth sx={{ mt: 1 }}>مكتبة الوسائط</Button>
              </Paper>

              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 2 }}>
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
        
        <MediaLibraryModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleMediaSelect}
            multiSelect={mediaTarget === 'gallery'}
        />
      </Box>
    </motion.div>
  );
};

export default ProductEditPage;