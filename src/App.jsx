// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// hooks
import { useEffect } from 'react'; // <-- استيراد
import { useDispatch } from 'react-redux'; // <-- استيراد

// استيراد الهياكل
import Layout from './components/Layout';
import DashboardLayout from './components/dashboard/DashboardLayout';

// استيراد المسارات المحمية
import AdminRoute from './routing/AdminRoute';

// استيراد الصفحات العامة
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

// استيراد صفحات لوحة التحكم
import DashboardPage from './pages/dashboard/DashboardPage';
import ProductListPage from './pages/dashboard/ProductListPage';
import ProductEditPage from './pages/dashboard/ProductEditPage';
import CategoryListPage from './pages/dashboard/CategoryListPage'; // <-- استيراد
import UserListPage from './pages/dashboard/UserListPage'; // <-- استيراد
import { fetchSettings } from './store/settingsSlice'; // <-- استيراد
import SettingsPage from './pages/dashboard/SettingsPage'; // استيراد
import AboutUsPage from './pages/AboutUsPage'; // <-- استيراد
import ContactPage from './pages/ContactPage'; // <-- استيراد
import PaymentMethodsPage from './pages/PaymentMethodsPage'; // <-- استيراد
import { Helmet } from 'react-helmet-async'; // <-- استيراد Helmet
import { useSelector } from 'react-redux';



// edit one -- re pass
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.settings);
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  
  const faviconUrl = settings?.logoUrl;
  // console.log(faviconUrl);
  return (
    <>
      <Helmet>
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
      </Helmet>

    <BrowserRouter>
      <Routes>
        {/* المسارات العامة (مع الهيكل العام) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          {/* وضعنا مسارات المصادقة هنا لتستخدم نفس الهيكل العام */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="about" element={<AboutUsPage />} /> {/* <-- إضافة المسار */}
          <Route path="contact" element={<ContactPage />} /> {/* <-- إضافة المسار */}
          <Route path="payment-methods" element={<PaymentMethodsPage />} /> {/* <-- إضافة المسار */}

        </Route>

        {/* المسارات المحمية الخاصة بلوحة التحكم (مع هيكل لوحة التحكم) */}
        {/* كل المسارات هنا محمية */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="product/create" element={<ProductEditPage />} />
            <Route path="product/:id/edit" element={<ProductEditPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;