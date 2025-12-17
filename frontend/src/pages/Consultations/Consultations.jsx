import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
  Fab,
  Pagination,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle } from 'lucide-react';
import ConsultationCard from '../../components/Consultations/ConsultationCard';
import ConsultationCreateModal from '../../components/Consultations/ConsultationCreateModal';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 9;

  const user = useSelector((state) => state.auth.user);
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchQuery, tabValue]);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/consultations/');
      const data = response.data.results || response.data;
      setConsultations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Maslahatlar xatolik:', error);
      toast.error('Maslahatlarni yuklashda xatolik');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = [...consultations];

    // Tab filter
    if (tabValue === 1) {
      filtered = filtered.filter((c) => c.status === 'pending');
    } else if (tabValue === 2) {
      filtered = filtered.filter((c) => c.status === 'accepted');
    } else if (tabValue === 3) {
      filtered = filtered.filter((c) => c.status === 'completed');
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredConsultations(filtered);
    setPage(1);
  };

  const handleAccept = async (consultation) => {
    if (window.confirm("Maslahatni qabul qilasizmi?")) {
      try {
        await axiosInstance.post(`/consultations/${consultation.id}/accept/`);
        toast.success('Maslahat qabul qilindi!');
        fetchConsultations();
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    }
  };

  const handleReject = async (consultation) => {
    if (window.confirm("Maslahatni rad etasizmi?")) {
      try {
        await axiosInstance.post(`/consultations/${consultation.id}/reject/`);
        toast.success('Maslahat rad etildi');
        fetchConsultations();
      } catch (error) {
        toast.error('Xatolik yuz berdi');
      }
    }
  };

  const handleJoin = (consultation) => {
    if (consultation.meeting_url) {
      window.open(consultation.meeting_url, '_blank');
    } else {
      toast.info('Uchrashuv havolasi hali mavjud emas');
    }
  };

  const handleCreateConsultation = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    fetchConsultations();
  };

  // Pagination
  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);
  const paginatedConsultations = filteredConsultations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getTabLabel = (index) => {
    const labels = ['Barchasi', 'Kutilmoqda', 'Qabul qilingan', 'Tugallangan'];
    const counts = [
      consultations.length,
      consultations.filter((c) => c.status === 'pending').length,
      consultations.filter((c) => c.status === 'accepted').length,
      consultations.filter((c) => c.status === 'completed').length,
    ];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {labels[index]}
        <Chip
          label={counts[index]}
          size="small"
          sx={{
            bgcolor: tabValue === index ? 'info.main' : 'grey.300',
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
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Maslahatlar"
          subtitle="Individual maslahatlar va konsultatsiyalar"
          icon={MessageCircle}
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
            <Tab label={getTabLabel(1)} />
            <Tab label={getTabLabel(2)} />
            <Tab label={getTabLabel(3)} />
          </Tabs>

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzu yoki ishtirokchi ismi..."
          />
        </Box>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Maslahatlar yuklanmoqda..." />
        ) : filteredConsultations.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Maslahatlar topilmadi"
            message={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi."
                : tabValue === 1
                ? "Kutilayotgan maslahatlar yo'q."
                : tabValue === 2
                ? "Qabul qilingan maslahatlar yo'q."
                : tabValue === 3
                ? "Tugallangan maslahatlar yo'q."
                : "Hozircha maslahatlar yo'q. Yangi maslahat so'rang!"
            }
            action="Maslahat so'rash"
            onAction={handleCreateConsultation}
          />
        ) : (
          <>
            {/* Consultations Grid */}
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedConsultations.map((consultation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={consultation.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ConsultationCard
                        consultation={consultation}
                        onAccept={isTeacher ? handleAccept : null}
                        onReject={isTeacher ? handleReject : null}
                        onJoin={handleJoin}
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

        {/* FAB - Barcha o'qituvchilar uchun */}
        <Fab
          color="primary"
          onClick={handleCreateConsultation}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            width: 64,
            height: 64,
            boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 48px rgba(59,130,246,0.6)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Plus size={28} />
        </Fab>

        {/* Maslahat yaratish modali */}
        <ConsultationCreateModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Container>
    </Box>
  );
};

export default Consultations;