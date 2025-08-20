// src/components/ProductDetailsSkeleton.jsx
import { Grid, Skeleton, Box } from '@mui/material';

const ProductDetailsSkeleton = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="80%" height={60} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="30%" height={50} sx={{ mt: 2 }} />
      </Grid>
    </Grid>
  );
};

export default ProductDetailsSkeleton;