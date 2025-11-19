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
} from '@mui/material';
import {
  SupervisorAccount,
  Search,
  Edit,
  Delete,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]); // har doim array
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/auth/users/');

      // Pagination bo'lsa results, aks holda to'g'ridan array
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
      console.error('O‘chirishda xatolik:', error);
      toast.error('Foydalanuvchini o‘chirishda xatolik yuz berdi');
    }
  };

  const getRoleChip = (role) => {
    const roleMap = {
      superadmin: { label: 'Superadmin', color: 'error' },
      admin: { label: 'Admin', color: 'warning' },
      teacher: { label: "O'qituvchi", color: 'primary' },
      student: { label: 'O‘quvchi', color: 'info' },
    };
    const config = roleMap[role] || { label: role || 'Belgilanmagan', color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Qidiruv – har doim array ustida ishlaydi
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
        <Typography
          variant="h4"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            fontWeight: 'bold',
          }}
        >
          <SupervisorAccount sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          Foydalanuvchilar
        </Typography>

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
                    {search ? 'Hech narsa topilmadi' : 'Foydalanuvchilar ro‘yxati bo‘sh'}
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
                    <IconButton size="small" color="primary">
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
    </Container>
  );
};

export default Users;