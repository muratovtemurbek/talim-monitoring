import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  VideoLibrary as VideoIcon,
  Description as DocumentIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle,
  SupervisorAccount,
  MenuBook,
  BarChart,
  SmartToy,
  Brightness4,
  Brightness7,
  Assessment, // YANGI - Dars tahlili uchun
} from '@mui/icons-material';
import { logout, getProfile } from '../../redux/slices/authSlice';
import { ThemeContext } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';

const drawerWidth = 260;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: 'Materiallar', icon: <DocumentIcon />, path: '/materials' },
      { text: 'Video darslar', icon: <VideoIcon />, path: '/videos' },
      { text: 'Dars tahlili', icon: <Assessment />, path: '/lesson-analysis' }, // YANGI
      { text: 'Reyting', icon: <TrophyIcon />, path: '/ratings' },
      { text: 'Kutubxona', icon: <MenuBook />, path: '/library' },
      { text: 'Maslahatlar', icon: <HelpIcon />, path: '/consultations' },
      { text: 'AI Yordamchisi', icon: <SmartToy />, path: '/ai-assistant' },
    ];

    if (user?.role === 'admin' || user?.role === 'superadmin') {
      baseItems.splice(1, 0, {
        text: 'Maktablar',
        icon: <SchoolIcon />,
        path: '/schools'
      });
      baseItems.push({
        text: 'Statistika',
        icon: <BarChart />,
        path: '/statistics'
      });
    }

    if (user?.role === 'superadmin' || user?.is_superuser) {
      baseItems.push({
        text: 'Foydalanuvchilar',
        icon: <SupervisorAccount />,
        path: '/users'
      });
    }

    return baseItems;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Tizimdan chiqdingiz');
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          Ta'lim Monitoring
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.first_name} {user?.last_name}
            {user?.role && (
              <Typography
                component="span"
                sx={{
                  ml: 2,
                  px: 1,
                  py: 0.5,
                  bgcolor: user.role === 'superadmin' ? 'error.main' : 'warning.main',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                {user.role === 'superadmin' ? 'SUPERADMIN' :
                 user.role === 'admin' ? 'ADMIN' : 'O\'QITUVCHI'}
              </Typography>
            )}
          </Typography>

          {/* Dark Mode Toggle */}
          <Tooltip title={mode === 'light' ? 'Qorong\'i rejim' : 'Yorug\' rejim'}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.first_name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/profile');
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profil
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/settings');
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Sozlamalar
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Chiqish
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;