// src/pages/dashboard/DashboardPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardSummary } from '../../store/dashboardSlice';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';

// مكون لبطاقات الإحصائيات
const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
    <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { summary, status } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (status === 'loading') {
    return <CircularProgress />;
  }

  return (
    <Box dir="rtl" lang="ar">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'right' }}>
        أهلاً بك مجددًا، {userInfo?.username}!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'right' }}>
        هنا نظرة سريعة على حالة متجرك.
      </Typography>

      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4, flexDirection: 'row-reverse' }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="إجمالي المنتجات" value={summary.totalProducts} icon={<ShoppingBagIcon />} color="#2a9d8f" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="إجمالي الأقسام" value={summary.totalCategories} icon={<CategoryIcon />} color="#e9c46a" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="إجمالي المستخدمين" value={summary.totalUsers} icon={<GroupIcon />} color="#f4a261" />
        </Grid>
      </Grid>

      {/* جدول أحدث المنتجات */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'right' }}>
          أحدث المنتجات المضافة
        </Typography>
        <Table dir="rtl">
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'right' }}>اسم المنتج</TableCell>
              <TableCell align="right">السعر</TableCell>
              <TableCell align="right">تاريخ الإضافة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.latestProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell sx={{ textAlign: 'right' }}>{product.name}</TableCell>
                <TableCell align="right">${product.price}</TableCell>
                <TableCell align="right">
                  {new Date(product.createdAt).toLocaleDateString('ar-EG')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DashboardPage;