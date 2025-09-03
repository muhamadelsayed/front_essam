// src/pages/dashboard/UserListPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUserRole } from '../../store/userSlice';

import {
  Box, Typography, IconButton, Paper, CircularProgress, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

// =======================================
// Modal لتعديل دور المستخدم
// =======================================
const UserEditModal = ({ open, handleClose, user, handleSubmit }) => {
    const [role, setRole] = useState('');
    useEffect(() => {
        if (user) setRole(user.role);
    }, [user]);

    const onSubmit = () => handleSubmit(user._id, role);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>تعديل دور المستخدم</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>تعديل دور: <strong>{user?.username}</strong></Typography>
                <FormControl fullWidth sx={{mt: 2}}>
                    <InputLabel>الدور</InputLabel>
                    <Select value={role} label="الدور" onChange={(e) => setRole(e.target.value)}>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إلغاء</Button>
                <Button onClick={onSubmit} variant="contained">حفظ</Button>
            </DialogActions>
        </Dialog>
    );
};


// =======================================
// المكون الرئيسي للصفحة
// =======================================
const UserListPage = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.userList);
  const { userInfo } = useSelector((state) => state.auth); // للحصول على دور الأدمن الحالي

  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    const target = users.find(u => u._id === id);
    // منع الحذف الذاتي
    if (userInfo?._id === id) {
      window.alert('لا يمكنك حذف حسابك الشخصي.');
      return;
    }

    // إذا كان المستخدم الحالي هو admin عادي فلا يسمح بحذف أي admin أو superadmin
    if (userInfo?.role === 'admin' && target && target.role !== 'user') {
      window.alert('بصفتك أدمن، يمكنك حذف المستخدمين العاديين فقط.');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      dispatch(deleteUser(id));
    }
  };

  const handleOpenModal = (user) => {
    // تحقق من الأذونات قبل الفتح
    // لا يسمح لأي شخص بتعديل دور مستخدم من نوع superadmin
    if (user.role === 'superadmin') {
      window.alert('لا يمكن تعديل دور مستخدم من نوع superadmin.');
      return;
    }

    // إذا كان المستخدم الحالي هو admin عادي، لا يسمح له بتعديل الأدوار
    if (userInfo?.role === 'admin') {
      window.alert('بصفتك أدمن، لا يمكنك تعديل أدوار المستخدمين.');
      return;
    }

    // لا يسمح للمستخدم بتعديل دوره الخاص (لا يمكن تخفيض superadmin نفسه)
    if (userInfo?._id === user._id) {
      window.alert('لا يمكنك تعديل دور حسابك الخاص.');
      return;
    }

    setUserToEdit(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleRoleUpdate = (id, role) => {
    const target = users.find(u => u._id === id);

    // زوج من الحمايات في حال تم تجاوز الواجهة
    if (!target) return;

    // لا يسمح بتعديل دور superadmin (بما في ذلك الذات)
    if (target.role === 'superadmin' || userInfo?._id === id) {
      window.alert('لا يمكن تعديل دور مستخدم superadmin أو دور حسابك الشخصي.');
      handleCloseModal();
      return;
    }

    // إذا كان المستخدم الحالي هو admin عادي فلا يسمح بتغيير الأدوار
    if (userInfo?.role === 'admin') {
      window.alert('بصفتك أدمن، لا يمكنك تعديل أدوار المستخدمين.');
      handleCloseModal();
      return;
    }

    // كل الضوابط تجاوزت، ننفذ الطلب
    dispatch(updateUserRole({id, role}));
    handleCloseModal();
  };
  
  const columns = [
    { field: 'username', headerName: 'اسم المستخدم', flex: 1 },
    { field: 'email', headerName: 'البريد الإلكتروني', flex: 1 },
    {
      field: 'role',
      headerName: 'الدور',
      width: 150,
      renderCell: (params) => (
        <Chip 
            icon={params.value === 'admin' || params.value === 'superadmin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
            label={params.value}
            color={params.value === 'admin' || params.value === 'superadmin' ? 'primary' : 'default'}
            size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'إجراءات',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const target = params.row;
        const isSelf = userInfo?._id === target._id;
        const canEdit = userInfo?.role === 'superadmin' && target.role !== 'superadmin' && !isSelf;
        const canDelete = (
          // superadmin can delete anyone except themselves and other superadmins
          (userInfo?.role === 'superadmin' && !isSelf && target.role !== 'superadmin')
          // normal admin can only delete regular users
          || (userInfo?.role === 'admin' && target.role === 'user' && !isSelf)
        );

        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              onClick={() => canEdit && handleOpenModal(target)}
              title={canEdit ? "تعديل المستخدم" : "غير مسموح"}
              disabled={!canEdit}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => canDelete && handleDelete(params.id)}
              title={canDelete ? "حذف المستخدم" : "غير مسموح"}
              disabled={!canDelete}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  
  const rows = users.map(user => ({ ...user, id: user._id }));

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
          إدارة المستخدمين
        </Typography>
      </Box>
      
      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      <Paper sx={{ height: { xs: 400, md: 600 }, width: '100%', overflow: 'auto', borderRadius: 3, boxShadow: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={status === 'loading'}
          pageSizeOptions={[10, 25]}
          components={{ Toolbar: GridToolbar }}
          disableRowSelectionOnClick
          density="compact"
          sx={{
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: 'rgba(0,0,0,0.03)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
            fontSize: { xs: '0.85rem', md: '1rem' },
            minWidth: 360,
          }}
          autoHeight={false}
        />
      </Paper>

      {userToEdit && (
        <UserEditModal 
            open={modalOpen}
            handleClose={handleCloseModal}
            user={userToEdit}
            handleSubmit={handleRoleUpdate}
        />
      )}
    </Box>
  );
};

export default UserListPage;