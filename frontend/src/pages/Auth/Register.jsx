import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Avatar,
  Grid,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  ArrowRight,
  Building,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    school: '',
    subject: '',
  });

  const subjects = [
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
    { value: 'english', label: 'Ingliz tili' },
    { value: 'uzbek', label: "O'zbek tili" },
    { value: 'russian', label: 'Rus tili' },
    { value: 'history', label: 'Tarix' },
    { value: 'geography', label: 'Geografiya' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.password2 || !formData.first_name || !formData.last_name) {
      toast.error("Majburiy maydonlarni to'ldiring!");
      return;
    }

    if (formData.password !== formData.password2) {
      toast.error("Parollar mos kelmadi!");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    setLoading(true);
    try {
      // Faqat backend qabul qiladigan maydonlarni jo'natish
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      };
      await axiosInstance.post('/auth/register/', registerData);
      toast.success("Ro'yxatdan o'tdingiz! Endi kiring.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: 1, display: 'flex' }}
          >
            <Box
              sx={{
                flex: 1,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                p: 6,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 4,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    boxShadow: '0 10px 40px rgba(59,130,246,0.5)',
                  }}
                >
                  <GraduationCap size={64} />
                </Avatar>
              </motion.div>

              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
                Bizga qo'shiling!
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mb: 4 }}>
                Zamonaviy ta'lim tizimining bir qismi bo'ling
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                  Allaqachon hisobingiz bormi?
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    mt: 2,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Kirish
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: 1, display: 'flex' }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Mobile Logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  }}
                >
                  <GraduationCap size={36} />
                </Avatar>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Ro'yxatdan o'tish
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Hisobingizni yarating va boshlang
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Ism"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Familiya"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Foydalanuvchi nomi"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Maktab"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Building size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Fan"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Parol"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Parolni tasdiqlang"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password2}
                      onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                      error={formData.password2 && formData.password !== formData.password2}
                      helperText={formData.password2 && formData.password !== formData.password2 ? "Parollar mos kelmadi" : ""}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={18} color="#3b82f6" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowRight />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(59,130,246,0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
                </Button>

                {/* Mobile Login Link */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Hisobingiz bormi?{' '}
                    <Link
                      onClick={() => navigate('/login')}
                      sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Kirish
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;