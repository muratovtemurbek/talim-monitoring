import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Video as VideoIcon, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const VideoUploadModal = ({ open, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    url: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/mpeg': ['.mpeg'],
      'video/quicktime': ['.mov'],
    },
    maxFiles: 1,
    maxSize: 104857600, // 100MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData({ ...formData, file: acceptedFiles[0] });
        setErrors({ ...errors, file: '' });
        toast.success('Video tanlandi!');
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('Video hajmi 100MB dan kichik bo\'lishi kerak!');
      } else {
        toast.error('Video formati noto\'g\'ri!');
      }
    },
  });

  const subjects = [
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
    { value: 'english', label: 'Ingliz tili' },
    { value: 'uzbek', label: "O'zbek tili" },
    { value: 'russian', label: 'Rus tili' },
    { value: 'history', label: 'Tarix' },
    { value: 'geography', label: 'Geografiya' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Sarlavha kiriting';
    if (!formData.subject) newErrors.subject = 'Fanni tanlang';
    if (!formData.grade) newErrors.grade = 'Sinfni kiriting';

    if (uploadType === 'url') {
      if (!formData.url.trim()) newErrors.url = 'Video URL kiriting';
    } else {
      if (!formData.file) newErrors.file = 'Videoni yuklang';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      await onUpload(formData, uploadType);
      handleClose();
      toast.success('Video muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Yuklashda xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', subject: '', grade: '', url: '', file: null });
    setErrors({});
    setUploadType('url');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VideoIcon color="white" size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              🎥 Yangi Video Yuklash
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <X />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
            </motion.div>
          )}
        </AnimatePresence>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Upload Type */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              variant={uploadType === 'url' ? 'contained' : 'outlined'}
              onClick={() => setUploadType('url')}
            >
              URL orqali
            </Button>
            <Button
              fullWidth
              variant={uploadType === 'file' ? 'contained' : 'outlined'}
              onClick={() => setUploadType('file')}
            >
              Fayl yuklash
            </Button>
          </Box>

          {/* Title */}
          <TextField
            fullWidth
            label="Sarlavha *"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors({ ...errors, title: '' });
            }}
            error={!!errors.title}
            helperText={errors.title}
            disabled={loading}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Tavsif"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            disabled={loading}
          />

          {/* Subject & Grade */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth error={!!errors.subject}>
              <InputLabel>Fan *</InputLabel>
              <Select
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  setErrors({ ...errors, subject: '' });
                }}
                label="Fan *"
                disabled={loading}
              >
                {subjects.map((sub) => (
                  <MenuItem key={sub.value} value={sub.value}>
                    {sub.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Sinf *"
              type="number"
              value={formData.grade}
              onChange={(e) => {
                setFormData({ ...formData, grade: e.target.value });
                setErrors({ ...errors, grade: '' });
              }}
              error={!!errors.grade}
              inputProps={{ min: 1, max: 11 }}
              sx={{ width: 150 }}
              disabled={loading}
            />
          </Box>

          {/* URL or File */}
          {uploadType === 'url' ? (
            <TextField
              fullWidth
              label="Video URL (YouTube, Vimeo) *"
              value={formData.url}
              onChange={(e) => {
                setFormData({ ...formData, url: e.target.value });
                setErrors({ ...errors, url: '' });
              }}
              error={!!errors.url}
              helperText={errors.url || 'YouTube yoki Vimeo linki'}
              placeholder="https://youtube.com/watch?v=..."
              disabled={loading}
            />
          ) : (
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: errors.file ? 'error.main' : isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                bgcolor: isDragActive ? 'primary.lighter' : 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <input {...getInputProps()} />
              {formData.file ? (
                <Box>
                  <VideoIcon size={48} color="#ef4444" />
                  <Typography variant="h6" sx={{ mt: 2, color: 'error.main', fontWeight: 700 }}>
                    {formData.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Upload size={48} color="#94a3b8" />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {isDragActive ? 'Videoni qo\'ying...' : 'Video faylni tanlang'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    MP4, MOV (Max 100MB)
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Bekor qilish
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
            px: 4,
          }}
        >
          {loading ? 'Yuklanmoqda...' : 'Yuklash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoUploadModal;