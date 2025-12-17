import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Star,
  Crown,
  Zap,
} from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import CountUp from 'react-countup';

const Ratings = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchQuery, subjectFilter, schoolFilter]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/ratings/');
      const data = response.data.results || response.data;
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Reyting xatolik:', error);
      toast.error('Reytingni yuklashda xatolik');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.school_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((t) => t.subject === subjectFilter);
    }

    // School filter
    if (schoolFilter !== 'all') {
      filtered = filtered.filter((t) => t.school_id === parseInt(schoolFilter));
    }

    setFilteredTeachers(filtered);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return <Trophy size={20} color="#94a3b8" />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#64748b';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      math: '#6366f1',
      physics: '#ec4899',
      chemistry: '#10b981',
      biology: '#f59e0b',
      informatics: '#3b82f6',
      default: '#64748b',
    };
    return colors[subject] || colors.default;
  };

  const subjects = [
    { value: 'all', label: 'Barcha fanlar' },
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
  ];

  const schools = [
    { value: 'all', label: 'Barcha maktablar' },
    { value: '1', label: '1-Maktab' },
    { value: '2', label: '2-Maktab' },
  ];

  // Top 3 teachers
  const topThree = filteredTeachers.slice(0, 3);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Reyting Jadvali"
          subtitle="O'qituvchilar reytingi va statistikasi"
          icon={Trophy}
        />

        {/* Filters */}
        <Paper
          sx={{
            borderRadius: 3,
            p: 2,
            mb: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O'qituvchi yoki maktab nomi..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Fan</InputLabel>
                <Select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  label="Fan"
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                  }}
                >
                  {subjects.map((sub) => (
                    <MenuItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Maktab</InputLabel>
                <Select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  label="Maktab"
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                  }}
                >
                  {schools.map((school) => (
                    <MenuItem key={school.value} value={school.value}>
                      {school.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <LoadingSpinner message="Reyting yuklanmoqda..." />
        ) : filteredTeachers.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Reyting topilmadi"
            message="Hozircha reyting ma'lumotlari yo'q"
          />
        ) : (
          <>
            {/* Top 3 Cards */}
            {topThree.length > 0 && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {topThree.map((teacher, index) => (
                  <Grid item xs={12} md={4} key={teacher.teacher_id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: `linear-gradient(135deg, ${getRankColor(index + 1)}20 0%, ${getRankColor(index + 1)}10 100%)`,
                          border: `2px solid ${getRankColor(index + 1)}40`,
                          position: 'relative',
                          overflow: 'visible',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 16px 48px ${getRankColor(index + 1)}40`,
                          },
                        }}
                      >
                        {/* Rank Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: getRankColor(index + 1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 20px ${getRankColor(index + 1)}60`,
                          }}
                        >
                          {getRankIcon(index + 1)}
                        </Box>

                        <CardContent sx={{ textAlign: 'center', pt: 5 }}>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 2,
                              bgcolor: getRankColor(index + 1),
                              fontSize: '2rem',
                              fontWeight: 700,
                            }}
                          >
                            {teacher.teacher_name?.charAt(0) || 'T'}
                          </Avatar>

                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {teacher.teacher_name}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {teacher.school_name}
                          </Typography>

                          <Chip
                            label={teacher.subject_display || teacher.subject}
                            size="small"
                            sx={{
                              bgcolor: `${getSubjectColor(teacher.subject)}20`,
                              color: getSubjectColor(teacher.subject),
                              fontWeight: 700,
                              mb: 2,
                            }}
                          />

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            <Star size={24} color={getRankColor(index + 1)} fill={getRankColor(index + 1)} />
                            <Typography variant="h4" sx={{ fontWeight: 800, color: getRankColor(index + 1) }}>
                              <CountUp end={teacher.total_points || 0} duration={2} />
                            </Typography>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {teacher.total_materials || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Materiallar
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {teacher.total_videos || 0}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Videolar
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: 'grey.50',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>O'rin</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>O'qituvchi</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Maktab</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Fan</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Materiallar</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Videolar</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Ball</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {filteredTeachers.map((teacher, index) => (
                        <motion.tr
                          key={teacher.teacher_id}
                          component={TableRow}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          sx={{
                            '&:hover': {
                              bgcolor: 'grey.50',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getRankIcon(index + 1)}
                              <Typography variant="h6" sx={{ fontWeight: 700, color: getRankColor(index + 1) }}>
                                {index + 1}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: getSubjectColor(teacher.subject),
                                  width: 40,
                                  height: 40,
                                  fontWeight: 700,
                                }}
                              >
                                {teacher.teacher_name?.charAt(0) || 'T'}
                              </Avatar>
                              <Typography sx={{ fontWeight: 600 }}>{teacher.teacher_name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{teacher.school_name}</TableCell>
                          <TableCell>
                            <Chip
                              label={teacher.subject_display || teacher.subject}
                              size="small"
                              sx={{
                                bgcolor: `${getSubjectColor(teacher.subject)}20`,
                                color: getSubjectColor(teacher.subject),
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label={teacher.total_materials || 0} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            <Chip label={teacher.total_videos || 0} size="small" color="error" />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                              <Zap size={20} color="#f59e0b" fill="#f59e0b" />
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                                {teacher.total_points || 0}
                              </Typography>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Ratings;