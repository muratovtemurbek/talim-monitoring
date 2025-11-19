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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import {
  Star,
  TrendingUp,
  Description,
  VideoLibrary,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice';
import { fetchTeacherProfile, fetchMyActivities } from '../../redux/slices/teacherSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" variant="caption" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, color, fontWeight: 'bold' }}>
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

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { profile, activities } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchTeacherProfile());
    dispatch(fetchMyActivities());
  }, [dispatch]);

  const getProgressToNextLevel = () => {
    if (!stats) return 0;
    const points = stats.total_points;
    if (points >= 1000) return 100;
    if (points >= 500) return ((points - 500) / 500) * 100;
    return (points / 500) * 100;
  };

  const getNextLevelText = () => {
    if (!stats) return '';
    const points = stats.total_points;
    if (points >= 1000) return 'Eng yuqori daraja!';
    if (points >= 500) return `Expert darajasigacha: ${1000 - points} ball`;
    return `Assistant darajasigacha: ${500 - points} ball`;
  };

  const getLevelBadge = (level) => {
    const levelMap = {
      teacher: { label: 'O\'qituvchi', color: 'default' },
      assistant: { label: 'Assistant', color: 'primary' },
      expert: { label: 'Expert', color: 'success' },
    };
    const { label, color } = levelMap[level] || levelMap.teacher;
    return <Chip label={label} color={color} size="small" />;
  };

  if (loading || !stats) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6" color="textSecondary">
            Yuklanmoqda...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Xush kelibsiz! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bu yerda sizning faoliyatingiz va yutuqlaringizni kuzatishingiz mumkin
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Jami ball"
            value={stats.total_points}
            icon={<Star sx={{ fontSize: 50 }} />}
            color="#FFD700"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Oylik ball"
            value={stats.monthly_points}
            icon={<TrendingUp sx={{ fontSize: 50 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Materiallar"
            value={stats.total_materials}
            icon={<Description sx={{ fontSize: 50 }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Videolar"
            value={stats.total_videos}
            icon={<VideoLibrary sx={{ fontSize: 50 }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Level Progress */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Daraja o'sishi
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: '#FFD700' }} />
                {getLevelBadge(stats.level)}
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Joriy daraja: <strong>{stats.level}</strong>
                </Typography>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {stats.total_points} ball
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressToNextLevel()}
                sx={{
                  height: 12,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                {getNextLevelText()}
              </Typography>
            </Box>
          </Paper>

          {/* Approved Materials */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tasdiqlangan kontentlar
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.dark" fontWeight="bold">
                    {stats.approved_materials}
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    Materiallar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    / {stats.total_materials} jami
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="h4" color="warning.dark" fontWeight="bold">
                    {stats.approved_videos}
                  </Typography>
                  <Typography variant="body2" color="warning.dark">
                    Videolar
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    / {stats.total_videos} jami
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/materials')}
              >
                Material yuklash
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/videos')}
              >
                Video yuklash
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              So'nggi faoliyatlar
            </Typography>

            {activities && activities.length > 0 ? (
              <List dense>
                {activities.slice(0, 8).map((activity) => (
                  <ListItem
                    key={activity.id}
                    divider
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemText
                      primary={activity.title}
                      secondary={new Date(activity.date).toLocaleDateString('uz-UZ', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500
                      }}
                    />
                    <Chip
                      label={`+${activity.points}`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body2" color="textSecondary">
                  Faoliyat topilmadi
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Material yoki video yuklashdan boshlang!
                </Typography>
              </Box>
            )}

            {activities && activities.length > 8 && (
              <Button
                size="small"
                fullWidth
                sx={{ mt: 2 }}
              >
                Barchasini ko'rish
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard;