// src/pages/dashboard/CategoryListPage.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../store/categorySlice';

import {
  Box, Typography, Button, IconButton, Paper, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ====================================================================
// مكون النافذة المنبثقة (Modal) لإضافة وتعديل الأقسام
// ====================================================================
const CategoryModal = ({ open, handleClose, handleSubmit, categoryToEdit }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        // إذا كان هناك قسم للتعديل، املأ الحقل باسمه، وإلا فاجعله فارغًا
        if (categoryToEdit) {
            setName(categoryToEdit.name);
        } else {
            setName('');
        }
    }, [categoryToEdit]);

    const onSubmit = (e) => {
        e.preventDefault();
        // لا ترسل النموذج إذا كان الاسم فارغًا
        if (!name.trim()) return;
        handleSubmit({ id: categoryToEdit?._id, name });
    };
    
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{categoryToEdit ? 'تعديل القسم' : 'إضافة قسم جديد'}</DialogTitle>
            <Box component="form" onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="اسم القسم"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose}>إلغاء</Button>
                    <Button type="submit" variant="contained">
                        {categoryToEdit ? 'حفظ التعديلات' : 'إضافة'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};


// ====================================================================
// المكون الرئيسي لصفحة إدارة الأقسام
// ====================================================================
const CategoryListPage = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.categoryList);

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    // جلب الأقسام عند تحميل المكون
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (category = null) => {
    setCategoryToEdit(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleSubmitModal = ({ id, name }) => {
    if (id) {
      dispatch(updateCategory({ id, name }));
    } else {
      dispatch(createCategory({ name }));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد؟ سيتم حذف جميع المنتجات المرتبطة بهذا القسم بشكل دائم.')) {
      dispatch(deleteCategory(id));
    }
  };

  // تعريف أعمدة جدول البيانات
  const columns = [
    { 
        field: 'name', 
        headerName: 'اسم القسم', 
        flex: 1,
        minWidth: 200,
    },
    {
      field: 'createdAt',
      headerName: 'تاريخ الإنشاء',
      width: 250,
      // **الإصلاح:** استخدام renderCell لعرض التاريخ بأمان وتنسيق أفضل
      renderCell: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        return '...'; // نص مؤقت يظهر للحظة بعد الإنشاء
      }
    },
    {
      field: 'actions',
      headerName: 'إجراءات',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenModal(params.row)} aria-label="تعديل">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)} aria-label="حذف">
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];
  
  // تجهيز الصفوف للجدول، مع التأكد من أن categories هي مصفوفة
  const rows = Array.isArray(categories) ? categories.map(cat => ({ ...cat, id: cat._id })) : [];

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
          إدارة الأقسام
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          startIcon={<AddIcon />}
          sx={{ ml: 2 }}
        >
          إضافة قسم جديد
        </Button>
      </Box>
      
      {/* عرض مؤشر التحميل أو رسالة الخطأ */}
      {status === 'loading' && rows.length === 0 && <CircularProgress />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={status === 'loading'}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          components={{ Toolbar: GridToolbar }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* عرض النافذة المنبثقة عند الحاجة */}
      <CategoryModal
        open={modalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitModal}
        categoryToEdit={categoryToEdit}
      />
    </Box>
  );
};

export default CategoryListPage;