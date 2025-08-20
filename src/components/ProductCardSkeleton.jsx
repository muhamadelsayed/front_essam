// src/components/ProductCardSkeleton.jsx
import { Card, CardContent, Skeleton } from '@mui/material';

const ProductCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" width="60%" height={28} />
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;