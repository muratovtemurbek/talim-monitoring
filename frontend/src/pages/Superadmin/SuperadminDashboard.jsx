import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  People,
  School,
  Description,
  VideoLibrary,
  TrendingUp,
} from '@mui/icons-material';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" variant="caption">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, color }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.3 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const SuperadminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <Container>
        <Typography>Yuklanmoqda...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Superadmin Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tizim umumiy ko'rinishi
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Jami Foydalanuvchilar"
            value={stats.total_users}
            icon={<People sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="O'qituvchilar"
            value={stats.total_teachers}
            icon={<People sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Maktablar"
            value={stats.total_schools}
            icon={<School sx={{ fontSize: 40 }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Materiallar"
            value={stats.total_materials}
            icon={<Description sx={{ fontSize: 40 }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kutilayotgan tasdiqlar
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="h3" color="warning.main">
                  {stats.pending_materials}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Materiallar
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="warning.main">
                  {stats.pending_videos}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Videolar
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Umumiy statistika
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Videolar</Typography>
                <Typography variant="body2" color="primary">
                  {stats.total_videos}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Maslahatlar</Typography>
                <Typography variant="body2" color="primary">
                  {stats.total_consultations}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SuperadminDashboard;