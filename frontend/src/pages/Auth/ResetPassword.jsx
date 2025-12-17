import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import axiosInstance from '../../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axiosInstance.get(`/auth/password-reset/validate/${token}/`);
      if (response.data.valid) {
        setValid(true);
        setEmail(response.data.email);
      } else {
        setError(response.data.error || 'Token yaroqsiz');
      }
    } catch (err) {
      setError('Token tekshirishda xatolik');
    } finally {
      setValidating(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError('Parollar mos kelmadi');
      return;
    }

    if (password.length < 8) {
      setError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/auth/password-reset/confirm/', {
        token: token,
        new_password: password,
        new_password2: password2,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.new_password?.[0] || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

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
          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <CheckCircle size={40} color="white" />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Parol muvaffaqiyatli yangilandi!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Siz 3 soniyadan keyin login sahifasiga yo'naltirilasiz...
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Hoziroq kirish
              </Button>
            </Box>
          ) : !valid ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || 'Bu havola yaroqsiz yoki muddati tugagan'}
              </Alert>
              <Button
                component={Link}
                to="/forgot-password"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Yangi so'rov yuborish
              </Button>
            </Box>
          ) : (
            <>
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
                  <Lock size={40} color="white" />
                </Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Yangi parol
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {email} uchun yangi parol o'rnating
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Yangi parol"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#666' }} />,
                  }}
                  helperText="Kamida 8 ta belgi"
                />

                <TextField
                  fullWidth
                  label="Parolni tasdiqlang"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#666' }} />,
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Parolni yangilash'}
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
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
