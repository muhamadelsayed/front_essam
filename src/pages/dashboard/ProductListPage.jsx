// src/pages/dashboard/ProductListPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../store/productSlice';

// 1. الإصلاح الأول: إضافة 'Paper' إلى قائمة الاستيراد
import { Box, Typography, Button, IconButton, Avatar, CircularProgress, Alert, Paper } from '@mui/material';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.productList);

  useEffect(() => {
    // جلب المنتجات إذا لم تكن موجودة بالفعل أو لتحديثها
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج؟')) {
      dispatch(deleteProduct(id));
    }
  };

  const columns = [
    {
      field: 'image',
      headerName: 'الصورة',
      width: 100,
      renderCell: (params) => <Avatar src={`${import.meta.env.VITE_BACKEND_URL}${params.value}`} variant="rounded" sx={{ width: 56, height: 56 }} />,
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'اسم المنتج', flex: 1, minWidth: 250 },
    // src/pages/dashboard/ProductListPage.jsx -> columns

// ... (الأعمدة الأخرى)
{
  // يمكننا تسمية الحقل بأي اسم فريد، هذا لا يؤثر على العرض
  field: 'categoryName', 
  headerName: 'القسم',
  width: 150,
  // renderCell هي الطريقة الأضمن لعرض مكونات أو قيم معقدة
  renderCell: (params) => {
    // params.row هو كائن المنتج الكامل
    // نتحقق من وجود القسم واسمه قبل عرضه
    return params.row.category ? params.row.category.name : 'N/A';
  }
},
// ... (الأعمدة الأخرى)
    { field: 'price', headerName: 'السعر', width: 120, renderCell: (params) => `$${params.value}` },
    { field: 'countInStock', headerName: 'المخزون', width: 120 },
    {
      field: 'actions',
      headerName: 'إجراءات',
      minWidth: 90,
      width: 120,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            width: '100%',
          }}
        >
          <IconButton
            component={RouterLink}
            to={`/dashboard/product/${params.id}/edit`}
            size="small"
            sx={{ p: 0.5 }}
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.id)}
            size="small"
            sx={{ p: 0.5 }}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // التأكد من أن 'products' هي مصفوفة قبل استخدامها
  const rows = Array.isArray(products) ? products.map(product => ({
      id: product._id,
      ...product
  })) : [];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: 'row-reverse',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', textAlign: 'right', flex: 1 }}
        >
          إدارة الخدمات والمنتجات
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/dashboard/product/create"
          startIcon={<AddIcon />}
          sx={{ ml: 2 }}
        >
          إضافة خدمة جديدة
        </Button>
      </Box>
      
      {status === 'loading' && rows.length === 0 && <CircularProgress />}
      {status === 'failed' && <Alert severity="error">{error}</Alert>}
      
      <Paper sx={{ height: 650, width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={status === 'loading'}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            autoHeight={false}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductListPage;