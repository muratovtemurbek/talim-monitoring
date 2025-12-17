import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Tabs,
  Tab,
  Button,
  Fab,
  Pagination,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video as VideoIcon, X } from 'lucide-react';
import VideoCard from '../../components/Videos/VideoCard';
import VideoUploadModal from '../../components/Videos/VideoUploadModal';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const user = useSelector((state) => state.auth.user);
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    fetchVideos();
  }, [tabValue]);

  useEffect(() => {
    filterVideos();
  }, [videos, searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let url = '/videos/';
      if (tabValue === 1) url = '/videos/my_videos/';
      if (tabValue === 2) url = '/videos/pending/';

      const response = await axiosInstance.get(url);
      const data = response.data.results || response.data;
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Videolarni yuklashda xatolik:', error);
      toast.error('Videolarni yuklashda xatolik');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const filtered = videos.filter((v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered);
    setPage(1);
  };

  const handleUpload = async (formData, uploadType) => {
    try {
      if (uploadType === 'url') {
        // URL orqali
        const data = {
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          grade: formData.grade,
          url: formData.url,
        };
        await axiosInstance.post('/videos/', data);
      } else {
        // Fayl yuklash
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('subject', formData.subject);
        data.append('grade', formData.grade);

        let file = formData.file;
        if (file.name.length > 90) {
          const ext = file.name.split('.').pop();
          const baseName = file.name.substring(0, 85);
          const shortName = baseName + '.' + ext;
          file = new File([file], shortName, { type: file.type });
        }
        data.append('file', file);

        await axiosInstance.post('/videos/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchVideos();
      toast.success('Video muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleView = async (video) => {
    try {
      await axiosInstance.post(`/videos/${video.id}/increment_view/`);
      setCurrentVideo(video);
      setVideoPlayerOpen(true);

      // Refresh to update view count
      fetchVideos();
    } catch (error) {
      console.error('View increment error:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleLike = async (video) => {
    try {
      await axiosInstance.post(`/videos/${video.id}/like/`);
      toast.success('❤️ Yoqtirdingiz!');
      fetchVideos();
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (video) => {
    if (window.confirm(`"${video.title}" videoni o'chirishga ishonchingiz komilmi?`)) {
      try {
        await axiosInstance.delete(`/videos/${video.id}/`);
        toast.success("Video o'chirildi!");
        fetchVideos();
      } catch (error) {
        toast.error("O'chirishda xatolik");
      }
    }
  };

  const handleApprove = async (video) => {
    if (window.confirm(`"${video.title}" videoni tasdiqlaysizmi?`)) {
      try {
        await axiosInstance.post(`/videos/${video.id}/approve/`);
        toast.success('Video tasdiqlandi! +15 ball');
        fetchVideos();
      } catch (error) {
        toast.error('Tasdiqlashda xatolik');
      }
    }
  };

  const getVideoEmbedUrl = (video) => {
    if (video.file) {
      return video.file;
    }

    if (video.url) {
      // YouTube
      if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
        const videoId = video.url.includes('youtu.be')
          ? video.url.split('youtu.be/')[1]?.split('?')[0]
          : video.url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Vimeo
      if (video.url.includes('vimeo.com')) {
        const videoId = video.url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }

      return video.url;
    }

    return null;
  };

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getTabLabel = (index) => {
    const labels = ['Barcha videolar', 'Mening videolarim', 'Tasdiqlanmagan'];
    const counts = [videos.length, videos.length, videos.length];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {labels[index]}
        <Chip
          label={counts[index]}
          size="small"
          sx={{
            bgcolor: tabValue === index ? 'error.main' : 'grey.300',
            color: tabValue === index ? 'white' : 'text.secondary',
            fontWeight: 700,
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Video Darslar"
          subtitle="Video darslar va ta'lim materiallari"
          icon={VideoIcon}
        />

        {/* Tabs & Search */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            p: 2,
            mb: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, v) => {
              setTabValue(v);
              setPage(1);
            }}
            sx={{ mb: 2 }}
          >
            <Tab label={getTabLabel(0)} />
            {isTeacher && <Tab label={getTabLabel(1)} />}
            {isAdmin && <Tab label={getTabLabel(2)} />}
          </Tabs>

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Video, o'qituvchi yoki maktab nomi..."
          />
        </Box>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Videolar yuklanmoqda..." />
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title="Videolar topilmadi"
            message={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi."
                : tabValue === 1
                ? "Siz hali hech qanday video yuklamagansiz."
                : "Bu bo'limda hozircha videolar yo'q."
            }
            action={isTeacher && tabValue === 1 ? 'Video yuklash' : null}
            onAction={isTeacher && tabValue === 1 ? () => setUploadModalOpen(true) : null}
          />
        ) : (
          <>
            {/* Videos Grid */}
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedVideos.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} key={video.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <VideoCard
                        video={video}
                        onView={handleView}
                        onLike={handleLike}
                        onDelete={isTeacher ? handleDelete : null}
                        onApprove={isAdmin ? handleApprove : null}
                        userRole={user?.role}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                    },
                    '& .Mui-selected': {
                      bgcolor: 'white !important',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* FAB */}
        {isTeacher && (
          <Fab
            color="primary"
            onClick={() => setUploadModalOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
              width: 64,
              height: 64,
              boxShadow: '0 8px 32px rgba(239,68,68,0.4)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 12px 48px rgba(239,68,68,0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Plus size={28} />
          </Fab>
        )}

        {/* Upload Modal */}
        <VideoUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
        />

        {/* Video Player Modal */}
        <Dialog
          open={videoPlayerOpen}
          onClose={() => setVideoPlayerOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              bgcolor: 'black',
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setVideoPlayerOpen(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <X />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
            {currentVideo && (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={getVideoEmbedUrl(currentVideo)}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Videos;