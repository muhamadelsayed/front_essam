// src/components/ProductCard.jsx
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box, // Added Box import
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // استيراد أيقونة الساعة


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const CARD_WIDTH = 320;
const CARD_HEIGHT = 420;
const IMAGE_HEIGHT = 200;

const ProductCard = ({ product }) => {
  const imageUrl = `${import.meta.env.VITE_BACKEND_URL}${product.image}`;
  return (
    <motion.div
      variants={cardVariants}
      style={{ height: '100%', width: '100%' }}
      whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: CARD_WIDTH },
          height: CARD_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 3,
          boxShadow: '0 4px 16px rgba(0,0,0,0.09)',
          transition: 'box-shadow 0.2s',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardActionArea
          component={RouterLink}
          to={`/product/${product._id}`}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            p: 0,
            height: '100%',
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: IMAGE_HEIGHT,
              objectFit: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              background: '#f5f5f5',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          />
          <CardContent
            sx={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2.5,
              gap: 1.5,
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              noWrap
              title={product.name}
              sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}
            >
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.2, mt: 1 }}>
              <Typography variant="h5" color="primary" fontWeight="bold" sx={{ fontSize: 22 }}>
                ${product.price}
              </Typography>
              {product.originalPrice && product.originalPrice > product.price && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', fontSize: 16 }}
                >
                  ${product.originalPrice}
                </Typography>
              )}
            </Box>
            {product.executionTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <AccessTimeIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {product.executionTime}
                </Typography>
              </Box>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default ProductCard;