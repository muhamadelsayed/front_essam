// src/routing/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const AdminRoute = () => {
  // 1. جلب معلومات المستخدم من مخزن Redux
  const { userInfo } = useSelector((state) => state.auth);

  // 2. التحقق من وجود المستخدم وأن دوره هو admin أو superadmin
  const isAdmin = userInfo && (userInfo.role === 'admin' || userInfo.role === 'superadmin');

  // 3. إذا كان أدمن، اسمح له بالوصول إلى الصفحات الفرعية (عبر <Outlet />)
  //    وإلا، قم بتوجيهه إلى صفحة تسجيل الدخول
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
