import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Rating,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add,
  Assessment,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Visibility,
  Send,
  Close,
  Edit,
} from '@mui/icons-material';
import {
  fetchLessonAnalyses,
  fetchMyAnalysesGiven,
  fetchMyAnalysesReceived,
  fetchPendingAnalyses,
  fetchAnalysisStats,
} from '../../redux/slices/lessonAnalysisSlice';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const LessonAnalysis = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    analyses: rawAnalyses = {},
    givenAnalyses: rawGiven = {},
    receivedAnalyses: rawReceived = {},
    pendingAnalyses: rawPending = {},
    stats = {},
  } = useSelector((state) => state.lessonAnalysis);

  // Har doim array bo'lishi uchun himoya
  const analyses = Array.isArray(rawAnalyses)
    ? rawAnalyses
    : rawAnalyses?.results || [];

  const givenAnalyses = Array.isArray(rawGiven)
    ? rawGiven
    : rawGiven?.results || [];

  const receivedAnalyses = Array.isArray(rawReceived)
    ? rawReceived
    : rawReceived?.results || [];

  const pendingAnalyses = Array.isArray(rawPending)
    ? rawPending
    : rawPending?.results || [];

  const [tabValue, setTabValue] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    teacher: '',
    lesson_date: '',
    subject: '',
    grade: '',
    topic: '',
    lesson_type: 'new',
    methodology_rating: 5,
    material_mastery: 5,
    student_engagement: 5,
    time_management: 5,
    technology_use: 5,
    achievements: '',
    weaknesses: '',
    recommendations: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchAnalysisStats());
    fetchTeachers();

    if (tabValue === 0) dispatch(fetchLessonAnalyses());
    if (tabValue === 1) dispatch(fetchMyAnalysesGiven());
    if (tabValue === 2) dispatch(fetchMyAnalysesReceived());
    if (tabValue === 3) dispatch(fetchPendingAnalyses());
  }, [dispatch, tabValue]);

  const fetchTeachers = async () => {
    try {
      const res = await axiosInstance.get('/teachers/');
      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setTeachers(list);
    } catch (err) {
      console.error('O\'qituvchilar yuklanmadi:', err);
      setTeachers([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (name, value) => {
    setFormData({ ...formData, [name]: value || 0 });
  };

  const handleCreate = async () => {
    if (!formData.teacher || !formData.lesson_date || !formData.subject || !formData.topic) {
      toast.error("Majburiy maydonlarni to'ldiring!");
      return;
    }

    try {
      await axiosInstance.post('/lesson-analysis/', formData);
      toast.success('Tahlil muvaffaqiyatli yaratildi!');
      setCreateOpen(false);
      setFormData({
        teacher: '',
        lesson_date: '',
        subject: '',
        grade: '',
        topic: '',
        lesson_type: 'new',
        methodology_rating: 5,
        material_mastery: 5,
        student_engagement: 5,
        time_management: 5,
        technology_use: 5,
        achievements: '',
        weaknesses: '',
        recommendations: '',
        notes: '',
      });
      dispatch(fetchMyAnalysesGiven());
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
    }
  };

  const handleSubmit = async (id) => {
    try {
      await axiosInstance.post(`/lesson-analysis/${id}/submit/`);
      toast.success('Tahlil tasdiqlashga yuborildi');
      dispatch(fetchMyAnalysesGiven());
    } catch (err) {
      toast.error('Yuborishda xatolik');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/lesson-analysis/${id}/approve/`);
      toast.success('Tahlil tasdiqlandi');
      dispatch(fetchPendingAnalyses());
      dispatch(fetchMyAnalysesReceived());
    } catch (err) {
      toast.error('Tasdiqlashda xatolik');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rad etish sababi:');
    if (!reason) return;

    try {
      await axiosInstance.post(`/lesson-analysis/${id}/reject/`, { reason });
      toast.success('Tahlil rad etildi');
      dispatch(fetchPendingAnalyses());
      dispatch(fetchMyAnalysesReceived());
    } catch (err) {
      toast.error('Rad etishda xatolik');
    }
  };

  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setViewOpen(true);
  };

  const getStatusChip = (status) => {
    const map = {
      draft: { label: 'Qoralama', color: 'default', icon: <Edit /> },
      pending: { label: 'Kutilmoqda', color: 'warning', icon: <HourglassEmpty /> },
      approved: { label: 'Tasdiqlangan', color: 'success', icon: <CheckCircle /> },
      rejected: { label: 'Rad etilgan', color: 'error', icon: <Cancel /> },
    };
    const config = map[status] || map.draft;
    return <Chip label={config.label} color={config.color} icon={config.icon} size="small" />;
  };

  const currentList =
    tabValue === 0
      ? analyses
      : tabValue === 1
      ? givenAnalyses
      : tabValue === 2
      ? receivedAnalyses
      : pendingAnalyses;

  const renderAnalysisCard = (analysis) => (
    <Grid item xs={12} md={6} lg={4} key={analysis.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" noWrap>
              {analysis.topic}
            </Typography>
            {getStatusChip(analysis.status)}
          </Box>

          <Typography variant="body2" color="text.secondary">
            O'qituvchi: <strong>{analysis.teacher_name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tahlilchi: <strong>{analysis.analyzer_name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {analysis.subject} • {analysis.grade}-sinf
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {new Date(analysis.lesson_date).toLocaleDateString('uz-UZ')}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Rating value={parseFloat(analysis.overall_rating || 0)} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {analysis.overall_rating || '0'}/5
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ p: 2, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button size="small" startIcon={<Visibility />} onClick={() => handleViewDetails(analysis)}>
            Batafsil
          </Button>

          {analysis.status === 'draft' && analysis.analyzer?.user === user?.id && (
            <Button size="small" color="primary" startIcon={<Send />} onClick={() => handleSubmit(analysis.id)}>
              Yuborish
            </Button>
          )}

          {analysis.status === 'pending' && analysis.teacher?.user === user?.id && (
            <>
              <Button size="small" color="success" startIcon={<CheckCircle />} onClick={() => handleApprove(analysis.id)}>
                Tasdiqlash
              </Button>
              <Button size="small" color="error" startIcon={<Cancel />} onClick={() => handleReject(analysis.id)}>
                Rad etish
              </Button>
            </>
          )}
        </Box>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1.5 }} />
          Dars Tahlili
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
          Yangi tahlil
        </Button>
      </Box>

      {/* Statistika */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Jami tahlillar', value: stats.total_analyses || 0, color: 'primary.main' },
            { label: 'Kutilmoqda', value: stats.pending_analyses || 0, color: 'warning.main' },
            { label: 'Tasdiqlangan', value: stats.approved_analyses || 0, color: 'success.main' },
            { label: "O'rtacha baho", value: stats.average_rating ? Number(stats.average_rating).toFixed(2) : '0.00', color: 'info.main' },
          ].map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: item.color, fontWeight: 'bold' }}>
                  {item.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label={`Barchasi (${analyses.length})`} />
        <Tab label={`Men bergan (${givenAnalyses.length})`} />
        <Tab label={`Menga berilgan (${receivedAnalyses.length})`} />
        <Tab label={`Tasdiqlash kerak (${pendingAnalyses.length})`} />
      </Tabs>

      {/* Ro'yxat */}
      <Grid container spacing={3}>
        {currentList.length > 0 ? (
          currentList.map(renderAnalysisCard)
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6" color="text.secondary">
                Hozircha tahlil mavjud emas
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Yangi tahlil yaratish dialogi */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Yangi Dars Tahlili
          <IconButton onClick={() => setCreateOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>O'qituvchi</InputLabel>
                <Select name="teacher" value={formData.teacher} onChange={handleInputChange} label="O'qituvchi">
                  {teachers.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.user_name || `${t.user?.first_name} ${t.user?.last_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="lesson_date"
                label="Dars sanasi"
                value={formData.lesson_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Fan</InputLabel>
                <Select name="subject" value={formData.subject} onChange={handleInputChange} label="Fan">
                  <MenuItem value="math">Matematika</MenuItem>
                  <MenuItem value="physics">Fizika</MenuItem>
                  <MenuItem value="chemistry">Kimyo</MenuItem>
                  <MenuItem value="biology">Biologiya</MenuItem>
                  <MenuItem value="informatics">Informatika</MenuItem>
                  <MenuItem value="english">Ingliz tili</MenuItem>
                  <MenuItem value="uzbek">O'zbek tili</MenuItem>
                  <MenuItem value="russian">Rus tili</MenuItem>
                  <MenuItem value="history">Tarix</MenuItem>
                  <MenuItem value="geography">Geografiya</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sinf</InputLabel>
                <Select name="grade" value={formData.grade} onChange={handleInputChange} label="Sinf">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                    <MenuItem key={g} value={g}>{g}-sinf</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="topic"
                label="Mavzu"
                value={formData.topic}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dars turi</InputLabel>
                <Select name="lesson_type" value={formData.lesson_type} onChange={handleInputChange} label="Dars turi">
                  <MenuItem value="new">Yangi mavzu</MenuItem>
                  <MenuItem value="practice">Amaliy mashg'ulot</MenuItem>
                  <MenuItem value="review">Takrorlash</MenuItem>
                  <MenuItem value="test">Nazorat</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Baholash</Divider>
            </Grid>

            {[
              { name: 'methodology_rating', label: 'Metodika' },
              { name: 'material_mastery', label: 'Materialni egallash' },
              { name: 'student_engagement', label: "O'quvchi faolligi" },
              { name: 'time_management', label: 'Vaqtni boshqarish' },
              { name: 'technology_use', label: "Texnologiya qo'llash" },
            ].map((item) => (
              <Grid item xs={12} sm={6} key={item.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography>{item.label}:</Typography>
                  <Rating
                    name={item.name}
                    value={formData[item.name]}
                    onChange={(_, value) => handleRatingChange(item.name, value)}
                  />
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Tahlil</Divider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="achievements"
                label="Yutuqlar"
                value={formData.achievements}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="weaknesses"
                label="Kamchiliklar"
                value={formData.weaknesses}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="recommendations"
                label="Tavsiyalar"
                value={formData.recommendations}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="notes"
                label="Qo'shimcha izohlar"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Bekor qilish</Button>
          <Button variant="contained" onClick={handleCreate}>Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Tahlilni ko'rish dialogi */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Tahlil tafsilotlari
          <IconButton onClick={() => setViewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAnalysis && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedAnalysis.topic}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAnalysis.subject} • {selectedAnalysis.grade}-sinf • {new Date(selectedAnalysis.lesson_date).toLocaleDateString('uz-UZ')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>O'qituvchi:</strong> {selectedAnalysis.teacher_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2"><strong>Tahlilchi:</strong> {selectedAnalysis.analyzer_name}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>Baholar</Divider>
              </Grid>

              {[
                { label: 'Metodika', value: selectedAnalysis.methodology_rating },
                { label: 'Materialni egallash', value: selectedAnalysis.material_mastery },
                { label: "O'quvchi faolligi", value: selectedAnalysis.student_engagement },
                { label: 'Vaqtni boshqarish', value: selectedAnalysis.time_management },
                { label: "Texnologiya qo'llash", value: selectedAnalysis.technology_use },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{item.label}:</Typography>
                    <Rating value={item.value || 0} readOnly size="small" />
                  </Box>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>Umumiy baho:</Typography>
                  <Rating value={parseFloat(selectedAnalysis.overall_rating || 0)} readOnly />
                  <Typography variant="h6" sx={{ ml: 1 }}>{selectedAnalysis.overall_rating || '0'}/5</Typography>
                </Box>
              </Grid>

              {selectedAnalysis.achievements && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Yutuqlar:</Typography>
                  <Typography variant="body2">{selectedAnalysis.achievements}</Typography>
                </Grid>
              )}

              {selectedAnalysis.weaknesses && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Kamchiliklar:</Typography>
                  <Typography variant="body2">{selectedAnalysis.weaknesses}</Typography>
                </Grid>
              )}

              {selectedAnalysis.recommendations && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Tavsiyalar:</Typography>
                  <Typography variant="body2">{selectedAnalysis.recommendations}</Typography>
                </Grid>
              )}

              {selectedAnalysis.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Qo'shimcha izohlar:</Typography>
                  <Typography variant="body2">{selectedAnalysis.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Yopish</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default LessonAnalysis;