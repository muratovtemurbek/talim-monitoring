import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  MessageCircle,
  Library,
  Award,
  Bot,
  BarChart3,
  Users,
  School,
  Settings,
  User,
  FileText,
  ClipboardList,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const drawerWidth = 280;

const Sidebar = ({ open, onClose, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/' },
      { text: 'Materiallar', icon: <BookOpen size={22} />, path: '/materials' },
      { text: 'Video Darslar', icon: <Video size={22} />, path: '/videos' },
      { text: 'Mock Testlar', icon: <FileText size={22} />, path: '/mock-tests' },
      { text: 'Dars Tahlili', icon: <ClipboardList size={22} />, path: '/lesson-analysis' },
      { text: 'AI Yordamchi', icon: <Bot size={22} />, path: '/ai-assistant' },
      { text: 'Maslahatlar', icon: <MessageCircle size={22} />, path: '/consultations' },
      { text: 'Kutubxona', icon: <Library size={22} />, path: '/library' },
      { text: 'Reyting', icon: <Award size={22} />, path: '/ratings' },
    ];

    const adminItems = [
      { text: 'Statistika', icon: <BarChart3 size={22} />, path: '/statistics' },
      { text: 'Foydalanuvchilar', icon: <Users size={22} />, path: '/users' },
      { text: 'Maktablar', icon: <School size={22} />, path: '/schools' },
      { text: 'Test Boshqaruvi', icon: <FileText size={22} />, path: '/mock-tests/manage' },
    ];

    if (user?.role === 'superadmin' || user?.role === 'admin') {
      return [...commonItems, ...adminItems];
    }

    return commonItems;
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
          pt: '64px',
        },
      }}
    >
      {/* User Profile */}
      <Box
        sx={{
          p: 2,
          m: 2,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-2px)',
          },
        }}
        onClick={() => handleNavigate('/profile')}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'primary.main',
              fontWeight: 700,
            }}
          >
            {user?.first_name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.first_name} {user?.last_name}
            </Typography>
            <Chip
              label={
                user?.role === 'superadmin'
                  ? 'Superadmin'
                  : user?.role === 'admin'
                  ? 'Admin'
                  : "O'qituvchi"
              }
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: 'rgba(99,102,241,0.3)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
        <AnimatePresence>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                  background: isActive(item.path)
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'transparent',
                  boxShadow: isActive(item.path) ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: isActive(item.path)
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(255,255,255,0.05)',
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Bottom Items */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItemButton
          onClick={() => handleNavigate('/profile')}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            color: isActive('/profile') ? 'white' : 'rgba(255,255,255,0.7)',
            '&:hover': {
              background: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <User size={22} />
          </ListItemIcon>
          <ListItemText primary="Profil" />
        </ListItemButton>

        <ListItemButton
          onClick={() => handleNavigate('/settings')}
          sx={{
            borderRadius: 2,
            color: isActive('/settings') ? 'white' : 'rgba(255,255,255,0.7)',
            '&:hover': {
              background: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Settings size={22} />
          </ListItemIcon>
          <ListItemText primary="Sozlamalar" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;