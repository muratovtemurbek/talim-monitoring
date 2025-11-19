import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Edit,
  Save,
  PhotoCamera,
} from '@mui/icons-material';
import { getProfile } from '../../redux/slices/authSlice';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put('/auth/profile/', formData);
      toast.success('Profil yangilandi!');
      setEditing(false);
      dispatch(getProfile());
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  if (!user) {
    return <Typography>Yuklanmoqda...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Profil</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: 40,
              bgcolor: 'primary.main',
              mr: 3,
            }}
          >
            {user.first_name?.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              @{user.username}
            </Typography>
            <Typography variant="caption" color="primary">
              {user.role === 'superadmin' ? 'SUPERADMIN' :
               user.role === 'admin' ? 'ADMIN' : 'O\'QITUVCHI'}
            </Typography>
          </Box>
          <Button
            variant={editing ? 'contained' : 'outlined'}
            startIcon={editing ? <Save /> : <Edit />}
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? 'Saqlash' : 'Tahrirlash'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ism"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Familiya"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Foydalanuvchi nomi"
              value={user.username}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;