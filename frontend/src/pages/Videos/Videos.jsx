import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  PlayCircle,
  Visibility,
  ThumbUp,
  CheckCircle,
  HourglassEmpty,
  Close,
  CloudUpload,
  Image as ImageIcon,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Videos = () => {
  const { user } = useSelector((state) => state.auth);
  const [videos, setVideos] = useState([]); // har doim array
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    video_url: '',
    thumbnail: null,
    duration: '',
  });

  useEffect(() => {
    fetchVideos();
  }, [subject, tabValue]);

  // Asosiy o'zgartirish: response.data.results yoki to'g'ridan array olish
  const fetchVideos = async () => {
    try {
      const params = {};
      if (subject) params.subject = subject;
      if (search) params.search = search;

      const endpoint = tabValue === 1 ? '/videos/my_videos/' : '/videos/';

      const response = await axiosInstance.get(endpoint, { params });

      // DRF paginator bo'lsa results, aks holda to'g'ridan array
      const videoList = response.data.results || response.data || [];

      // Har holda array ekanligiga 100% ishonch hosil qilamiz
      setVideos(Array.isArray(videoList) ? videoList : []);

    } catch (error) {
      console.error('Videolarni yuklashda xatolik:', error);
      toast.error('Videolarni yuklashda xatolik yuz berdi');
      setVideos([]); // xatolik bo'lsa ham array qaytaramiz
    }
  };

  const handleSearch = () => {
    fetchVideos();
  };

  const handleInputChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan katta bo'lmasligi kerak!");
        return;
      }
      setUploadData({ ...uploadData, thumbnail: file });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.description || !uploadData.subject || !uploadData.video_url) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('subject', uploadData.subject);
      formData.append('video_url', uploadData.video_url);
      if (uploadData.grade) formData.append('grade', uploadData.grade);
      if (uploadData.duration) formData.append('duration', uploadData.duration);
      if (uploadData.thumbnail) formData.append('thumbnail', uploadData.thumbnail);

      await axiosInstance.post('/videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Video muvaffaqiyatli yuklandi! Tasdiqlash kutilmoqda...');
      setUploadOpen(false);
      setUploadData({
        title: '', description: '', subject: '', grade: '', video_url: '',
        thumbnail: null, duration: '',
      });
      fetchVideos();
    } catch (error) {
      console.error('Video yuklashda xatolik:', error);
      toast.error(error.response?.data?.detail || 'Video yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (videoId) => {
    try {
      await axiosInstance.post(`/videos/${videoId}/approve/`);
      toast.success('Video tasdiqlandi!');
      fetchVideos();
    } catch (error) {
      toast.error('Tasdiqlashda xatolik');
    }
  };

  const handleVideoClick = async (video) => {
    try {
      await axiosInstance.post(`/videos/${video.id}/increment_view/`);
      window.open(video.video_url, '_blank');
      fetchVideos(); // views yangilanishi uchun
    } catch (error) {
      window.open(video.video_url, '_blank'); // hatto xato bo'lsa ham ochamiz
    }
  };

  const handleLike = async (videoId, event) => {
    event.stopPropagation();
    try {
      await axiosInstance.post(`/videos/${videoId}/like/`);
      fetchVideos();
      toast.success('Yoqdi!');
    } catch (error) {
      toast.error('Like qo‘shishda xatolik');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canApprove = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <PlayCircle sx={{ mr: 1 }} />
          Video Darslar
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setUploadOpen(true)}>
          Video yuklash
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Barcha videolar" />
        <Tab label="Mening videolarim" />
      </Tabs>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Video qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Fan</InputLabel>
              <Select value={subject} label="Fan" onChange={(e) => setSubject(e.target.value)}>
                <MenuItem value="">Barchasi</MenuItem>
                <MenuItem value="math">Matematika</MenuItem>
                <MenuItem value="physics">Fizika</MenuItem>
                <MenuItem value="chemistry">Kimyo</MenuItem>
                <MenuItem value="biology">Biologiya</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="contained" onClick={handleSearch} sx={{ height: 56 }}>
              Qidirish
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Videolar ro'yxati */}
      <Grid container spacing={3}>
        {Array.isArray(videos) && videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 8 },
              }}
              onClick={() => handleVideoClick(video)}
            >
              <Box sx={{ position: 'relative' }}>
                {video.thumbnail ? (
                  <CardMedia component="img" height="180" image={video.thumbnail} alt={video.title} />
                ) : (
                  <Box sx={{ height: 180, bgcolor: 'grey.800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                )}

                {video.duration > 0 && (
                  <Chip
                    label={formatDuration(video.duration)}
                    size="small"
                    sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  />
                )}

                {video.is_approved ? (
                  <Chip icon={<CheckCircle />} label="Tasdiqlangan" color="success" size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }} />
                ) : (
                  <Chip icon={<HourglassEmpty />} label="Kutilyapti" color="warning" size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }} />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {video.description?.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={video.subject_display || video.subject} size="small" color="primary" />
                  {video.grade && <Chip label={`${video.grade}-sinf`} size="small" />}
                </Box>

                <Typography variant="caption" display="block" color="text.secondary">
                  O'qituvchi: {video.teacher_name || video.teacher?.full_name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility fontSize="small" />
                    <Typography variant="caption">{video.views || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton size="small" onClick={(e) => handleLike(video.id, e)}>
                      <ThumbUp fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{video.likes || 0}</Typography>
                  </Box>
                </Box>
              </CardContent>

              {canApprove && !video.is_approved && (
                <CardActions>
                  <Button
                    size="small"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(video.id);
                    }}
                  >
                    Tasdiqlash
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Agar video bo'lmasa */}
      {(!Array.isArray(videos) || videos.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Hozircha video topilmadi
          </Typography>
        </Box>
      )}

      {/* Upload Dialog – o'zgarmadi, faqat kichik yaxshilanishlar */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Yangi video yuklash</Typography>
            <IconButton onClick={() => setUploadOpen(false)}><Close /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Sarlavha" name="title" value={uploadData.title} onChange={handleInputChange} fullWidth required />
            <TextField label="Tavsif" name="description" value={uploadData.description} onChange={handleInputChange} multiline rows={3} fullWidth required />

            <FormControl fullWidth required>
              <InputLabel>Fan</InputLabel>
              <Select name="subject" value={uploadData.subject} onChange={handleInputChange} label="Fan">
                <MenuItem value="math">Matematika</MenuItem>
                <MenuItem value="physics">Fizika</MenuItem>
                <MenuItem value="chemistry">Kimyo</MenuItem>
                <MenuItem value="biology">Biologiya</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Video URL (YouTube, Vimeo va h.k.)" name="video_url" value={uploadData.video_url} onChange={handleInputChange} fullWidth required />
            <TextField label="Sinf (masalan: 7)" name="grade" type="number" value={uploadData.grade} onChange={handleInputChange} fullWidth />
            <TextField label="Davomiyligi (sekundda)" name="duration" type="number" value={uploadData.duration} onChange={handleInputChange} fullWidth />

            <Button variant="outlined" component="label" startIcon={<ImageIcon />} fullWidth>
              {uploadData.thumbnail ? uploadData.thumbnail.name : 'Thumbnail rasm tanlash (ixtiyoriy)'}
              <input type="file" hidden accept="image/*" onChange={handleThumbnailChange} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleUpload} variant="contained" disabled={uploading} startIcon={<CloudUpload />}>
            {uploading ? 'Yuklanmoqda...' : 'Yuklash'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Videos;