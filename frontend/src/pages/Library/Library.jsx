import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  MenuBook,
  Visibility,
  Download,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Library = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();

      const response = await axiosInstance.get('/library/', { params });

      // Pagination bo'lsa results, aks holda to'g'ridan array
      const data = response.data.results || response.data || [];

      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Kutubxona resurslari yuklanmadi:', error);
      toast.error('Resurslarni yuklashda xatolik yuz berdi');
      setResources([]);
    }
  };

  const handleSearch = () => {
    fetchResources();
  };

  const handleView = async (resource) => {
    try {
      await axiosInstance.post(`/library/${resource.id}/increment_view/`);

      if (resource.file) {
        window.open(resource.file, '_blank', 'noopener,noreferrer');
      } else if (resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }

      fetchResources(); // views sonini yangilash uchun
    } catch (error) {
      console.error('Resurs ochishda xatolik:', error);
      // Xato bo'lsa ham havolani ochamiz
      if (resource.file) window.open(resource.file, '_blank');
      if (resource.url) window.open(resource.url, '_blank');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Sarlavha */}
      <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography
          variant="h3"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            fontWeight: 'bold',
          }}
        >
          <MenuBook sx={{ mr: 2, fontSize: 50, color: 'primary.main' }} />
          Kutubxona
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          O'quv adabiyotlari, darsliklar va foydali materiallar
        </Typography>
      </Box>

      {/* Qidiruv */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={10}>
            <TextField
              fullWidth
              placeholder="Kitob, maqola, muallif yoki mavzu bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              sx={{ height: 56 }}
            >
              Qidirish
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Resurslar ro'yxati */}
      <Grid container spacing={4}>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 10, transform: 'translateY(-4px)' },
                }}
              >
                {/* Muqova */}
                {resource.cover_image ? (
                  <CardMedia
                    component="img"
                    height="220"
                    image={resource.cover_image}
                    alt={resource.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MenuBook sx={{ fontSize: 90, color: 'grey.400' }} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {resource.title}
                  </Typography>

                  {resource.author && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Muallif: <strong>{resource.author}</strong>
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {resource.description
                      ? resource.description.length > 120
                        ? `${resource.description.substring(0, 120)}...`
                        : resource.description
                      : 'Tavsif mavjud emas'}
                  </Typography>

                  <Chip
                    label={resource.resource_type_display || 'Resurs'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Visibility sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="caption">{resource.views || 0} marta ko'rildi</Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => handleView(resource)}
                  >
                    Ochish / Yuklab olish
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <MenuBook sx={{ fontSize: 100, color: 'grey.300', mb: 3 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {search ? 'Hech narsa topilmadi' : 'Hozircha kutubxonada resurs yo‘q'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {search
                  ? `"${search}" so'rovi bo'yicha natija yo'q`
                  : 'Tez orada yangi materiallar qo‘shiladi'}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Library;