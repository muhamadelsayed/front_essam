// src/components/editor/TiptapEditor.jsx
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Node } from '@tiptap/core';
import { useEffect } from 'react';
import { Box, IconButton, Divider, Paper } from '@mui/material';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';

// --- استيراد أيقونات ---
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

// ====================================================================
// امتداد Tiptap المخصص للفيديو (نسخة مبسطة وموثوقة)
// ====================================================================
const CustomVideo = Node.create({
  name: 'customVideo', // اسم فريد
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'video[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    // بناء HTML الصحيح مع عنصر source
    return ['video', { controls: 'true', style: 'width: 100%; border-radius: 8px;' }, ['source', HTMLAttributes]];
  },

  addCommands() {
    return {
      addVideo: (options) => ({ tr, dispatch }) => {
        const { selection } = tr;
        const node = this.type.create(options);
        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node);
        }
        return true;
      },
    };
  },
});

// ====================================================================
// امتداد Tiptap المخصص للصوت (نسخة مبسطة وموثوقة)
// ====================================================================
const CustomAudio = Node.create({
    name: 'customAudio', // اسم فريد
    group: 'block',
    atom: true,
    addAttributes() { return { src: { default: null } }; },
    parseHTML() { return [{ tag: 'audio[src]' }]; },
    renderHTML({ HTMLAttributes }) {
        return ['audio', { ...HTMLAttributes, controls: 'true', style: 'width: 100%; margin: 1em 0;' }];
    },
    addCommands() {
        return {
            addAudio: (options) => ({ tr, dispatch }) => {
                const { selection } = tr;
                const node = this.type.create(options);
                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node);
                }
                return true;
            },
        };
    },
});

// ====================================================================
// شريط أدوات المحرر (MenuBar)
// ====================================================================
const MenuBar = ({ editor }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const addMedia = (accept, type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.post('/api/uploads', formData, config);
          if (data.imageUrl) {
            const fullFileUrl = `${import.meta.env.VITE_BACKEND_URL}${data.imageUrl}`;
            const chain = editor.chain().focus();
            if (type === 'image') chain.setImage({ src: fullFileUrl }).run();
            // **الإصلاح الرئيسي هنا: استدعاء الأوامر الجديدة**
            else if (type === 'video') chain.addVideo({ src: fullFileUrl }).run();
            else if (type === 'audio') chain.addAudio({ src: fullFileUrl }).run();
          }
        } catch (error) {
          console.error(`فشل في رفع ${type}:`, error);
          alert(`فشل في رفع الملف.`);
        }
      }
    };
    input.click();
  };

  if (!editor) return null;

  return (
    <Paper elevation={0} variant="outlined" sx={{ display: 'flex', flexWrap: 'wrap', p: 1, mb: 1, gap: 0.5 }}>
      <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}><FormatBoldIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}><FormatItalicIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleStrike().run()} color={editor.isActive('strike') ? 'primary' : 'default'}><StrikethroughSIcon /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}><FormatListBulletedIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}><FormatListNumberedIcon /></IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()} color={editor.isActive('blockquote') ? 'primary' : 'default'}><FormatQuoteIcon /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <IconButton onClick={() => addMedia('image/*', 'image')}><ImageIcon /></IconButton>
      <IconButton onClick={() => addMedia('video/*', 'video')}><VideocamIcon /></IconButton>
      <IconButton onClick={() => addMedia('audio/*', 'audio')}><AudiotrackIcon /></IconButton>
    </Paper>
  );
};

// ====================================================================
// المكون الرئيسي للمحرر
// ====================================================================
const TiptapEditor = ({ content, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      CustomVideo,
      CustomAudio,
    ],
    content: content,
    onUpdate: ({ editor }) => { onContentChange(editor.getHTML()); },
    editorProps: {
        attributes: { style: `direction: rtl; text-align: right; min-height: 200px; outline: none; padding: 10px;` },
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
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