    import React, { useState } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { ExpandMore, FilterList, Clear } from '@mui/icons-material';

const AdvancedFilter = ({ onFilter, onClear, subjects }) => {
  const [filters, setFilters] = useState({
    subject: '',
    grade_min: '',
    grade_max: '',
    created_after: '',
    created_before: '',
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      subject: '',
      grade_min: '',
      grade_max: '',
      created_after: '',
      created_before: '',
    });
    onClear();
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography>Kengaytirilgan filtr</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Fan</InputLabel>
              <Select
                name="subject"
                value={filters.subject}
                onChange={handleChange}
                label="Fan"
              >
                <MenuItem value="">Barchasi</MenuItem>
                {subjects && subjects.map((sub) => (
                  <MenuItem key={sub.value} value={sub.value}>
                    {sub.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Sinf (min)"
              name="grade_min"
              type="number"
              value={filters.grade_min}
              onChange={handleChange}
              inputProps={{ min: 1, max: 11 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Sinf (max)"
              name="grade_max"
              type="number"
              value={filters.grade_max}
              onChange={handleChange}
              inputProps={{ min: 1, max: 11 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Dan"
              name="created_after"
              type="date"
              value={filters.created_after}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Gacha"
              name="created_before"
              type="date"
              value={filters.created_before}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApply}
              sx={{ height: '40px' }}
            >
              Qidirish
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<Clear />}
            size="small"
          >
            Tozalash
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AdvancedFilter;