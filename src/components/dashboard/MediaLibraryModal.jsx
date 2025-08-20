// src/components/dashboard/MediaLibraryModal.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, uploadMedia } from '../../store/mediaSlice';
import {
  Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Button,
  Grid, Card, CardMedia, CardActionArea, CircularProgress, LinearProgress, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MediaLibraryModal = ({ open, onClose, onSelect }) => {
  const dispatch = useDispatch();
  const { files, status, uploadStatus } = useSelector((state) => state.media);
  const [tab, setTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchMedia());
    }
  }, [open, dispatch]);

  const handleTabChange = (event, newValue) => { setTab(newValue); };
  const handleFileSelect = (file) => { setSelectedFile(file); };
  const handleConfirmSelection = () => { onSelect(selectedFile); onClose(); };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // استدعاء thunk الرفع وانتظار النتيجة
      const resultAction = await dispatch(uploadMedia(file));
      // إذا نجح الرفع، قم بتحديد الملف الجديد تلقائيًا
      if (uploadMedia.fulfilled.match(resultAction)) {
        onSelect(resultAction.payload); // تحديد وإغلاق مباشرة
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        مكتبة الوسائط
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="مكتبة الوسائط" />
          <Tab label="رفع ملف جديد" />
        </Tabs>

        {/* تبويب مكتبة الوسائط */}
        {tab === 0 && (
          <Box>
            {status === 'loading' && <CircularProgress />}
            <Grid container spacing={2}>
              {files.map((file) => (
                <Grid item key={file._id} xs={4} sm={3} md={2}>
                  <CardActionArea onClick={() => handleFileSelect(file)}>
                    <Card sx={{ border: selectedFile?._id === file._id ? '2px solid' : '2px solid transparent', borderColor: 'primary.main' }}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`}
                        alt={file.fileName}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </CardActionArea>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* تبويب رفع ملف جديد */}
        {tab === 1 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Button variant="contained" component="label" disabled={uploadStatus === 'loading'}>
              اختر ملفًا من جهازك
              <input type="file" hidden onChange={handleUpload} />
            </Button>
            {uploadStatus === 'loading' && <LinearProgress sx={{ mt: 2 }} />}
          </Box>
        )}
      </DialogContent>
      
      {/* زر التأكيد يظهر فقط في تبويب المكتبة */}
      {tab === 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleConfirmSelection} variant="contained" disabled={!selectedFile}>
                  اختيار الملف المحدد
              </Button>
          </Box>
      )}
    </Dialog>
  );
};

export default MediaLibraryModal;