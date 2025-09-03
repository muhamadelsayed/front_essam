// src/pages/ProductDetailsPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { fetchProductDetails } from '../store/productDetailsSlice';
import ProductDetailsSkeleton from '../components/ProductDetailsSkeleton';
import Message from '../components/Message';
import {
  Grid, Typography, Box, Chip, Divider, Breadcrumbs, Link as MuiLink,
  Badge, useTheme, useMediaQuery, IconButton, Tooltip, Card, CardContent
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// ====================================================================
// الدوال المساعدة للمعرض (النسخة المحدثة)
// ====================================================================

// **التعديل الرئيسي هنا: دالة عرض موحدة لجميع أنواع الوسائط**
const renderMedia = (item) => {
    const url = item.original;
    const isVideo = /\.(mp4|mov|avi|mpeg|webm)$/i.test(url);
    const isAudio = /\.(mp3|wav|ogg|aac|flac)$/i.test(url);

    // أنماط موحدة للفيديو والصور لضمان ملء الحاوية
    const mediaStyles = {
        width: '100%',
        height: '100%',
        objectFit: 'contain', // أهم خاصية لضمان ظهور المحتوى كاملاً
        borderRadius: '18px',
    };

    return (
        <div className="image-gallery-image">
            <Box sx={{
                width: '100%',
                height: '100%',
                maxHeight: { xs: '50vh', sm: '60vh', md: '70vh' },
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f2f5',
                borderRadius: '24px',
                overflow: 'hidden'
            }}>
                {isVideo ? (
                    <video
                        src={url}
                        controls
                        style={mediaStyles}
                        preload="metadata"
                        playsInline
                    >
                        عذراً، المتصفح لا يدعم تشغيل هذا الفيديو.
                    </video>
                ) : isAudio ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <AudiotrackIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}/>
                        <audio src={url} controls style={{ width: '100%' }} />
                    </Box>
                ) : (
                    <img src={url} alt={item.originalAlt} style={mediaStyles} />
                )}
            </Box>
        </div>
    );
};


// دالة مخصصة ومحسنة لعرض الصور المصغرة
const renderCustomThumb = (item) => {
    const url = item.thumbnail;
    const isVideo = /\.(mp4|mov|avi|mpeg|webm)$/i.test(url);
    const isAudio = /\.(mp3|wav|ogg|aac|flac)$/i.test(url);
    const thumbnailUrl = isAudio ? item.mainImageThumbnail : item.thumbnail;

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <img className="image-gallery-thumbnail-image" src={thumbnailUrl} alt={item.thumbnailAlt} />
            {(isVideo || isAudio) && (
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                }}>
                    {isVideo ? <PlayCircleOutlineIcon /> : <AudiotrackIcon />}
                </Box>
            )}
        </Box>
    );
};

// باقي الدوال المساعدة والأنماط بدون تغيير
const createArrowButton = (direction, isMobile) => (onClick, disabled) => {
    return ( <motion.button type="button" onClick={onClick} disabled={disabled} whileHover={!disabled ? { scale: 1.1, x: direction === 'left' ? -3 : 3 } : {}} whileTap={!disabled ? { scale: 0.95 } : {}} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer', position: 'absolute', top: '50%', [direction]: isMobile ? 8 : 16, transform: 'translateY(-50%)', zIndex: 10, backdropFilter: 'blur(10px)', opacity: disabled ? 0.4 : 1, transition: 'all 0.3s' }}> <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 'bold', color: '#333' }}> {direction === 'left' ? '❮' : '❯'} </span> </motion.button> );
};
const pageVariants = { initial: { opacity: 0, y: 40 }, in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], staggerChildren: 0.1 } }, out: { opacity: 0, y: -20, transition: { duration: 0.4 } } };
const childVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } } };

// ====================================================================
// المكون الرئيسي للصفحة
// ====================================================================
const ProductDetailsPage = () => {
    const dispatch = useDispatch();
    const { id: productId } = useParams();
    const { product, status, error } = useSelector((state) => state.productDetails);
    const [isFavorite, setIsFavorite] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (productId) dispatch(fetchProductDetails(productId));
    }, [dispatch, productId]);

    const galleryItems = useMemo(() => {
        if (!product) return [];
        const allMedia = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));
        // Ensure all product images have /api/uploads/ in the URL
        const getFullUrl = (mediaUrl) => {
            let url = mediaUrl || '';
            // Remove any leading /api/uploads/ or /uploads/ to avoid double
            url = url.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');
            return `${import.meta.env.VITE_BACKEND_URL}/api/uploads/${url}`;
        };
        const mainImageThumbnail = getFullUrl(product.image);

        return allMedia.map(mediaUrl => {
            const fullUrl = getFullUrl(mediaUrl);
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fullUrl);
            const item = { original: fullUrl, thumbnail: isImage ? fullUrl : mainImageThumbnail, mainImageThumbnail, originalAlt: product.name, thumbnailAlt: product.name };
            item.renderThumbInner = () => renderCustomThumb(item);
            return item;
        });
    }, [product]);

    if (status === 'loading') return <ProductDetailsSkeleton />;
    if (status === 'failed') return <Message variant="danger">{error}</Message>;
    if (!product) return <Message>المنتج غير موجود</Message>;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product.name, text: product.description, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // يمكنك إضافة تنبيه هنا لإعلام المستخدم بالنسخ
        }
    };
    
    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
            <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 }, maxWidth: '1600px', margin: '0 auto' }}>
                <motion.div variants={childVariants}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                        <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">الرئيسية</MuiLink>
                        {product?.category && <MuiLink component={RouterLink} underline="hover" color="inherit" to={`/?category=${product.category._id}`}>{product.category.name}</MuiLink>}
                        <Typography color="text.primary">{product?.name}</Typography>
                    </Breadcrumbs>
                </motion.div>
                
                <Grid container spacing={{ xs: 3, md: 5 }}>
                    <Grid item xs={12} md={7} lg={8}>
                        <motion.div variants={childVariants}>
                            <ImageGallery
                                items={galleryItems}
                                renderItem={renderMedia} // استخدام دالة العرض الموحدة
                                showPlayButton={false}
                                showFullscreenButton={!isMobile}
                                thumbnailPosition="bottom"
                                isRTL={true}
                                renderLeftNav={createArrowButton('left', isMobile)}
                                renderRightNav={createArrowButton('right', isMobile)}
                                showThumbnails={galleryItems.length > 1}
                                showNav={galleryItems.length > 1}
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} md={5} lg={4}>
                        <motion.div variants={childVariants}>
                            <Card elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.1)' }}>
                                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                        <Tooltip title="إضافة للمفضلة"><IconButton onClick={() => setIsFavorite(!isFavorite)}>{isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}</IconButton></Tooltip>
                                        <Tooltip title="مشاركة"><IconButton onClick={handleShare}><ShareIcon /></IconButton></Tooltip>
                                    </Box>
                                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 800 }}>{product.name}</Typography>
                                    {product.category && <Chip label={product.category.name} color="primary" sx={{ mb: 3, fontWeight: 'bold' }} />}
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8, color: 'text.secondary', mb: 3 }}>{product.description}</Typography>
                                    {product.executionTime && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                                            <AccessTimeIcon color="primary" sx={{ mr: 1.5 }} />
                                            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>وقت التنفيذ:</Typography>
                                            <Typography variant="body1">{product.executionTime}</Typography>
                                        </Box>
                                    )}
                                    <Divider sx={{ my: 3 }} />
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, my: 3 }}>
                                        <Typography variant="h4" component="p" color="primary.main" fontWeight="bold">${product.price}</Typography>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <Badge badgeContent={`خصم ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`} color="error">
                                                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>${product.originalPrice}</Typography>
                                            </Badge>
                                        )}
                                    </Box>
                                    {!product.isVirtual && ( <Typography variant="body2" sx={{ p: 1.5, bgcolor: 'action.selected', borderRadius: 1, textAlign: 'center' }}> متوفر في المخزون: {product.countInStock} قطعة </Typography> )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};

export default ProductDetailsPage;