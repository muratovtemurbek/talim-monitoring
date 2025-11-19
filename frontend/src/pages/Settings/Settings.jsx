import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { Lock, Save } from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Yangi parollar mos kelmadi!');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Parol kamida 8 ta belgidan iborat bo\'lishi kerak!');
      return;
    }

    try {
      await axiosInstance.post('/auth/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      toast.success('Parol muvaffaqiyatli o\'zgartirildi!');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Sozlamalar</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Lock sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Parolni o'zgartirish</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Alert severity="info" sx={{ mb: 3 }}>
          Parol kamida 8 ta belgidan iborat bo'lishi kerak
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Joriy parol"
            name="old_password"
            type="password"
            value={passwordData.old_password}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Yangi parol"
            name="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Yangi parolni tasdiqlash"
            name="confirm_password"
            type="password"
            value={passwordData.confirm_password}
            onChange={handleChange}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleChangePassword}
            sx={{ alignSelf: 'flex-start' }}
          >
            Parolni o'zgartirish
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;