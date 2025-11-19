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
  Button,
} from '@mui/material';
import {
  People,
  Description,
  VideoLibrary,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {stats.school_name} - Boshqaruv paneli
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="O'qituvchilar"
            value={stats.total_teachers}
            icon={<People sx={{ fontSize: 40 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Materiallar"
            value={stats.total_materials}
            icon={<Description sx={{ fontSize: 40 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Videolar"
            value={stats.total_videos}
            icon={<VideoLibrary sx={{ fontSize: 40 }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Kutilmoqda"
            value={stats.pending_materials + stats.pending_videos}
            icon={<CheckCircle sx={{ fontSize: 40 }} />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tasdiqlash kerak
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Materiallar</Typography>
                <Typography color="warning.main" variant="h6">
                  {stats.pending_materials}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Videolar</Typography>
                <Typography color="warning.main" variant="h6">
                  {stats.pending_videos}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/materials')}
              >
                Tasdiqlashga o'tish
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tezkor havolalar
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/ratings')}>
                O'qituvchilar reytingi
              </Button>
              <Button variant="outlined" onClick={() => navigate('/statistics')}>
                Statistika
              </Button>
              <Button variant="outlined" onClick={() => navigate('/schools')}>
                Maktab ma'lumotlari
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;