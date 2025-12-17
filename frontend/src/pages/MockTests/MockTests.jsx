import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestCard from '../../components/MockTests/TestCard';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const MockTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [tests, searchQuery, subjectFilter, difficultyFilter, tabValue]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/mock-tests/');
      const data = response.data.results || response.data;
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Mock tests error:', error);
      toast.error('Testlarni yuklashda xatolik');
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = [...tests];

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter((t) => t.attempts_count > 0);
    } else if (tabValue === 2) {
      filtered = filtered.filter((t) => t.best_score !== null && t.best_score >= t.passing_score);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter((t) => t.subject === subjectFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((t) => t.difficulty === difficultyFilter);
    }

    setFilteredTests(filtered);
  };

  const handleStartTest = (test) => {
    navigate(`/mock-tests/${test.id}/take`);
  };

  const subjects = [
    { value: 'all', label: 'Barcha fanlar' },
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
    { value: 'pedagogy', label: 'Pedagogika' },
    { value: 'psychology', label: 'Psixologiya' },
  ];

  const difficulties = [
    { value: 'all', label: 'Barcha darajalar' },
    { value: 'easy', label: 'Oson' },
    { value: 'medium', label: "O'rtacha" },
    { value: 'hard', label: 'Qiyin' },
  ];

  const getTabLabel = (index) => {
    const labels = ['Barcha testlar', 'Topshirilganlar', 'O\'tilganlar'];
    const counts = [
      tests.length,
      tests.filter((t) => t.attempts_count > 0).length,
      tests.filter((t) => t.best_score !== null && t.best_score >= t.passing_score).length,
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {labels[index]}
        <Chip
          label={counts[index]}
          size="small"
          sx={{
            bgcolor: tabValue === index ? 'success.main' : 'grey.300',
            color: tabValue === index ? 'white' : 'text.secondary',
            fontWeight: 700,
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Mock Testlar"
          subtitle="Malaka oshirish va bilim tekshirish"
          icon={FileText}
        />

        {/* Tabs & Filters */}
        <Paper
          sx={{
            borderRadius: 3,
            p: 2,
            mb: 3,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{ mb: 2 }}
          >
            <Tab label={getTabLabel(0)} />
            <Tab label={getTabLabel(1)} />
            <Tab label={getTabLabel(2)} />
          </Tabs>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Test nomi yoki tavsif..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Fan</InputLabel>
                <Select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  label="Fan"
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
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
                <InputLabel>Qiyinlik</InputLabel>
                <Select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  label="Qiyinlik"
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                >
                  {difficulties.map((diff) => (
                    <MenuItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Testlar yuklanmoqda..." />
        ) : filteredTests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Testlar topilmadi"
            message={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi."
                : "Hozircha testlar yo'q."
            }
          />
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredTests.map((test, index) => (
                <Grid item xs={12} sm={6} md={4} key={test.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TestCard test={test} onStart={handleStartTest} />
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MockTests;