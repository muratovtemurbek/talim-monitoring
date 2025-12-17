import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Edit,
  Save,
  X,
  Camera,
  TrendingUp,
  BookOpen,
  Video,
  Star,
} from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, dashboardRes] = await Promise.all([
        axiosInstance.get('/auth/profile/'),
        axiosInstance.get('/auth/dashboard/'),
      ]);

      setProfile(profileRes.data);
      setStats(dashboardRes.data);
      setFormData({
        first_name: profileRes.data.first_name || '',
        last_name: profileRes.data.last_name || '',
        email: profileRes.data.email || '',
        phone: profileRes.data.phone || '',
        bio: profileRes.data.bio || '',
      });
    } catch (error) {
      console.error('Profile error:', error);
      toast.error('Profilni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/auth/profile/', formData);
      toast.success('Profil yangilandi!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
    });
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Profil"
          subtitle="Shaxsiy ma'lumotlar va sozlamalar"
          icon={User}
        />

        {loading && !profile ? (
          <Box sx={{ mt: 4 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Left Column - Profile Info */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Avatar */}
                  <Box sx={{ position: 'relative', mb: 3, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '3rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                      }}
                    >
                      {profile?.first_name?.charAt(0) || 'U'}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: '50%',
                        transform: 'translateX(40px)',
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: 'grey.100',
                        },
                      }}
                    >
                      <Camera size={20} />
                    </IconButton>
                  </Box>

                  {/* Name & Role */}
                  <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
                    {profile?.first_name} {profile?.last_name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                    <Chip
                      label={user?.role === 'superadmin' ? 'SUPERADMIN' : user?.role === 'admin' ? 'ADMIN' : "O'QITUVCHI"}
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    />
                    {isTeacher && stats?.level && (
                      <Chip
                        icon={<Award size={16} />}
                        label={stats.level}
                        color="warning"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Info */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Mail size={20} color="#6366f1" />
                      <Typography variant="body2">{profile?.email || 'Email yo\'q'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone size={20} color="#6366f1" />
                      <Typography variant="body2">{profile?.phone || 'Telefon yo\'q'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MapPin size={20} color="#6366f1" />
                      <Typography variant="body2">{stats?.school_name || 'Maktab yo\'q'}</Typography>
                    </Box>
                    {isTeacher && profile?.subject && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Briefcase size={20} color="#6366f1" />
                        <Typography variant="body2">{profile.subject_display || profile.subject}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Bio */}
                  {profile?.bio && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        {profile.bio}
                      </Typography>
                    </>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Stats Cards - Teacher only */}
                {isTeacher && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <TrendingUp size={32} style={{ marginBottom: 8 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                              <CountUp end={stats?.total_points || 0} duration={2} />
                            </Typography>
                            <Typography variant="caption">Ball</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                            color: 'white',
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <BookOpen size={32} style={{ marginBottom: 8 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                              <CountUp end={stats?.total_materials || 0} duration={2} />
                            </Typography>
                            <Typography variant="caption">Materiallar</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Video size={32} style={{ marginBottom: 8 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                              <CountUp end={stats?.total_videos || 0} duration={2} />
                            </Typography>
                            <Typography variant="caption">Videolar</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                            color: 'white',
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Star size={32} style={{ marginBottom: 8 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                              <CountUp end={stats?.rank || 0} duration={2} />
                            </Typography>
                            <Typography variant="caption">Reyting</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}

                {/* Edit Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Paper
                    sx={{
                      borderRadius: 4,
                      p: 3,
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Shaxsiy Ma'lumotlar
                      </Typography>
                      {!editing ? (
                        <Button
                          variant="contained"
                          startIcon={<Edit size={20} />}
                          onClick={() => setEditing(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          }}
                        >
                          Tahrirlash
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={handleCancel}
                            sx={{
                              bgcolor: 'grey.200',
                              '&:hover': { bgcolor: 'grey.300' },
                            }}
                          >
                            <X size={20} />
                          </IconButton>
                          <IconButton
                            onClick={handleSave}
                            disabled={loading}
                            sx={{
                              bgcolor: 'success.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'success.dark' },
                            }}
                          >
                            <Save size={20} />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Ism"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          disabled={!editing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Familiya"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          disabled={!editing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!editing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Telefon"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!editing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!editing}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>

                {/* Level Progress - Teacher only */}
                {isTeacher && stats?.level && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Paper
                      sx={{
                        borderRadius: 4,
                        p: 3,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Daraja Progress
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Hozirgi daraja: <strong>{stats.level}</strong>
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {stats.level_progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stats.level_progress || 0}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                            borderRadius: 5,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Keyingi darajagacha: <strong>{stats.points_to_next_level || 0} ball</strong>
                      </Typography>
                    </Paper>
                  </motion.div>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Profile;