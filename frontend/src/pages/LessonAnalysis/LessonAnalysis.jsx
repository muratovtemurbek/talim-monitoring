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
      const res = await axiosInstance.get('/teachers/teachers/');
      const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setTeachers(list);
    } catch (err) {
      console.error('O‘qituvchilar yuklanmadi:', err);
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
            { label: 'O‘rtacha baho', value: stats.average_rating ? Number(stats.average_rating).toFixed(2) : '0.00', color: 'info.main' },
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

      {/* Dialoglar (agar kerak bo'lsa, oldingi to'liq kodni qo'ying) */}
      {/* createOpen va viewOpen dialoglari shu yerda bo'ladi */}

    </Container>
  );
};

export default LessonAnalysis;