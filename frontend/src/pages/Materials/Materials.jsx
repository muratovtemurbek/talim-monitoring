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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download as DownloadIcon, BookOpen, Filter } from 'lucide-react';
import MaterialCard from '../../components/Materials/MaterialCard';
import UploadModal from '../../components/Materials/UploadModal';
import PageHeader from '../../components/Common/PageHeader';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const user = useSelector((state) => state.auth.user);
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    fetchMaterials();
  }, [tabValue]);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchQuery]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = '/materials/';
      if (tabValue === 1) url = '/materials/my_materials/';
      if (tabValue === 2) url = '/materials/pending/';

      const response = await axiosInstance.get(url);
      const data = response.data.results || response.data;
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Materiallarni yuklashda xatolik:', error);
      toast.error('Materiallarni yuklashda xatolik');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    if (!searchQuery.trim()) {
      setFilteredMaterials(materials);
      return;
    }

    const filtered = materials.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMaterials(filtered);
    setPage(1);
  };

  const handleUpload = async (formData) => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subject', formData.subject);
    data.append('grade', formData.grade);
    
    // Fayl nomini qisqartirish (90+ belgi bo'lsa)
    let file = formData.file;
    if (file.name.length > 90) {
      const ext = file.name.split('.').pop();
      const baseName = file.name.substring(0, 85);
      const shortName = baseName + '.' + ext;
      file = new File([file], shortName, { type: file.type });
    }
    data.append('file', file);

    await axiosInstance.post('/materials/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    fetchMaterials();
  };

  const handleDownload = async (material) => {
    try {
      window.open(material.file, '_blank');
      await axiosInstance.post(`/materials/${material.id}/increment_download/`);
      toast.success('Yuklab olinmoqda...');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (material) => {
    if (window.confirm(`"${material.title}" materialini o'chirishga ishonchingiz komilmi?`)) {
      try {
        await axiosInstance.delete(`/materials/${material.id}/`);
        toast.success("Material o'chirildi!");
        fetchMaterials();
      } catch (error) {
        toast.error("O'chirishda xatolik");
      }
    }
  };

  const handleApprove = async (material) => {
    if (window.confirm(`"${material.title}" materialini tasdiqlaysizmi?`)) {
      try {
        await axiosInstance.post(`/materials/${material.id}/approve/`);
        toast.success('Material tasdiqlandi! +10 ball');
        fetchMaterials();
      } catch (error) {
        toast.error('Tasdiqlashda xatolik');
      }
    }
  };

  const handleView = async (material) => {
    try {
      await axiosInstance.post(`/materials/${material.id}/increment_view/`);
      window.open(material.file, '_blank');
    } catch (error) {
      console.error('View increment error:', error);
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Excel eksport qilinmoqda...');
      window.open(`${axiosInstance.defaults.baseURL}/export/materials/excel/`, '_blank');
    } catch (error) {
      toast.error('Eksport xatolik');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getTabLabel = (index) => {
    const labels = ['Barcha materiallar', "Mening materiallarim", 'Tasdiqlanmagan'];
    const counts = [materials.length, materials.length, materials.length];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {labels[index]}
        <Chip
          label={counts[index]}
          size="small"
          sx={{
            bgcolor: tabValue === index ? 'primary.main' : 'grey.300',
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="Materiallar"
          subtitle="O'quv materiallari va resurslar"
          icon={BookOpen}
          action={isAdmin ? 'Excel Export' : null}
          onAction={isAdmin ? handleExport : null}
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
            placeholder="Material, o'qituvchi yoki maktab nomi..."
          />
        </Box>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Materiallar yuklanmoqda..." />
        ) : filteredMaterials.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Materiallar topilmadi"
            message={
              searchQuery
                ? "Qidiruv bo'yicha hech narsa topilmadi. Boshqa so'z bilan izlab ko'ring."
                : tabValue === 1
                ? "Siz hali hech qanday material yuklamagansiz."
                : "Bu bo'limda hozircha materiallar yo'q."
            }
            action={isTeacher && tabValue === 1 ? 'Material yuklash' : null}
            onAction={isTeacher && tabValue === 1 ? () => setUploadModalOpen(true) : null}
          />
        ) : (
          <>
            {/* Materials Grid */}
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedMaterials.map((material, index) => (
                  <Grid item xs={12} sm={6} md={4} key={material.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <MaterialCard
                        material={material}
                        onDownload={handleDownload}
                        onDelete={isTeacher ? handleDelete : null}
                        onApprove={isAdmin ? handleApprove : null}
                        onView={handleView}
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
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              width: 64,
              height: 64,
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 12px 48px rgba(99,102,241,0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Plus size={28} />
          </Fab>
        )}

        {/* Upload Modal */}
        <UploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </Container>
    </Box>
  );
};

export default Materials;