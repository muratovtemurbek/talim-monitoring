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
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const UploadModal = ({ open, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData({ ...formData, file: acceptedFiles[0] });
        setErrors({ ...errors, file: '' });
        toast.success('Fayl tanlandi!');
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('Fayl hajmi 10MB dan kichik bo\'lishi kerak!');
      } else {
        toast.error('Fayl formati noto\'g\'ri!');
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
    if (!formData.file) newErrors.file = 'Faylni yuklang';

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
      await onUpload(formData);
      handleClose();
      toast.success('Material muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Yuklashda xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', subject: '', grade: '', file: null });
    setErrors({});
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
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload color="white" size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              📚 Yangi Material Yuklash
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
            </motion.div>
          )}
        </AnimatePresence>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            variant="outlined"
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
            variant="outlined"
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
              {errors.subject && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.subject}
                </Typography>
              )}
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
              helperText={errors.grade}
              inputProps={{ min: 1, max: 11 }}
              sx={{ width: 150 }}
              disabled={loading}
            />
          </Box>

          {/* Drag & Drop */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: errors.file ? 'error.main' : isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              bgcolor: isDragActive ? 'primary.lighter' : errors.file ? 'error.lighter' : 'grey.50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter',
              },
            }}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: isDragActive ? -10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {formData.file ? (
                <Box>
                  <FileText size={48} color="#6366f1" style={{ margin: '0 auto' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: 'primary.main', fontWeight: 700 }}>
                    {formData.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Upload size={48} color={errors.file ? '#ef4444' : '#94a3b8'} style={{ margin: '0 auto' }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {isDragActive ? 'Faylni qo\'ying...' : 'Faylni tanlang yoki tortib tashlang'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
                  </Typography>
                </Box>
              )}
            </motion.div>
          </Box>

          {errors.file && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
              <AlertCircle size={16} />
              <Typography variant="caption">{errors.file}</Typography>
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
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            px: 4,
          }}
        >
          {loading ? 'Yuklanmoqda...' : 'Yuklash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;