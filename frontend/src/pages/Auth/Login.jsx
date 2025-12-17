import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);

    try {
      // Redux async thunk ishlatish
      await dispatch(login({
        username: formData.username,
        password: formData.password,
      })).unwrap();

      toast.success('Xush kelibsiz!');
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.error || 'Login yoki parol noto\'g\'ri');
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
      }}
    >
      {/* Animated Background Circles */}
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
            minHeight: '600px',
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
                position: 'relative',
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
                EMS
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', mb: 4 }}>
                Educational Monitoring System
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                  Yangi foydalanuvchimisiz?
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
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
                  Ro'yxatdan o'tish
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Right Side - Login Form */}
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
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Mobile Logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  }}
                >
                  <GraduationCap size={48} />
                </Avatar>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Xush kelibsiz!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Davom etish uchun hisobingizga kiring
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Foydalanuvchi nomi"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color="#3b82f6" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Parol"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#3b82f6" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        sx={{ color: 'primary.main' }}
                      />
                    }
                    label="Eslab qolish"
                  />
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    underline="hover"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    Parolni unutdingizmi?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  endIcon={<ArrowRight />}
                  sx={{
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
                  {loading ? 'Yuklanmoqda...' : 'Kirish'}
                </Button>

                {/* Mobile Register Link */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Hisobingiz yo'qmi?{' '}
                    <Link
                      onClick={() => navigate('/register')}
                      sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Ro'yxatdan o'tish
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

export default Login;