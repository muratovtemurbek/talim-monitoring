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
  Menu,
  MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  Trash2,
  FileText,
  MoreVertical,
  ThumbsUp,
} from 'lucide-react';
import { format } from 'date-fns';

const MaterialCard = ({ material, onDownload, onDelete, onApprove, onView, userRole }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isApproved = material.is_approved;

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

  const subjectColor = getSubjectColor(material.subject);

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

        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          {/* Icon & Subject */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: subjectColor,
                width: 56,
                height: 56,
                mr: 2,
                boxShadow: `0 4px 12px ${subjectColor}40`,
              }}
            >
              <FileText size={28} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {material.subject_display || material.subject}
              </Typography>
              <Chip
                label={`${material.grade}-sinf`}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: `${subjectColor}20`,
                  color: subjectColor,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
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
            }}
          >
            {material.title}
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
            {material.description || 'Tavsif yo\'q'}
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
              {material.teacher_name?.charAt(0) || 'T'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                {material.teacher_name || 'O\'qituvchi'}
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
                {material.school_name || 'Maktab'}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Ko'rishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Eye size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {material.views || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Yuklab olishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Download size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {material.downloads || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {material.created_at && format(new Date(material.created_at), 'dd.MM.yyyy')}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Yuklab olish">
              <IconButton
                onClick={() => onDownload(material)}
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
                <Download size={20} />
              </IconButton>
            </Tooltip>

            {onView && (
              <Tooltip title="Ko'rish">
                <IconButton
                  onClick={() => onView(material)}
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
                  <Eye size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Admin/Superadmin Actions */}
          {(userRole === 'admin' || userRole === 'superadmin') && !isApproved && onApprove && (
            <Tooltip title="Tasdiqlash">
              <IconButton
                onClick={() => onApprove(material)}
                sx={{
                  bgcolor: 'info.main',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: 'info.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ThumbsUp size={20} />
              </IconButton>
            </Tooltip>
          )}

          {/* Teacher Delete (only unapproved) */}
          {userRole === 'teacher' && !isApproved && onDelete && (
            <Tooltip title="O'chirish">
              <IconButton
                onClick={() => onDelete(material)}
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

export default MaterialCard;