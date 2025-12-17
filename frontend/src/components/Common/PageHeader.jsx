import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, icon: Icon, action, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {Icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Icon size={32} color="white" />
            </Box>
          )}
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {action && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s',
            }}
          >
            {action}
          </Button>
        )}
      </Box>
    </motion.div>
  );
};

export default PageHeader;