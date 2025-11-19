import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp,
  School,
  Person,
  Description,
  VideoLibrary,
  Assessment,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import MonthlyActivityChart from '../../components/Charts/MonthlyActivityChart';
import SubjectDistributionChart from '../../components/Charts/SubjectDistributionChart';
import TeacherComparisonChart from '../../components/Charts/TeacherComparisonChart';
import GrowthTrendChart from '../../components/Charts/GrowthTrendChart';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" variant="caption" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
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

const Statistics = () => {
  const [overview, setOverview] = useState(null);
  const [monthlyActivity, setMonthlyActivity] = useState([]);
  const [subjectDistribution, setSubjectDistribution] = useState([]);
  const [teacherComparison, setTeacherComparison] = useState([]);
  const [growthTrend, setGrowthTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [overviewRes, monthlyRes, subjectRes, teacherRes, growthRes] = await Promise.all([
        axiosInstance.get('/auth/analytics-overview/'),
        axiosInstance.get('/auth/charts/?type=monthly_activity'),
        axiosInstance.get('/auth/charts/?type=subject_distribution'),
        axiosInstance.get('/auth/charts/?type=teacher_comparison'),
        axiosInstance.get('/auth/charts/?type=growth_trend'),
      ]);

      setOverview(overviewRes.data);
      setMonthlyActivity(monthlyRes.data);
      setSubjectDistribution(subjectRes.data);
      setTeacherComparison(teacherRes.data);
      setGrowthTrend(growthRes.data);
    } catch (error) {
      console.error('Xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Yuklanmoqda...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BarChartIcon sx={{ mr: 1 }} />
        Statistika va Tahlil
      </Typography>

      {/* Overview Cards */}
      {overview && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Jami O'qituvchilar"
              value={overview.total_teachers}
              icon={<Person sx={{ fontSize: 50 }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Faol O'qituvchilar"
              value={overview.active_teachers}
              icon={<TrendingUp sx={{ fontSize: 50 }} />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Maktablar"
              value={overview.total_schools}
              icon={<School sx={{ fontSize: 50 }} />}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Jami Materiallar"
              value={overview.total_materials}
              icon={<Description sx={{ fontSize: 50 }} />}
              color="#9c27b0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tasdiqlangan Materiallar"
              value={overview.approved_materials}
              icon={<Description sx={{ fontSize: 50 }} />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Jami Videolar"
              value={overview.total_videos}
              icon={<VideoLibrary sx={{ fontSize: 50 }} />}
              color="#f44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Dars Tahlillari"
              value={overview.total_analyses}
              icon={<Assessment sx={{ fontSize: 50 }} />}
              color="#00bcd4"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Jami Ballar"
              value={overview.total_points_distributed}
              icon={<TrendingUp sx={{ fontSize: 50 }} />}
              color="#ffc107"
            />
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <MonthlyActivityChart data={monthlyActivity} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <SubjectDistributionChart data={subjectDistribution} />
        </Grid>
        <Grid item xs={12}>
          <TeacherComparisonChart data={teacherComparison} />
        </Grid>
        <Grid item xs={12}>
          <GrowthTrendChart data={growthTrend} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;