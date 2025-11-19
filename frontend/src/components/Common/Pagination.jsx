import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

const Pagination = ({ count, page, onChange, totalItems }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography variant="body2" color="textSecondary">
        Jami: {totalItems} ta
      </Typography>
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default Pagination;