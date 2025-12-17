import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/auth/password-reset/', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Mail size={40} color="white" />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Parolni tiklash
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email manzilingizni kiriting, sizga parolni tiklash havolasi yuboriladi
            </Typography>
          </Box>

          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Parol tiklash havolasi emailingizga yuborildi. Iltimos, emailingizni tekshiring.
              </Alert>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<ArrowLeft size={20} />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Loginga qaytish
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8, color: '#666' }} />,
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Yuborish'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<ArrowLeft size={20} />}
                  sx={{ textTransform: 'none' }}
                >
                  Loginga qaytish
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
