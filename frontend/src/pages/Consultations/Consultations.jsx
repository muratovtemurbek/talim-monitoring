import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Close,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Event,
  Person,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [teachers, setTeachers] = useState([]); // har doim array
  const [tabValue, setTabValue] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);

  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    teacher: '',
    scheduled_at: '',
  });

  useEffect(() => {
    fetchConsultations();
    fetchTeachers();
  }, [tabValue]);

  const fetchConsultations = async () => {
    try {
      const response = await axiosInstance.get('/consultations/my_consultations/');
      const data = response.data.results || response.data || [];
      setConsultations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Maslahatlar yuklanmadi:', error);
      toast.error('Maslahatlarni yuklashda xatolik');
      setConsultations([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/teachers/teachers/');
      const data = response.data.results || response.data || [];
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('O‘qituvchilar yuklanmadi:', error);
      toast.error('O‘qituvchilarni yuklashda xatolik');
      setTeachers([]);
    }
  };

  const handleInputChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequest = async () => {
    if (!requestData.title || !requestData.teacher || !requestData.scheduled_at) {
      toast.error('Barcha majburiy maydonlarni to‘ldiring!');
      return;
    }

    try {
      await axiosInstance.post('/consultations/', requestData);
      toast.success('So‘rov muvaffaqiyatli yuborildi!');
      setRequestOpen(false);
      setRequestData({ title: '', description: '', teacher: '', scheduled_at: '' });
      fetchConsultations();
    } catch (error) {
      console.error('So‘rov yuborishda xatolik:', error);
      toast.error(error.response?.data?.detail || 'Xatolik yuz berdi');
    }
  };

  const handleAccept = async (id) => {
    try {
      await axiosInstance.post(`/consultations/${id}/accept/`);
      toast.success('Maslahat qabul qilindi!');
      fetchConsultations();
    } catch (error) {
      toast.error('Qabul qilishda xatolik');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.post(`/consultations/${id}/reject/`);
      toast.success('Maslahat rad etildi');
      fetchConsultations();
    } catch (error) {
      toast.error('Rad etishda xatolik');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axiosInstance.post(`/consultations/${id}/complete/`);
      toast.success('Maslahat yakunlandi!');
      fetchConsultations();
    } catch (error) {
      toast.error('Yakunlashda xatolik');
    }
  };

  const getStatusChip = (status) => {
    const map = {
      pending: { label: 'Kutilmoqda', color: 'warning', icon: <HourglassEmpty /> },
      accepted: { label: 'Qabul qilindi', color: 'success', icon: <CheckCircle /> },
      rejected: { label: 'Rad etildi', color: 'error', icon: <Cancel /> },
      completed: { label: 'Yakunlandi', color: 'primary', icon: <CheckCircle /> },
    };
    const config = map[status] || map.pending;
    return <Chip label={config.label} color={config.color} icon={config.icon} size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Event sx={{ mr: 2 }} />
          Maslahatlar
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setRequestOpen(true)}>
          Maslahat so'rash
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Mening maslahatlarim" />
      </Tabs>

      {/* Maslahatlar ro'yxati */}
      <Grid container spacing={3}>
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <Grid item xs={12} md={6} lg={4} key={consultation.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{consultation.title}</Typography>
                    {getStatusChip(consultation.status)}
                  </Box>

                  {consultation.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {consultation.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">
                      O'qituvchi: <strong>{consultation.teacher_name || 'Noma\'lum'}</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Event sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">
                      {consultation.scheduled_at
                        ? new Date(consultation.scheduled_at).toLocaleString('uz-UZ')
                        : 'Vaqt belgilanmagan'}
                    </Typography>
                  </Box>

                  {consultation.notes && (
                    <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="caption" display="block">
                        <strong>Izoh:</strong> {consultation.notes}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {consultation.status === 'pending' && consultation.is_teacher && (
                      <>
                        <Button size="small" variant="contained" color="success" onClick={() => handleAccept(consultation.id)}>
                          Qabul qilish
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleReject(consultation.id)}>
                          Rad etish
                        </Button>
                      </>
                    )}
                    {consultation.status === 'accepted' && consultation.is_teacher && (
                      <Button size="small" variant="contained" onClick={() => handleComplete(consultation.id)}>
                        Yakunlash
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Event sx={{ fontSize: 80, color: 'grey.300', mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                Hozircha maslahat yo'q
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Maslahat so'rash dialogi */}
      <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Yangi maslahat so'rash</Typography>
            <IconButton onClick={() => setRequestOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Mavzu"
              name="title"
              value={requestData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Tavsif (ixtiyoriy)"
              name="description"
              value={requestData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>O'qituvchi tanlang</InputLabel>
              <Select
                name="teacher"
                value={requestData.teacher}
                onChange={handleInputChange}
                label="O'qituvchi tanlang"
              >
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.user_name || teacher.full_name} - {teacher.subject_display || teacher.subject}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>O'qituvchilar yuklanmoqda...</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              label="Sana va vaqt"
              name="scheduled_at"
              type="datetime-local"
              value={requestData.scheduled_at}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRequestOpen(false)}>Bekor qilish</Button>
          <Button
            onClick={handleRequest}
            variant="contained"
            disabled={!requestData.title || !requestData.teacher || !requestData.scheduled_at}
          >
            Yuborish
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Consultations;