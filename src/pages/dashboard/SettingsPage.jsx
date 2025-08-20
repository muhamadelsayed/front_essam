// src/pages/dashboard/SettingsPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../../store/settingsSlice';
import { updatePassword } from '../../store/authSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// --- استيراد محرر النصوص Tiptap ---
import TiptapEditor from '../../components/editor/TiptapEditor';

const SettingsPage = () => {
  const dispatch = useDispatch();

  // --- جلب الحالات من Redux ---
  const { settings, status, error } = useSelector((state) => state.settings);
  const authState = useSelector((state) => state.auth);

  // --- الحالات المحلية ---
  const [siteName, setSiteName] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [aboutUsContent, setAboutUsContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([{ title: '', description: '', imageUrl: '' }]);
  const [paymentMethodFiles, setPaymentMethodFiles] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || '');
      if (settings.logoUrl) {
        setLogoPreview(`${import.meta.env.VITE_API_BASE_URL}${settings.logoUrl}`);
      } else {
        setLogoPreview('');
      }
      setAboutUsContent(settings.aboutUsContent || '');
      setContactEmail(settings.contactEmail || '');
      setContactPhone(settings.contactPhone || '');
      setContactAddress(settings.contactAddress || '');
      setGoogleMapsUrl(settings.googleMapsUrl || '');
      
      const methodsWithFullUrls = (settings.paymentMethods || []).map(method => ({
          ...method,
          imageUrl: method.imageUrl ? `${import.meta.env.VITE_API_BASE_URL}${method.imageUrl}` : ''
      }));

      setPaymentMethods(methodsWithFullUrls.length > 0 ? methodsWithFullUrls : [{ title: '', description: '', imageUrl: '' }]);
    }
  }, [settings]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setSettingsSuccess(false);
    }
  };

  const handlePaymentMethodChange = (index, field, value) => {
    const newMethods = [...paymentMethods];
    newMethods[index][field] = value;
    setPaymentMethods(newMethods);
  };
  
  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { title: '', description: '', imageUrl: '' }]);
  };
  
  const removePaymentMethod = (index) => {
    const newMethods = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(newMethods);
    const newFiles = { ...paymentMethodFiles };
    delete newFiles[index];
    setPaymentMethodFiles(newFiles);
  };
  
  const handlePaymentImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentMethodFiles(prev => ({ ...prev, [index]: file }));
      const newMethods = [...paymentMethods];
      newMethods[index].imageUrl = URL.createObjectURL(file);
      setPaymentMethods(newMethods);
    }
  };

    const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('siteName', siteName);
    formData.append('aboutUsContent', aboutUsContent);
    formData.append('contactEmail', contactEmail);
    formData.append('contactPhone', contactPhone);
    formData.append('contactAddress', contactAddress);
    formData.append('googleMapsUrl', googleMapsUrl);
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    let imageUploadIndexCounter = 0;
    const processedPaymentMethods = paymentMethods.map((method, index) => {
        const file = paymentMethodFiles[index];
        const { imageUrl, ...restOfMethod } = method; // إزالة رابط المعاينة المؤقت
        
        if (file) {
            formData.append('paymentMethodImages', file);
            return { ...restOfMethod, imageUploadIndex: imageUploadIndexCounter++ };
        }
        // إزالة رابط VITE_BACKEND_URL قبل الإرسال
        const originalImageUrl = imageUrl.replace(import.meta.env.VITE_BACKEND_URL, '');
        return { ...restOfMethod, imageUrl: originalImageUrl };
    });

    formData.append('paymentMethods', JSON.stringify(processedPaymentMethods));
    
    dispatch(updateSettings(formData)).then((result) => {
      if (!result.error) {
        setSettingsSuccess(true);
        setLogoFile(null);
        setPaymentMethodFiles({});
      }
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'كلمات المرور الجديدة غير متطابقة', type: 'error' });
      return;
    }
    dispatch(updatePassword({ oldPassword, newPassword })).then(result => {
      if (result.error) {
        setPasswordMessage({ text: result.payload || 'كلمة المرور الحالية غير صحيحة', type: 'error' });
      } else {
        setPasswordMessage({ text: 'تم تغيير كلمة المرور بنجاح!', type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  };

  return (
    <Box dir="rtl" lang="ar">
      <AppBar 
        position="fixed" 
        color="default" 
        sx={{ 
            top: 'auto', bottom: 0, bgcolor: 'background.paper', 
            borderTop: '1px solid', borderColor: 'divider',
            width: { md: 'calc(100% - 240px)' }, 
            right: { md: 0 }, left: { md: 'auto' }
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" form="settings-form" variant="contained" disabled={status === 'loading'}>
            {status === 'loading' ? <CircularProgress size={24} /> : 'حفظ كل الإعدادات'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box id="settings-form" component="form" onSubmit={handleSettingsSubmit} sx={{ pb: '80px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          الإعدادات
        </Typography>

        {settingsSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSettingsSuccess(false)}>تم حفظ الإعدادات بنجاح!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>حدث خطأ: {error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>إعدادات الموقع العامة</Typography>
          <TextField label="اسم الموقع" value={siteName || ''} onChange={(e) => setSiteName(e.target.value)} fullWidth sx={{ my: 2 }} />
          <Typography gutterBottom>شعار الموقع</Typography>
          <Button variant="outlined" component="label">
            تغيير الشعار
            <input type="file" hidden onChange={handleLogoChange} accept="image/*" />
          </Button>
          {logoPreview && ( <Box component="img" src={logoPreview} alt="Logo Preview" sx={{ display: 'block', height: 60, mt: 2, border: '1px solid #ddd', p: 1, borderRadius: 1 }} /> )}
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>محتوى صفحة "من نحن"</Typography>
          <TiptapEditor 
              content={aboutUsContent} 
              onContentChange={setAboutUsContent}
          />
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>معلومات صفحة "تواصل معنا"</Typography>
          <TextField label="البريد الإلكتروني" value={contactEmail || ''} onChange={(e) => setContactEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="رقم الهاتف" value={contactPhone || ''} onChange={(e) => setContactPhone(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="العنوان" value={contactAddress || ''} onChange={(e) => setContactAddress(e.target.value)} fullWidth multiline rows={2} sx={{ mb: 2 }} />
          <TextField label="رابط خرائط جوجل" value={googleMapsUrl || ''} onChange={(e) => setGoogleMapsUrl(e.target.value)} fullWidth helperText="انسخ رابط 'Embed a map' من خرائط جوجل" />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>إدارة طرق الدفع</Typography>
            {paymentMethods.map((method, index) => (
                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <IconButton aria-label="delete" onClick={() => removePaymentMethod(index)} sx={{ position: 'absolute', top: 8, left: 8 }}>
                        <DeleteIcon />
                    </IconButton>
                    <TextField label="العنوان" value={method.title || ''} onChange={(e) => handlePaymentMethodChange(index, 'title', e.target.value)} fullWidth required sx={{ mb: 2 }} />
                    <TextField label="الوصف" value={method.description || ''} onChange={(e) => handlePaymentMethodChange(index, 'description', e.target.value)} fullWidth multiline rows={2} sx={{ mb: 2 }} />
                    <Button variant="outlined" component="label">
                        {method.imageUrl ? 'تغيير الصورة' : 'رفع صورة (اختياري)'}
                        <input type="file" hidden onChange={(e) => handlePaymentImageChange(index, e)} accept="image/*" />
                    </Button>
                    {method.imageUrl && (
                        <Box component="img" src={method.imageUrl} alt="Preview" sx={{ display: 'block', height: 50, mt: 1, borderRadius: 1, border: '1px solid #ddd' }} />
                    )}
                </Paper>
            ))}
            <Button startIcon={<AddCircleOutlineIcon />} onClick={addPaymentMethod}>إضافة طريقة دفع جديدة</Button>
        </Paper>
      </Box>

      <Paper component="form" onSubmit={handlePasswordSubmit} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>تغيير كلمة المرور</Typography>
        {passwordMessage.text && <Alert severity={passwordMessage.type} sx={{ mb: 2 }}>{passwordMessage.text}</Alert>}
        <TextField label="كلمة المرور الحالية" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
        <TextField label="كلمة المرور الجديدة" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
        <TextField label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" disabled={authState.status === 'loading'}>
          {authState.status === 'loading' ? <CircularProgress size={24} /> : 'تحديث كلمة المرور'}
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage;