// src/components/editor/TiptapEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import { Box, IconButton, Divider, Paper } from '@mui/material';
import axios from '../../api/axios'; // **تأكد من أن المسار صحيح**
import { useSelector } from 'react-redux';

// --- أيقونات ---
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ImageIcon from '@mui/icons-material/Image';

const MenuBar = ({ editor }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.post('/api/uploads', formData, config);
          
          if (data.imageUrl) {
            // **الإصلاح هنا:** بناء الرابط الكامل قبل إدراجه
            const fullImageUrl = `${import.meta.env.VITE_BACKEND_URL}${data.imageUrl}`;
            editor.chain().focus().setImage({ src: fullImageUrl }).run();
          }
        } catch (error) {
          console.error('فشل في رفع الصورة:', error);
          alert('فشل في رفع الصورة. تأكد من أن حجمها ونوعها مناسبان.');
        }
      }
    };
    input.click();
  };

  if (!editor) return null;

  return (
    <Paper elevation={0} variant="outlined" sx={{ display: 'flex', flexWrap: 'wrap', p: 1, mb: 1, gap: 0.5 }}>
      {/* ... (أزرار التنسيق الأخرى) */}
      <IconButton onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}><FormatBoldIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}><FormatItalicIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} color={editor.isActive('strike') ? 'primary' : 'default'}><StrikethroughSIcon /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}><FormatListBulletedIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}><FormatListNumberedIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()} color={editor.isActive('blockquote') ? 'primary' : 'default'}><FormatQuoteIcon /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <IconButton onClick={addImage}><ImageIcon /></IconButton>
    </Paper>
  );
};


const TiptapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [ StarterKit, Image ],
    content: content,
    onUpdate: ({ editor }) => { onContentChange(editor.getHTML()); },
    editorProps: {
        attributes: { style: `direction: rtl; text-align: right; min-height: 200px; outline: none; padding: 10px;` },
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TiptapEditor;