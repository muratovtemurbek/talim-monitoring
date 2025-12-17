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
  BookOpen,
  Video,
  TrendingUp,
  Clock,
  CheckCircle,
  School,
} from 'lucide-react';
import StatCard from '../../components/Common/StatCard';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
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
                {user?.first_name?.charAt(0) || 'A'}
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
                  Xush kelibsiz, {user?.first_name}! 🎓
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label="ADMIN"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 700,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    label={`📍 ${stats?.school_name || 'Maktab'}`}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.3)',
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
              title="O'qituvchilar"
              value={stats?.total_teachers || 0}
              icon={<Users />}
              color="#6366f1"
              trend={8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Materiallar"
              value={stats?.total_materials || 0}
              icon={<BookOpen />}
              color="#ec4899"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Videolar"
              value={stats?.total_videos || 0}
              icon={<Video />}
              color="#10b981"
              trend={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Umumiy Ball"
              value={stats?.total_points || 0}
              icon={<TrendingUp />}
              color="#f59e0b"
              trend={15}
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
                  <Clock size={24} color="#f59e0b" />
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
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>📚 Materiallar</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {stats?.pending_materials || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'info.light',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>🎥 Videolar</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {stats?.pending_videos || 0}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Maktab statistikasi */}
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
                    Maktab Statistikasi
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'success.light' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {stats?.approved_materials || 0}
                      </Typography>
                      <Typography variant="caption">Tasdiqlangan</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'info.light' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.dark' }}>
                        {stats?.total_teachers || 0}
                      </Typography>
                      <Typography variant="caption">O'qituvchilar</Typography>
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

export default AdminDashboard;