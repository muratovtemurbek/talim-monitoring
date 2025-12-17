import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  MessageCircle,
  Video,
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

const ConsultationCard = ({ consultation, onAccept, onReject, onJoin, userRole }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      accepted: '#10b981',
      rejected: '#ef4444',
      completed: '#6366f1',
      default: '#64748b',
    };
    return colors[status] || colors.default;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Kutilmoqda',
      accepted: 'Qabul qilindi',
      rejected: 'Rad etildi',
      completed: 'Tugallandi',
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type) => {
    return type === 'online' ? <Video size={20} /> : <MapPin size={20} />;
  };

  const statusColor = getStatusColor(consultation.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: `0 20px 48px ${statusColor}30`,
            border: `1px solid ${statusColor}40`,
          },
        }}
      >
        {/* Status Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            zIndex: 1,
          }}
        >
          <Chip
            label={getStatusLabel(consultation.status)}
            size="small"
            sx={{
              bgcolor: statusColor,
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          {/* Teacher/Student Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: statusColor,
                width: 56,
                height: 56,
                mr: 2,
                boxShadow: `0 4px 12px ${statusColor}40`,
              }}
            >
              <User size={28} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {userRole === 'teacher'
                  ? consultation.student_name
                  : consultation.teacher_name}
              </Typography>
              <Chip
                icon={getTypeIcon(consultation.type)}
                label={consultation.type === 'online' ? 'Online' : 'Offline'}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: `${statusColor}20`,
                  color: statusColor,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>

          {/* Topic */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              background: `linear-gradient(135deg, ${statusColor} 0%, #ec4899 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.3,
            }}
          >
            {consultation.topic}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40,
            }}
          >
            {consultation.description || 'Tavsif yo\'q'}
          </Typography>

          {/* Date & Time */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${statusColor}08`,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} color={statusColor} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {consultation.date && format(new Date(consultation.date), 'dd MMMM yyyy', { locale: uz })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} color={statusColor} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {consultation.time} ({consultation.duration || 60} daqiqa)
              </Typography>
            </Box>
            {consultation.location && consultation.type === 'offline' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={16} color={statusColor} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {consultation.location}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Notes */}
          {consultation.notes && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                <strong>Izoh:</strong> {consultation.notes}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          {consultation.status === 'pending' && userRole === 'teacher' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Qabul qilish">
                <IconButton
                  onClick={() => onAccept(consultation)}
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: 'success.dark',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CheckCircle size={20} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Rad etish">
                <IconButton
                  onClick={() => onReject(consultation)}
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: 'error.dark',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <XCircle size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {consultation.status === 'accepted' && consultation.type === 'online' && onJoin && (
            <Tooltip title="Qo'shilish">
              <IconButton
                onClick={() => onJoin(consultation)}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Video size={20} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Xabar yuborish">
            <IconButton
              sx={{
                bgcolor: 'info.main',
                color: 'white',
                width: 40,
                height: 40,
                ml: 'auto',
                '&:hover': {
                  bgcolor: 'info.dark',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MessageCircle size={20} />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ConsultationCard;