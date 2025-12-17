import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatCard = ({ title, value, icon, color, gradient, trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <Box
        sx={{
          background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
          borderRadius: 4,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${color}30`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: `0 12px 40px ${color}40`,
            border: `1px solid ${color}60`,
          },
        }}
      >
        {/* Background Circle Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `${color}15`,
            filter: 'blur(40px)',
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color, mb: 1 }}>
              <CountUp end={value} duration={2} separator="," />
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: trend > 0 ? 'success.main' : 'error.main',
                    fontWeight: 600,
                    bgcolor: trend > 0 ? 'success.light' : 'error.light',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  bu oyda
                </Typography>
              </Box>
            )}
          </Box>

          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
              boxShadow: `0 8px 24px ${color}40`,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </Box>
    </motion.div>
  );
};

export default StatCard;