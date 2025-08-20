// src/pages/ProductDetailsPage.jsx
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // استيراد أيقونة الساعة

import { fetchProductDetails } from '../store/productDetailsSlice';
import ProductDetailsSkeleton from '../components/ProductDetailsSkeleton';
import Message from '../components/Message';
import { 
  Grid, 
  Typography, 
  Box, 
  Chip, 
  Divider, 
  Breadcrumbs, 
  Link as MuiLink, 
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Enhanced responsive image styles for gallery
const getGalleryImageStyle = (theme) => ({
  width: '100%',
  maxWidth: {
    xs: '280px',
    sm: '350px',
    md: '450px',
    lg: '500px'
  },
  height: 'auto',
  aspectRatio: '1 / 1',
  objectFit: 'cover',
  borderRadius: {
    xs: '12px',
    sm: '15px',
    md: '18px'
  },
  boxShadow: {
    xs: '0 4px 16px rgba(0,0,0,0.1)',
    sm: '0 6px 20px rgba(0,0,0,0.12)',
    md: '0 6px 24px rgba(0,0,0,0.13)'
  },
  backgroundColor: '#fff',
  display: 'block',
  margin: '0 auto',
  transition: 'transform 0.3s ease',
});

const getGalleryThumbStyle = (theme) => ({
  width: {
    xs: '60px',
    sm: '70px',
    md: '80px'
  },
  height: {
    xs: '60px',
    sm: '70px',
    md: '80px'
  },
  objectFit: 'cover',
  borderRadius: {
    xs: '8px',
    sm: '9px',
    md: '10px'
  },
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  backgroundColor: '#f8f8f8',
  border: '2px solid #e0e0e0',
  display: 'block',
  cursor: 'pointer',
  transition: 'border 0.2s, box-shadow 0.2s',
});

// Responsive arrow buttons for gallery
const getArrowButtonStyle = (theme) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.95) 100%)',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: {
    xs: '8px',
    sm: '10px',
    md: '12px'
  },
  boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
  width: {
    xs: 40,
    sm: 45,
    md: 50
  },
  height: {
    xs: 40,
    sm: 45,
    md: 50
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'absolute',
  top: '40%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
});

const getArrowIconStyle = (theme) => ({
  fontSize: {
    xs: 16,
    sm: 18,
    md: 20
  },
  fontWeight: 'bold',
  color: '#333',
  transition: 'all 0.2s ease',
});

const createArrowButton = (direction, theme, isMobile) => (onClick, disabled) => {
  const baseStyle = {
    ...getArrowButtonStyle(theme),
    [direction]: isMobile ? 5 : 10,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  return (
    <button
      type="button"
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'السابق' : 'التالي'}
      onMouseEnter={(e) => {
        if (!disabled && !isMobile) {
          const translateX = direction === 'left' ? '-3px' : '3px';
          e.currentTarget.style.transform = `translateY(-50%) translateX(${translateX}) scale(1.1)`;
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(42,157,143,0.9) 0%, rgba(38,70,83,0.9) 100%)';
          e.currentTarget.children[0].style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isMobile) {
          e.currentTarget.style.transform = 'translateY(-50%) translateX(0) scale(1)';
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.95) 100%)';
          e.currentTarget.children[0].style.color = '#333';
        }
      }}
    >
      <span style={getArrowIconStyle(theme)}>
        {direction === 'left' ? '❮' : '❯'}
      </span>
    </button>
  );
};

// Enhanced responsive page animations
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.98
  },
  in: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  out: { 
    opacity: 0, 
    y: -20,
    scale: 0.98
  }
};

const getPageTransition = (isMobile) => ({
  type: "tween",
  ease: "anticipate",
  duration: isMobile ? 0.3 : 0.5
});

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { id: productId } = useParams();
  const { product, status, error } = useSelector((state) => state.productDetails);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  const imagesForGallery = useMemo(() => {
    if (!product) return [];
    const allImages = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));
    return allImages.map(img => ({
      original: `${import.meta.env.VITE_BACKEND_URL}${img}`,
      thumbnail: `${import.meta.env.VITE_BACKEND_URL}${img}`,
    }));
  }, [product]);

  // Responsive render functions
  const renderLeftNav = createArrowButton('left', theme, isMobile);
  const renderRightNav = createArrowButton('right', theme, isMobile);

  const renderResponsiveItem = (item) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <Box
        component="img"
        src={item.original}
        alt="صورة المنتج"
        sx={{
          ...getGalleryImageStyle(theme),
          '&:hover': !isMobile ? {
            transform: 'scale(1.03)'
          } : {}
        }}
      />
    </Box>
  );

  const renderResponsiveThumb = (item) => (
    <Box
      component="img"
      src={item.thumbnail}
      alt="صورة مصغرة"
      sx={getGalleryThumbStyle(theme)}
    />
  );

  if (status === 'loading') {
    return <ProductDetailsSkeleton />;
  }

  if (status === 'failed') {
    return <Message variant="danger">{error}</Message>;
  }

  if (!product) {
    return <Message>المنتج غير موجود</Message>;
  }

  // Responsive breadcrumbs
  const breadcrumbs = (
    <Breadcrumbs 
      aria-label="breadcrumb" 
      sx={{ 
        mb: { xs: 1, sm: 2 },
        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' }
      }}
    >
      <MuiLink 
        component={RouterLink} 
        underline="hover" 
        color="inherit" 
        to="/"
        sx={{ fontSize: 'inherit' }}
      >
        الرئيسية
      </MuiLink>
      {product?.category && (
        <MuiLink
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={`/?category=${product.category._id}`}
          sx={{ fontSize: 'inherit' }}
        >
          {product.category.name}
        </MuiLink>
      )}
      <Typography 
        color="text.primary" 
        sx={{ 
          fontSize: 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: isMobile ? 'nowrap' : 'normal',
          maxWidth: isMobile ? '150px' : 'none'
        }}
      >
        {product?.name}
      </Typography>
    </Breadcrumbs>
  );

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={getPageTransition(isMobile)}
    >
      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        py: { xs: 1, sm: 2 },
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {breadcrumbs}
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
          {/* Image Gallery Section */}
          <Grid 
            item 
            xs={12} 
            md={7}
            lg={8}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: { 
                xs: 250, 
                sm: 350, 
                md: 450, 
                lg: 520 
              },
              px: { xs: 0.5, sm: 1, md: 2 }
            }}
          >
            <Box sx={{ 
              width: '100%',
              maxWidth: { xs: '100%', sm: '90%', md: '95%', lg: '100%' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <ImageGallery
                items={imagesForGallery}
                showPlayButton={false}
                showFullscreenButton={!isMobile}
                thumbnailPosition="bottom"
                isRTL={true}
                slideDuration={isMobile ? 300 : 450}
                slideInterval={4000}
                renderItem={renderResponsiveItem}
                renderThumbInner={renderResponsiveThumb}
                renderLeftNav={renderLeftNav}
                renderRightNav={renderRightNav}
                showThumbnails={!isMobile || imagesForGallery.length > 1}
                showNav={imagesForGallery.length > 1}
              />
            </Box>
          </Grid>

          {/* Product Details Section */}
          <Grid 
            item 
            xs={12} 
            md={5}
            lg={4}
            sx={{ 
              px: { xs: 1, sm: 2, md: 1 },
              mt: { xs: 2, md: 0 }
            }}
          >
            <Box sx={{ 
              position: 'sticky',
              top: { md: 20, lg: 40 },
              pb: 2
            }}>
              {/* Product Title */}
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontSize: { 
                    xs: '1.4rem', 
                    sm: '1.8rem', 
                    md: '2.1rem',
                    lg: '2.5rem'
                  },
                  fontWeight: { xs: 600, md: 700 },
                  lineHeight: { xs: 1.3, sm: 1.4, md: 1.2 },
                  mb: { xs: 1, sm: 2 }
                }}
              >
                {product.name}
              </Typography>

              {/* Category Chip */}
              {product.category && (
                <Chip 
                  label={product.category.name} 
                  color="primary" 
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                  }} 
                />
              )}

              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

              {/* Product Description */}
              <Typography 
                variant="body1" 
                paragraph
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                  color: 'text.secondary',
                  mb: { xs: 2, sm: 3 }
                }}
              >
                {product.description}
              </Typography>
              {/* Execution Time */}
              {product.executionTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1.5 }} />
                        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>وقت التنفيذ:</Typography>
                        <Typography variant="body1">{product.executionTime}</Typography>
                    </Box>
                )}
              <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

              {/* Price Section */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }, 
                my: { xs: 2, sm: 3 }
              }}>
                <Typography 
                  variant="h4" 
                  component="p" 
                  color="text.primary" 
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
                  }}
                >
                  ${product.price}
                </Typography>

                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <Typography 
                      variant="h5" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'line-through',
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                    
                    <Badge
                      badgeContent={`خصم ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                          padding: { xs: '0 4px', sm: '0 6px' },
                          minWidth: { xs: 'auto', sm: '20px' }
                        }
                      }}
                    />
                  </>
                )}
              </Box>

              {/* Stock Information */}
              {!product.isVirtual && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.875rem' },
                    p: { xs: 1, sm: 1.5 },
                    bgcolor: 'grey.50',
                    borderRadius: { xs: 1, sm: 1.5 },
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  متوفر في المخزون: {product.countInStock} قطعة
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default ProductDetailsPage;