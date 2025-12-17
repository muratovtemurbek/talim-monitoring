import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Clock,
  FileText,
  Award,
  TrendingUp,
  Play,
} from 'lucide-react';

const TestCard = ({ test, onStart }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
    };
    return colors[difficulty] || '#64748b';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      math: '#6366f1',
      physics: '#ec4899',
      chemistry: '#10b981',
      biology: '#f59e0b',
      informatics: '#3b82f6',
      pedagogy: '#8b5cf6',
      psychology: '#06b6d4',
      default: '#64748b',
    };
    return colors[subject] || colors.default;
  };

  const difficultyColor = getDifficultyColor(test.difficulty);
  const subjectColor = getSubjectColor(test.subject);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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
          '&:hover': {
            boxShadow: `0 20px 48px ${subjectColor}30`,
            border: `1px solid ${subjectColor}40`,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          {/* Icon & Status */}
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
              <Chip
                label={test.difficulty === 'easy' ? 'Oson' : test.difficulty === 'medium' ? "O'rtacha" : 'Qiyin'}
                size="small"
                sx={{
                  bgcolor: `${difficultyColor}20`,
                  color: difficultyColor,
                  fontWeight: 700,
                  mb: 0.5,
                }}
              />
              <Chip
                label={test.subject}
                size="small"
                sx={{
                  bgcolor: `${subjectColor}20`,
                  color: subjectColor,
                  fontWeight: 600,
                  ml: 0.5,
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {test.title}
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
            {test.description || 'Tavsif yo\'q'}
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${subjectColor}08`,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} color={subjectColor} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {test.duration} daqiqa
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileText size={16} color={subjectColor} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {test.questions_count} ta savol
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Award size={16} color={subjectColor} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                O'tish bali: {test.passing_score}%
              </Typography>
            </Box>
          </Box>

          {/* Best Score */}
          {test.best_score !== null && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Eng yaxshi natija:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: subjectColor }}>
                  {test.best_score}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={test.best_score}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: subjectColor,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          {/* Attempts */}
          {test.attempts_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={16} color={subjectColor} />
              <Typography variant="caption" color="text.secondary">
                {test.attempts_count} marta topshirilgan
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Play size={20} />}
            onClick={() => onStart(test)}
            sx={{
              background: `linear-gradient(135deg, ${subjectColor} 0%, ${difficultyColor} 100%)`,
              fontWeight: 700,
              py: 1.5,
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: `0 8px 24px ${subjectColor}40`,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Testni boshlash
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default TestCard;