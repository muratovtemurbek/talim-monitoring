import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
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
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  EmojiEvents,
  Download,
  PictureAsPdf,
  Search,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Ratings = () => {
  const [ratings, setRatings] = useState([]); // har doim array
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/ratings/');

      // Muhim qator: results ni olish yoki to'g'ridan array
      const data = response.data.results || response.data || [];

      // Har qanday holatda ham array ekanligiga ishonch hosil qilamiz
      setRatings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Reyting yuklashda xatolik:', error);
      toast.error('Reytinglarni yuklashda xatolik yuz berdi');
      setRatings([]); // xatolik bo'lsa ham array qaytaramiz
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get('/auth/export/ratings/excel/', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reyting_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel fayl yuklab olindi!');
    } catch (error) {
      toast.error('Excel yuklab olishda xatolik');
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await axiosInstance.get('/auth/export/ratings/pdf/', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reyting_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF fayl yuklab olindi!');
    } catch (error) {
      toast.error('PDF yuklab olishda xatolik');
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // oltin
    if (rank === 2) return '#C0C0C0'; // kumush
    if (rank === 3) return '#CD7F32'; // bronza
    return 'transparent';
  };

  const getRankIcon = (change) => {
    if (change > 0) return <TrendingUp color="success" />;
    if (change < 0) return <TrendingDown color="error" />;
    return <Remove color="disabled" />;
  };

  // Qidiruv – har doim array ustida ishlaydi
  const filteredRatings = ratings.filter((rating) => {
    if (!rating) return false;
    const searchLower = search.toLowerCase();
    return (
      rating.teacher_name?.toLowerCase().includes(searchLower) ||
      rating.school_name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          <EmojiEvents sx={{ mr: 2, fontSize: 40, color: '#FFD700' }} />
          O'qituvchilar Reytingi
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExportExcel}>
            Excel
          </Button>
          <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPDF} color="error">
            PDF
          </Button>
        </Box>
      </Box>

      {/* Qidiruv */}
      <TextField
        fullWidth
        placeholder="O'qituvchi yoki maktab bo'yicha qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      {/* Jadval */}
      <TableContainer component={Paper} elevation={true} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>O'rin</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>O'qituvchi</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Maktab</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Umumiy ball</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Oylik ball</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Daraja</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>O'zgarish</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Yuklanmoqda...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredRatings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Hech narsa topilmadi
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRatings.map((rating, index) => (
                <TableRow
                  key={rating.id || index}
                  sx={{
                    backgroundColor: getRankColor(rating.rank),
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell align="center">
                    {rating.rank <= 3 ? (
                      <EmojiEvents
                        sx={{
                          fontSize: 40,
                          color: getRankColor(rating.rank),
                        }}
                      />
                    ) : (
                      <Typography variant="h5" fontWeight="bold">
                        {rating.rank}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {rating.teacher_name?.charAt(0).toUpperCase() || 'T'}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="medium">{rating.teacher_name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{rating.school_name || '-'}</TableCell>

                  <TableCell align="center">
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {rating.total_points || 0}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography color="text.secondary">
                      {rating.monthly_points || 0}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={rating.level || 'Belgilanmagan'}
                      color={
                        rating.level === 'expert'
                          ? 'success'
                          : rating.level === 'assistant'
                          ? 'primary'
                          : 'default'
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {getRankIcon(rating.rank_change)}
                      <Typography
                        variant="body2"
                        color={rating.rank_change > 0 ? 'success.main' : rating.rank_change < 0 ? 'error.main' : 'text.secondary'}
                      >
                        {rating.rank_change > 0 ? `+${rating.rank_change}` : rating.rank_change || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Ratings;