import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import {
  SupervisorAccount,
  Search,
  Edit,
  Delete,
  Close,
  Add,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'teacher',
    is_active: true,
    password: '',
    password2: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/auth/users/');
      const data = response.data.results || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Foydalanuvchilar yuklanmadi:', error);
      toast.error('Foydalanuvchilarni yuklashda xatolik yuz berdi');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Foydalanuvchini o'chirishni xohlaysizmi?")) return;

    try {
      await axiosInstance.delete(`/auth/users/${id}/`);
      toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
      fetchUsers();
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      role: user.role || 'teacher',
      is_active: user.is_active !== false,
      password: '',
      password2: '',
    });
    setEditOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'teacher',
      is_active: true,
      password: '',
      password2: '',
    });
    setCreateOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
        is_active: formData.is_active,
      };

      await axiosInstance.patch(`/auth/users/${selectedUser.id}/`, updateData);
      toast.success("Foydalanuvchi muvaffaqiyatli yangilandi");
      setEditOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Yangilashda xatolik:', error);
      toast.error(error.response?.data?.detail || "Foydalanuvchini yangilashda xatolik yuz berdi");
    }
  };

  const handleSaveCreate = async () => {
    if (formData.password !== formData.password2) {
      toast.error("Parollar mos kelmadi");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Parol kamida 8 belgidan iborat bo'lishi kerak");
      return;
    }

    try {
      await axiosInstance.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        password2: formData.password2,
      });
      toast.success("Foydalanuvchi muvaffaqiyatli yaratildi");
      setCreateOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Yaratishda xatolik:', error);
      const errorMsg = error.response?.data;
      if (errorMsg) {
        const firstError = Object.values(errorMsg)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error("Foydalanuvchi yaratishda xatolik yuz berdi");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getRoleChip = (role) => {
    const roleMap = {
      superadmin: { label: 'Superadmin', color: 'error' },
      admin: { label: 'Admin', color: 'warning' },
      teacher: { label: "O'qituvchi", color: 'primary' },
    };
    const config = roleMap[role] || { label: role || 'Belgilanmagan', color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(search)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Sarlavha */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
            }}
          >
            <SupervisorAccount sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
            Foydalanuvchilar
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Yangi foydalanuvchi
          </Button>
        </Box>

        {/* Qidiruv */}
        <TextField
          fullWidth
          placeholder="Username, ism, familiya, email yoki telefon bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Box>

      {/* Jadval */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Foydalanuvchi</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Telefon</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Harakatlar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Yuklanmoqda...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    {search ? 'Hech narsa topilmadi' : "Foydalanuvchilar ro'yxati bo'sh"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {(user.first_name || user.username || '?').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>

                  <TableCell>{getRoleChip(user.role)}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Faol' : 'Nofaol'}
                      color={user.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tahrirlash dialogi */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Foydalanuvchini tahrirlash
          <IconButton
            onClick={() => setEditOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ism"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Familiya"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  <MenuItem value="teacher">O'qituvchi</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    name="is_active"
                  />
                }
                label="Faol"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Bekor qilish</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Yangi foydalanuvchi dialogi */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Yangi foydalanuvchi
          <IconButton
            onClick={() => setCreateOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ism"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Familiya"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  <MenuItem value="teacher">O'qituvchi</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Parol"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                helperText="Kamida 8 belgi"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Parolni tasdiqlang"
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Bekor qilish</Button>
          <Button variant="contained" onClick={handleSaveCreate}>Yaratish</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
