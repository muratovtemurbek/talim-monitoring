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
  Users,
  School,
  BookOpen,
  Video,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import StatCard from '../../components/Common/StatCard';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SuperadminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get('/auth/dashboard/');
      setStats(response.data);
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
                {user?.first_name?.charAt(0) || 'S'}
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
                  Xush kelibsiz, {user?.first_name}! 👑
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label="SUPERADMIN"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    label="TIZIM NAZORATI"
                    sx={{
                      bgcolor: 'rgba(236,72,153,0.3)',
                      color: 'white',
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
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Jami Foydalanuvchilar"
              value={stats?.total_users || 5}
              icon={<Users />}
              color="#6366f1"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="O'qituvchilar"
              value={stats?.total_teachers || 2}
              icon={<School />}
              color="#ec4899"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Maktablar"
              value={stats?.total_schools || 2}
              icon={<School />}
              color="#10b981"
              trend={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Materiallar"
              value={stats?.total_materials || 1}
              icon={<BookOpen />}
              color="#f59e0b"
              trend={15}
            />
          </Grid>
        </Grid>

        {/* Second Row Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Videolar"
              value={stats?.total_videos || 1}
              icon={<Video />}
              color="#3b82f6"
              trend={10}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Kutilmoqda"
              value={stats?.pending_materials || 0}
              icon={<Clock />}
              color="#f97316"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tasdiqlangan"
              value={stats?.approved_materials || 0}
              icon={<CheckCircle />}
              color="#22c55e"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Umumiy Ball"
              value={stats?.total_points || 0}
              icon={<TrendingUp />}
              color="#8b5cf6"
            />
          </Grid>
        </Grid>

        {/* Bottom Grid */}
        <Grid container spacing={3}>
          {/* Kutilayotgan tasdiqlar */}
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
                  <AlertCircle size={24} color="#f59e0b" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                    Kutilayotgan Tasdiqlar
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'warning.light',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>📚 Materiallar</Typography>
                    <Chip
                      label={stats?.pending_materials || 0}
                      size="small"
                      sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 700 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'info.light',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>🎥 Videolar</Typography>
                    <Chip
                      label={stats?.pending_videos || 0}
                      size="small"
                      sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Umumiy statistika */}
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
                  <CheckCircle size={24} color="#10b981" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
                    Tizim Statistikasi
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'success.light',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {stats?.total_videos || 1}
                      </Typography>
                      <Typography variant="caption">Videolar</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'info.light',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                        {stats?.total_consultations || 0}
                      </Typography>
                      <Typography variant="caption">Maslahatlar</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'warning.light',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                        {stats?.total_library || 0}
                      </Typography>
                      <Typography variant="caption">Kutubxona</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'error.light',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.dark' }}>
                        {stats?.total_ratings || 0}
                      </Typography>
                      <Typography variant="caption">Baholashlar</Typography>
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

export default SuperadminDashboard;