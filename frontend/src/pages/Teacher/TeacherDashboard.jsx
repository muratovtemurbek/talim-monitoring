import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BookOpen,
  Video,
  Award,
  Star,
  CheckCircle,
  FileText,
} from 'lucide-react';
import StatCard from '../../components/Common/StatCard';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockTestsCount, setMockTestsCount] = useState(0);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/auth/dashboard/');
      setStats(response.data);

      // Mock Tests statsini olish
      try {
        const testsResponse = await axiosInstance.get('/mock-tests/my-attempts/');
        setMockTestsCount(testsResponse.data.length);
      } catch (error) {
        console.log('Mock tests yuklanmadi:', error);
      }
    } catch (error) {
      console.error('Dashboard xatolik:', error);
      toast.error('Statistikani yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: 300 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                {user?.first_name?.charAt(0) || 'T'}
              </Avatar>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  Xush kelibsiz, {user?.first_name}! 👋
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label="O'QITUVCHI"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <StatCard
              title="Umumiy Ball"
              value={stats?.total_points || 0}
              icon={<TrendingUp />}
              color="#6366f1"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <StatCard
              title="Materiallar"
              value={stats?.total_materials || 0}
              icon={<BookOpen />}
              color="#ec4899"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <StatCard
              title="Videolar"
              value={stats?.total_videos || 0}
              icon={<Video />}
              color="#10b981"
              trend={-3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <StatCard
              title="Mock Testlar"
              value={mockTestsCount}
              icon={<FileText />}
              color="#f59e0b"
            />
          </Grid>
        </Grid>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              mb: 4,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'warning.main',
                  mr: 2,
                  boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
                }}
              >
                <Star size={32} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Daraja: {stats?.level || 'Teacher'} 🎯
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keyingi darajagacha: <strong>{stats?.points_to_next_level || 500} ball</strong>
                </Typography>
              </Box>
              <Chip
                label={`${stats?.level_progress || 0}%`}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  height: 40,
                }}
              />
            </Box>

            <LinearProgress
              variant="determinate"
              value={stats?.level_progress || 0}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                },
              }}
            />
          </Paper>
        </motion.div>

        {/* Bottom Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CheckCircle size={24} color="#10b981" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                    So'nggi Faoliyatlar
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tez orada bu yerda sizning faoliyatlaringiz ko'rsatiladi
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Star size={24} color="#f59e0b" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                    Yutuqlar
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'success.light' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {stats?.total_materials || 0}
                      </Typography>
                      <Typography variant="caption">Materiallar</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'info.light' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                        {stats?.total_videos || 0}
                      </Typography>
                      <Typography variant="caption">Videolar</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TeacherDashboard;