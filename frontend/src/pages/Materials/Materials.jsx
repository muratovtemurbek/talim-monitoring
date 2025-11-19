import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Search,
  Description,
  Visibility,
  Download,
  Edit,
  Delete,
  CheckCircle,
  HourglassEmpty,
  GetApp,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import Pagination from '../../components/Common/Pagination';
import AdvancedFilter from '../../components/Common/AdvancedFilter';

const Materials = () => {
  const { user } = useSelector((state) => state.auth);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState({});

  // Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    file: null,
  });

  const subjects = [
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
    { value: 'english', label: 'Ingliz tili' },
    { value: 'uzbek', label: 'O\'zbek tili' },
    { value: 'russian', label: 'Rus tili' },
    { value: 'history', label: 'Tarix' },
    { value: 'geography', label: 'Geografiya' },
  ];

  useEffect(() => {
    fetchMaterials();
  }, [tabValue, page, filters]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        ...filters,
      };

      if (search) params.search = search;

      let endpoint = '/materials/';
      if (tabValue === 1) {
        endpoint = '/materials/my_materials/';
      }

      const response = await axiosInstance.get(endpoint, { params });

      setMaterials(response.data.results || response.data);
      setTotalPages(Math.ceil((response.data.count || 0) / 10));
      setTotalItems(response.data.count || 0);
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Materiallarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchMaterials();
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilter = () => {
    setFilters({});
    setPage(1);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.subject || !formData.grade || !formData.file) {
      toast.error('Barcha maydonlarni to\'ldiring!');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('subject', formData.subject);
    data.append('grade', formData.grade);
    data.append('file', formData.file);

    try {
      await axiosInstance.post('/materials/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Material yuklandi!');
      setCreateOpen(false);
      fetchMaterials();
      setFormData({
        title: '',
        description: '',
        subject: '',
        grade: '',
        file: null,
      });
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Material yuklashda xatolik');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Rostdan ham o\'chirmoqchimisiz?')) return;

    try {
      await axiosInstance.delete(`/materials/${id}/`);
      toast.success('Material o\'chirildi');
      fetchMaterials();
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('O\'chirishda xatolik');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/materials/${id}/approve/`);
      toast.success('Material tasdiqlandi!');
      fetchMaterials();
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Tasdiqlashda xatolik');
    }
  };

  const handleDownload = async (id) => {
    try {
      await axiosInstance.post(`/materials/${id}/increment_download/`);
    } catch (error) {
      console.error('Xatolik:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get('/auth/export/materials/excel/', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `materiallar_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Excel yuklab olindi!');
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Yuklab olishda xatolik');
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1 }} />
          Materiallar
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleExportExcel}
            size="small"
          >
            Excel
          </Button>
          {user?.role === 'teacher' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
            >
              Yangi material
            </Button>
          )}
        </Box>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Material qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <Button onClick={handleSearch}>Qidirish</Button>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <AdvancedFilter
          onFilter={handleFilter}
          onClear={handleClearFilter}
          subjects={subjects}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Barcha materiallar" />
          {user?.role === 'teacher' && <Tab label="Mening materiallarim" />}
        </Tabs>
      </Box>

      {/* Materials Grid */}
      {loading ? (
        <Typography>Yuklanmoqda...</Typography>
      ) : materials.length === 0 ? (
        <Typography>Material topilmadi</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {materials.map((material) => (
              <Grid item xs={12} sm={6} md={4} key={material.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" noWrap>
                        {material.title}
                      </Typography>
                      {material.is_approved ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Tasdiqlangan"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<HourglassEmpty />}
                          label="Kutilmoqda"
                          color="warning"
                          size="small"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="textSecondary" noWrap>
                      {material.description}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Chip label={subjects.find(s => s.value === material.subject)?.label} size="small" sx={{ mr: 1 }} />
                      <Chip label={`${material.grade}-sinf`} size="small" />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">
                        👁 {material.views} • ⬇ {material.downloads}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(material.created_at).toLocaleDateString('uz-UZ')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Download />}
                      href={material.file}
                      target="_blank"
                      onClick={() => handleDownload(material.id)}
                    >
                      Yuklab olish
                    </Button>

                    {user?.role === 'teacher' && material.teacher === user.id && (
                      <IconButton size="small" onClick={() => handleDelete(material.id)}>
                        <Delete />
                      </IconButton>
                    )}

                    {user?.role === 'admin' && !material.is_approved && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleApprove(material.id)}
                      >
                        Tasdiqlash
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            totalItems={totalItems}
          />
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yangi material yuklash</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Sarlavha"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Tavsif"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Fan</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                label="Fan"
              >
                {subjects.map((sub) => (
                  <MenuItem key={sub.value} value={sub.value}>
                    {sub.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Sinf"
              name="grade"
              type="number"
              value={formData.grade}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 11 }}
            />

            <Button variant="outlined" component="label" fullWidth>
              Fayl tanlash
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {formData.file && (
              <Typography variant="caption">{formData.file.name}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleCreate} variant="contained">
            Yuklash
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Materials;