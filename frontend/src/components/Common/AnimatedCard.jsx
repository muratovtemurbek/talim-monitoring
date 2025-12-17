import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        {...props}
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          ...props.sx,
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;