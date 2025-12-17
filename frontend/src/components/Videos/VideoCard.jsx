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
  Eye,
  ThumbsUp,
  CheckCircle,
  Clock,
  Trash2,
  Play,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';

const VideoCard = ({ video, onView, onLike, onDelete, onApprove, userRole }) => {
  const isApproved = video.is_approved;

  const getSubjectColor = (subject) => {
    const colors = {
      math: '#6366f1',
      physics: '#ec4899',
      chemistry: '#10b981',
      biology: '#f59e0b',
      informatics: '#3b82f6',
      english: '#8b5cf6',
      uzbek: '#ef4444',
      russian: '#06b6d4',
      history: '#f97316',
      geography: '#14b8a6',
      default: '#64748b',
    };
    return colors[subject] || colors.default;
  };

  const subjectColor = getSubjectColor(video.subject);

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
            boxShadow: `0 20px 48px ${subjectColor}30`,
            border: `1px solid ${subjectColor}40`,
            transform: 'translateY(-8px)',
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
            icon={isApproved ? <CheckCircle size={16} /> : <Clock size={16} />}
            label={isApproved ? 'Tasdiqlangan' : 'Kutilmoqda'}
            size="small"
            sx={{
              bgcolor: isApproved ? 'success.main' : 'warning.main',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
        </Box>

        {/* Thumbnail */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            bgcolor: `${subjectColor}20`,
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover .play-button': {
              transform: 'scale(1.2)',
            },
          }}
          onClick={() => onView(video)}
        >
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${subjectColor}40 0%, ${subjectColor}20 100%)`,
              }}
            >
              <Play size={64} color={subjectColor} />
            </Box>
          )}

          {/* Play Button Overlay */}
          <Box
            className="play-button"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            <Play size={32} color={subjectColor} fill={subjectColor} />
          </Box>

          {/* Duration Badge */}
          {video.duration && (
            <Chip
              label={video.duration}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          {/* Subject & Grade */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={video.subject_display || video.subject}
              size="small"
              sx={{
                bgcolor: `${subjectColor}20`,
                color: subjectColor,
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${video.grade}-sinf`}
              size="small"
              sx={{
                bgcolor: 'grey.200',
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              background: `linear-gradient(135deg, ${subjectColor} 0%, #ec4899 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.3,
              minHeight: 48,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {video.title}
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
            {video.description || 'Tavsif yo\'q'}
          </Typography>

          {/* Teacher Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${subjectColor}08`,
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                bgcolor: subjectColor,
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {video.teacher_name?.charAt(0) || 'T'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                {video.teacher_name || 'O\'qituvchi'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {video.school_name || 'Maktab'}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Ko'rishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Eye size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {video.views || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Yoqtirishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ThumbsUp size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {video.likes || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {video.created_at && format(new Date(video.created_at), 'dd.MM.yyyy')}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Ko'rish">
              <IconButton
                onClick={() => onView(video)}
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
                <Play size={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Yoqtirish">
              <IconButton
                onClick={() => onLike(video)}
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
                <ThumbsUp size={20} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Admin Actions */}
          {(userRole === 'admin' || userRole === 'superadmin') && !isApproved && onApprove && (
            <Tooltip title="Tasdiqlash">
              <IconButton
                onClick={() => onApprove(video)}
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
          )}

          {/* Teacher Delete */}
          {userRole === 'teacher' && !isApproved && onDelete && (
            <Tooltip title="O'chirish">
              <IconButton
                onClick={() => onDelete(video)}
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
                <Trash2 size={20} />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default VideoCard;