// src/components/dashboard/MediaLibraryModal.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, resetMediaState, deleteMediaFile } from '../../store/mediaSlice'; // <-- إضافة deleteMediaFile
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Grid,
  Card, CardMedia, CardActionArea, CircularProgress, Typography, IconButton, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // <-- استيراد أيقونة الحذف

// --- **تحديث مكون MediaFile لإضافة زر الحذف** ---
const MediaFile = ({ file, onSelect, isSelected, onDelete }) => {
    const isVideo = file.fileType === 'video';

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // منع تحديد الملف عند النقر على الحذف
        if (window.confirm(`هل أنت متأكد من حذف الملف "${file.fileName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            onDelete(file.fileName);
        }
    };

  // Always use /api/uploads/ and avoid double
  let url = file.fileUrl || '';
  url = url.replace(/^\/api\/uploads\//, '').replace(/^\/uploads\//, '');
  const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/api/uploads/${url}`;
  return (
    <Card sx={{ position: 'relative' }}>
      <Tooltip title="حذف الملف" placement="top">
        <IconButton 
          size="small" 
          onClick={handleDeleteClick}
          sx={{
            position: 'absolute', top: 4, left: 4, zIndex: 2,
            color: 'white', backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.7)' }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <CardActionArea onClick={() => onSelect(file.fileUrl)} sx={{ position: 'relative' }}>
        {isVideo ? (
          <CardMedia component="video" src={fullUrl} height="140" sx={{ objectFit: 'cover' }} playsInline muted />
        ) : (
          <CardMedia component="img" image={fullUrl} height="140" sx={{ objectFit: 'cover' }} />
        )}
        {isSelected && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(38, 70, 83, 0.5)', // لون التحديد
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckCircleIcon color="primary" sx={{ fontSize: 40, color: 'white' }}/>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
};

const MediaLibraryModal = ({ open, onClose, onSelect, multiSelect = false }) => {
  const dispatch = useDispatch();
  const { files, status, page, pages } = useSelector((state) => state.media);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (open) {
      dispatch(resetMediaState()); 
      dispatch(fetchMedia({ page: 1 }));
    }
  }, [open, dispatch]);

  const handleSelect = (fileUrl) => {
    if (multiSelect) {
      setSelected(prev => prev.includes(fileUrl) ? prev.filter(f => f !== fileUrl) : [...prev, fileUrl]);
    } else {
      setSelected([fileUrl]);
    }
  };
  
  const handleLoadMore = () => {
      if (page < pages && status !== 'loading') {
          dispatch(fetchMedia({ page: page + 1 }));
      }
  };

  // --- **إضافة: دالة لتنفيذ عملية الحذف** ---
  const handleDeleteFile = (filename) => {
    dispatch(deleteMediaFile(filename));
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
    setSelected([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        مكتبة الوسائط
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid item key={file._id} xs={6} sm={4} md={3}>
              <MediaFile 
                file={file} 
                onSelect={handleSelect} 
                isSelected={selected.includes(file.fileUrl)}
                onDelete={handleDeleteFile} // <-- تمرير دالة الحذف
              />
            </Grid>
          ))}
        </Grid>

        {status === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
        
        {page < pages && status !== 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Button onClick={handleLoadMore} variant="outlined">عرض المزيد</Button>
            </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={selected.length === 0}>
          تأكيد الاختيار ({selected.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaLibraryModal;