import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import LibraryCard from '../../components/Library/LibraryCard';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Library = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, categoryFilter]);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/library/');
      const data = response.data.results || response.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Kutubxona xatolik:', error);
      toast.error('Kutubxonani yuklashda xatolik');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
    setPage(1);
  };

  const handleDownload = async (item) => {
    try {
      if (item.file) {
        window.open(item.file, '_blank');
        await axiosInstance.post(`/library/${item.id}/increment_download/`);
        toast.success('Yuklab olinmoqda...');
        fetchLibrary();
      } else {
        toast.error('Fayl topilmadi');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleView = async (item) => {
    try {
      await axiosInstance.post(`/library/${item.id}/increment_view/`);
      if (item.file) {
        window.open(item.file, '_blank');
      } else if (item.url) {
        window.open(item.url, '_blank');
      }
      fetchLibrary();
    } catch (error) {
      console.error('View error:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'Barcha kategoriyalar' },
    { value: 'book', label: 'Kitoblar' },
    { value: 'article', label: 'Maqolalar' },
    { value: 'research', label: 'Tadqiqotlar' },
    { value: 'guide', label: "Qo'llanmalar" },
    { value: 'reference', label: 'Ma\'lumotnomalar' },
  ];

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getCategoryCount = (category) => {
    if (category === 'all') return items.length;
    return items.filter((item) => item.category === category).length;
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
        <PageHeader
          title="Kutubxona"
          subtitle="Darslik va qo'llanmalar kutubxonasi"
          icon={BookOpen}
        />

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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kitob, muallif yoki mavzu bo'yicha qidirish..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kategoriya</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Kategoriya"
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>{cat.label}</span>
                        <Chip
                          label={getCategoryCount(cat.value)}
                          size="small"
                          sx={{ ml: 1, fontWeight: 700 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <LoadingSpinner message="Kutubxona yuklanmoqda..." />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Resurslar topilmadi"
            message={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi."
                : "Bu kategoriyada hozircha resurslar yo'q."
            }
          />
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <BookOpen size={24} color="#10b981" />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Jami <strong>{filteredItems.length}</strong> ta resurs topildi
                </Typography>
              </Paper>
            </Box>

            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <LibraryCard
                        item={item}
                        onDownload={handleDownload}
                        onView={handleView}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                    },
                    '& .Mui-selected': {
                      bgcolor: 'white !important',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Library;