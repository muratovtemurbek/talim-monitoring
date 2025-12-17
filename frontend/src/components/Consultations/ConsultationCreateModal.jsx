import React, { useState, useEffect } from 'react';
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
  IconButton,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { X, MessageCircle, Calendar, Clock, MapPin, Video, User } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const ConsultationCreateModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [formData, setFormData] = useState({
    teacher: '',
    title: '',
    description: '',
    scheduled_at: '',
    duration: 60,
    consultation_type: 'online',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await axiosInstance.get('/teachers/');
      const data = response.data.results || response.data;
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('O\'qituvchilar yuklashda xatolik:', error);
      toast.error('O\'qituvchilar ro\'yxatini yuklashda xatolik');
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teacher) newErrors.teacher = 'O\'qituvchi tanlang';
    if (!formData.title.trim()) newErrors.title = 'Mavzu kiriting';
    if (!formData.scheduled_at) newErrors.scheduled_at = 'Sana va vaqt kiriting';
    if (formData.consultation_type === 'offline' && !formData.location.trim()) {
      newErrors.location = 'Offline uchun manzil kiriting';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
      };

      await axiosInstance.post('/consultations/', payload);
      toast.success('Maslahat so\'rovi yuborildi!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Maslahat yaratishda xatolik:', error);
      const errorMsg = error.response?.data?.error ||
                       error.response?.data?.teacher?.[0] ||
                       'Xatolik yuz berdi';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      teacher: '',
      title: '',
      description: '',
      scheduled_at: '',
      duration: 60,
      consultation_type: 'online',
      location: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  // Get min datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MessageCircle size={24} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Maslahat So'rash
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Tajribali o'qituvchilardan maslahat so'rang. Ular sizga yordam berishadi.
          </Alert>

          <Grid container spacing={3}>
            {/* O'qituvchi tanlash */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.teacher}>
                <InputLabel>O'qituvchi tanlang *</InputLabel>
                <Select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  label="O'qituvchi tanlang *"
                  startAdornment={<User size={20} style={{ marginRight: 8, color: '#3b82f6' }} />}
                  disabled={loadingTeachers}
                >
                  {loadingTeachers ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} /> Yuklanmoqda...
                    </MenuItem>
                  ) : (
                    teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.user_name || `${teacher.user?.first_name} ${teacher.user?.last_name}`}
                        {teacher.subject && ` - ${teacher.subject}`}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.teacher && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.teacher}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Mavzu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Mavzu *"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Masalan: Fizika fanidan dars rejasi tuzish"
              />
            </Grid>

            {/* Tavsif */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Tavsif"
                value={formData.description}
                onChange={handleChange}
                placeholder="Maslahat so'rayotgan mavzu haqida qisqacha..."
              />
            </Grid>

            {/* Sana va vaqt */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                name="scheduled_at"
                label="Sana va vaqt *"
                value={formData.scheduled_at}
                onChange={handleChange}
                error={!!errors.scheduled_at}
                helperText={errors.scheduled_at}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDateTime() }}
                InputProps={{
                  startAdornment: <Calendar size={20} style={{ marginRight: 8, color: '#3b82f6' }} />,
                }}
              />
            </Grid>

            {/* Davomiyligi */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Davomiyligi</InputLabel>
                <Select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  label="Davomiyligi"
                  startAdornment={<Clock size={20} style={{ marginRight: 8, color: '#3b82f6' }} />}
                >
                  <MenuItem value={30}>30 daqiqa</MenuItem>
                  <MenuItem value={45}>45 daqiqa</MenuItem>
                  <MenuItem value={60}>1 soat</MenuItem>
                  <MenuItem value={90}>1.5 soat</MenuItem>
                  <MenuItem value={120}>2 soat</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Turi */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Maslahat turi</InputLabel>
                <Select
                  name="consultation_type"
                  value={formData.consultation_type}
                  onChange={handleChange}
                  label="Maslahat turi"
                >
                  <MenuItem value="online">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Video size={20} color="#10b981" />
                      Online (Zoom/Meet)
                    </Box>
                  </MenuItem>
                  <MenuItem value="offline">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={20} color="#f59e0b" />
                      Offline (Yuzma-yuz)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Manzil (faqat offline uchun) */}
            {formData.consultation_type === 'offline' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="location"
                  label="Manzil *"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!errors.location}
                  helperText={errors.location}
                  placeholder="Masalan: 15-maktab, 301-xona"
                  InputProps={{
                    startAdornment: <MapPin size={20} style={{ marginRight: 8, color: '#f59e0b' }} />,
                  }}
                />
              </Grid>
            )}

            {/* Qo'shimcha izoh */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="notes"
                label="Qo'shimcha izoh"
                value={formData.notes}
                onChange={handleChange}
                placeholder="O'qituvchiga qo'shimcha ma'lumot..."
              />
            </Grid>
          </Grid>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Bekor qilish
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <MessageCircle size={20} />}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            px: 4,
          }}
        >
          {loading ? 'Yuborilmoqda...' : 'Maslahat So\'rash'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultationCreateModal;
