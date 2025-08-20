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
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      dispatch(deleteUser(id));
    }
  };

  const handleOpenModal = (user) => {
      setUserToEdit(user);
      setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleRoleUpdate = (id, role) => {
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
      renderCell: (params) => (
        <Box>
            {/* زر التعديل يظهر فقط للسوبر أدمن */}
            {userInfo.role === 'superadmin' && params.row.role !== 'superadmin' && (
                <IconButton onClick={() => handleOpenModal(params.row)}>
                    <EditIcon />
                </IconButton>
            )}
          {/* لا يمكن حذف السوبر أدمن أو أن يحذف الأدمن نفسه */}
          {params.row.role !== 'superadmin' && userInfo._id !== params.id && (
              <IconButton onClick={() => handleDelete(params.id)}>
                <DeleteIcon color="error" />
              </IconButton>
          )}
        </Box>
      ),
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
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={status === 'loading'}
          pageSizeOptions={[10, 25]}
          components={{ Toolbar: GridToolbar }}
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