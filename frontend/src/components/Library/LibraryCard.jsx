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
  Download,
  Eye,
  BookOpen,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

const LibraryCard = ({ item, onDownload, onView }) => {
  const getCategoryColor = (category) => {
    const colors = {
      book: '#6366f1',
      article: '#ec4899',
      research: '#10b981',
      guide: '#f59e0b',
      reference: '#3b82f6',
      default: '#64748b',
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'book':
        return <BookOpen size={28} />;
      case 'article':
        return <FileText size={28} />;
      default:
        return <FileText size={28} />;
    }
  };

  const categoryColor = getCategoryColor(item.category);

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
            boxShadow: `0 20px 48px ${categoryColor}30`,
            border: `1px solid ${categoryColor}40`,
            transform: 'translateY(-8px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          {/* Icon & Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: categoryColor,
                width: 56,
                height: 56,
                mr: 2,
                boxShadow: `0 4px 12px ${categoryColor}40`,
              }}
            >
              {getCategoryIcon(item.category)}
            </Avatar>
            <Box>
              <Chip
                label={item.category_display || item.category}
                size="small"
                sx={{
                  bgcolor: `${categoryColor}20`,
                  color: categoryColor,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  mb: 0.5,
                }}
              />
              {item.language && (
                <Chip
                  label={item.language}
                  size="small"
                  sx={{
                    bgcolor: 'grey.200',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              background: `linear-gradient(135deg, ${categoryColor} 0%, #ec4899 100%)`,
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
            {item.title}
          </Typography>

          {/* Author */}
          {item.author && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              👤 {item.author}
            </Typography>
          )}

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              minHeight: 60,
            }}
          >
            {item.description || 'Tavsif yo\'q'}
          </Typography>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: `${categoryColor}10`,
                    color: categoryColor,
                    fontSize: '0.7rem',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Ko'rishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Eye size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {item.views || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Yuklab olishlar">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Download size={16} color="#64748b" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {item.downloads || 0}
                </Typography>
              </Box>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {item.created_at && format(new Date(item.created_at), 'dd.MM.yyyy')}
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Ko'rish">
              <IconButton
                onClick={() => onView(item)}
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

            <Tooltip title="Yuklab olish">
              <IconButton
                onClick={() => onDownload(item)}
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

            {item.url && (
              <Tooltip title="Tashqi havola">
                <IconButton
                  onClick={() => window.open(item.url, '_blank')}
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
                  <ExternalLink size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default LibraryCard;