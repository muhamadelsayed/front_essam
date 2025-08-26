// src/pages/dashboard/CustomCssPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCssRules, saveCssRule, deleteCssRule } from '../../store/customCssSlice';
import { Box, Typography, Button, TextField, Paper, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CustomCssPage = () => {
    const dispatch = useDispatch();
    const { rules, status } = useSelector((state) => state.customCss);

    const [path, setPath] = useState('');
    const [css, setCss] = useState('');
    const [currentId, setCurrentId] = useState(null); // لتتبع القاعدة التي يتم تعديلها

    useEffect(() => {
        dispatch(fetchCssRules());
    }, [dispatch]);

    const handleEdit = (rule) => {
        setCurrentId(rule._id);
        setPath(rule.path);
        setCss(rule.css);
    };

    const handleClear = () => {
        setCurrentId(null);
        setPath('');
        setCss('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(saveCssRule({ path, css }));
        handleClear();
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه القاعدة؟')) {
            dispatch(deleteCssRule(id));
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>تخصيص CSS</Typography>
            <Grid container spacing={4}>
                <Grid xs={12} md={5}>
                    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                        <Typography variant="h6">{currentId ? 'تعديل القاعدة' : 'إضافة قاعدة جديدة'}</Typography>
                        <TextField
                            label="مسار الصفحة"
                            placeholder="/about أو /product/123"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            fullWidth required margin="normal"
                        />
                        <TextField
                            label="كود الـ CSS"
                            placeholder="body { background-color: #f0f0f0; }"
                            value={css}
                            onChange={(e) => setCss(e.target.value)}
                            fullWidth required multiline rows={10} margin="normal"
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button type="submit" variant="contained">{currentId ? 'حفظ التعديلات' : 'إضافة'}</Button>
                            {currentId && <Button onClick={handleClear} variant="outlined">إلغاء التعديل</Button>}
                        </Box>
                    </Paper>
                </Grid>
                <Grid xs={12} md={7}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">القواعد المحفوظة</Typography>
                        <List>
                            {status === 'loading' && <Typography>جاري التحميل...</Typography>}
                            {rules.map((rule) => (
                                <Box key={rule._id}>
                                    <ListItem
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(rule)}><EditIcon /></IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(rule._id)}><DeleteIcon color="error" /></IconButton>
                                            </>
                                        }
                                    >
                                       <ListItemText
                                            primary={rule.path}
                                            secondary={
                                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
                                                    {rule.css}
                                                </pre>
                                            }
                                            // --- الإضافة هنا ---
                                            secondaryTypographyProps={{ component: 'div' }}
                                            // --- نهاية الإضافة ---
                                        />
                                       </ListItem>
                                    <Divider />
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
// تحتاج إلى إضافة Grid هنا
import { Grid } from '@mui/material';
export default CustomCssPage;