import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange, placeholder = 'Qidirish...', onFilterClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRadius: 2,
              '& fieldset': { border: 'none' },
            },
          }}
        />
        {onFilterClick && (
          <Box
            onClick={onFilterClick}
            sx={{
              minWidth: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.95)',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.05)',
              },
            }}
          >
            <SlidersHorizontal size={24} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default SearchBar;