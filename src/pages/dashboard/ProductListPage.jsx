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
      width: 72,
      renderCell: (params) => {
        let url = params.value || '';
        // Remove any leading /api/uploads/ or /uploads/ to avoid double
        url = url.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');
        // smaller avatar for compact layout
        return <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/api/uploads/${url}`} variant="rounded" sx={{ width: 36, height: 36 }} />;
      },
      sortable: false,
      filterable: false,
    },
  { field: 'name', headerName: 'اسم المنتج', flex: 1, minWidth: 160 },
    // src/pages/dashboard/ProductListPage.jsx -> columns

// ... (الأعمدة الأخرى)
{
  // يمكننا تسمية الحقل بأي اسم فريد، هذا لا يؤثر على العرض
  field: 'categoryName', 
  headerName: 'القسم',
  width: 120,
  // renderCell هي الطريقة الأضمن لعرض مكونات أو قيم معقدة
  renderCell: (params) => {
    // params.row هو كائن المنتج الكامل
    // نتحقق من وجود القسم واسمه قبل عرضه
    return params.row.category ? params.row.category.name : 'N/A';
  }
},
// ... (الأعمدة الأخرى)
  { field: 'price', headerName: 'السعر', width: 100, renderCell: (params) => `$${params.value}` },
  { field: 'countInStock', headerName: 'المخزون', width: 90 },
    {
      field: 'actions',
      headerName: 'إجراءات',
  minWidth: 70,
  width: 100,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            component={RouterLink}
            to={`/dashboard/product/${params.id}/edit`}
            size="small"
            sx={{ p: 0.5 }}
            aria-label="edit"
            title="تعديل المنتج"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.id)}
            size="small"
            sx={{ p: 0.5 }}
            aria-label="delete"
            title="حذف المنتج"
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
      
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3 }}>
        {/* outer wrapper enables horizontal scrolling on small screens */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          {/* inner box sets a minWidth so columns can overflow horizontally on narrow viewports */}
          <Box sx={{ minWidth: { xs: 680, sm: 720, md: '100%' } }}>
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
              // removed checkboxSelection to save horizontal space on small screens
              disableRowSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              density="compact"
              autoHeight
              rowHeight={48}
              headerHeight={48}
              sx={{
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: 'rgba(0,0,0,0.03)',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                fontSize: { xs: '0.78rem', md: '0.95rem' },
                minWidth: 720,
                '& .MuiDataGrid-virtualScroller': {
                  // allow the internal grid scroller to scroll horizontally if needed
                  overflowX: 'auto',
                },
                '& .MuiDataGrid-cell': {
                  py: 0.5,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductListPage;