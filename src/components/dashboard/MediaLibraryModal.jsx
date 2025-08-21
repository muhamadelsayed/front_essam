// src/components/dashboard/MediaLibraryModal.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, resetMediaState } from '../../store/mediaSlice'; // **تحديث: استيراد resetMediaState**
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Grid,
  Card, CardMedia, CardActionArea, CircularProgress, Typography, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

const MediaFile = ({ file, onSelect, isSelected }) => {
    const isVideo = file.fileType === 'video';
    return (
        <CardActionArea onClick={() => onSelect(file.fileUrl)}>
            <Card sx={{ position: 'relative', border: isSelected ? '3px solid' : '3px solid transparent', borderColor: 'primary.main' }}>
                {isVideo ? (
                    <CardMedia component="video" src={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`} height="140" />
                ) : (
                    <CardMedia component="img" image={`${import.meta.env.VITE_BACKEND_URL}${file.fileUrl}`} height="140" sx={{ objectFit: 'cover' }} />
                )}
                {isSelected && (
                    <CheckCircleIcon color="primary" sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'white', borderRadius: '50%' }}/>
                )}
            </Card>
        </CardActionArea>
    );
};

const MediaLibraryModal = ({ open, onClose, onSelect, multiSelect = false }) => {
  const dispatch = useDispatch();
  const { files, status, page, pages } = useSelector((state) => state.media);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (open) {
      // **تحديث: إعادة تعيين الحالة ثم جلب الصفحة الأولى**
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
  
  // **دالة جديدة لتحميل المزيد من الوسائط**
  const handleLoadMore = () => {
      if (page < pages && status !== 'loading') {
          dispatch(fetchMedia({ page: page + 1 }));
      }
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
              <MediaFile file={file} onSelect={handleSelect} isSelected={selected.includes(file.fileUrl)} />
            </Grid>
          ))}
        </Grid>

        {/* **إظهار مؤشر التحميل عند طلب صفحات إضافية** */}
        {status === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
        
        {/* **إظهار زر "عرض المزيد"** */}
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