import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Add,
  Edit,
  Delete,
  LocationOn,
  Phone,
  Email,
  Person,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Schools = () => {
  const { user } = useSelector((state) => state.auth);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    director_name: '',
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/schools/');

      // API dan kelgan ma'lumotni tekshirish
      if (Array.isArray(response.data)) {
        setSchools(response.data);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        setSchools(response.data.results);
      } else {
        console.error('Noto\'g\'ri format:', response.data);
        setSchools([]);
        toast.error('Ma\'lumotlar formatida xatolik');
      }
    } catch (error) {
      console.error('Xatolik:', error);
      setSchools([]);
      toast.error('Maktablarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Maktab nomi va manzilni kiriting!');
      return;
    }

    try {
      await axiosInstance.post('/schools/', formData);
      toast.success('Maktab qo\'shildi!');
      setCreateOpen(false);
      fetchSchools();
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        director_name: '',
      });
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Maktab qo\'shishda xatolik');
    }
  };

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      phone: school.phone || '',
      email: school.email || '',
      director_name: school.director_name || '',
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/schools/${selectedSchool.id}/`, formData);
      toast.success('Maktab yangilandi!');
      setEditOpen(false);
      fetchSchools();
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Maktab yangilashda xatolik');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      await axiosInstance.delete(`/schools/${id}/`);
      toast.success('Maktab o\'chirildi');
      fetchSchools();
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('O\'chirishda xatolik');
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1 }} />
          Maktablar
        </Typography>
        {(user?.role === 'superadmin' || user?.is_superuser) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
          >
            Yangi maktab
          </Button>
        )}
      </Box>

      {/* Schools Grid */}
      {schools.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Maktablar topilmadi
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Yangi maktab qo'shish uchun yuqoridagi tugmani bosing
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {schools.map((school) => (
            <Grid item xs={12} sm={6} md={4} key={school.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {school.name}
                    </Typography>
                    <Chip
                      label={`${school.teacher_count || 0} o'qituvchi`}
                      size="small"
                      color="primary"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {school.address}
                    </Typography>
                  </Box>

                  {school.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {school.phone}
                      </Typography>
                    </Box>
                  )}

                  {school.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {school.email}
                      </Typography>
                    </Box>
                  )}

                  {school.director_name && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        Direktor: {school.director_name}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                {(user?.role === 'superadmin' || user?.is_superuser) && (
                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(school)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(school.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yangi maktab qo'shish</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Maktab nomi"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Manzil"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Direktor"
              name="director_name"
              value={formData.director_name}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleCreate} variant="contained">
            Qo'shish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Maktabni tahrirlash</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Maktab nomi"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Manzil"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Direktor"
              name="director_name"
              value={formData.director_name}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleUpdate} variant="contained">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schools;