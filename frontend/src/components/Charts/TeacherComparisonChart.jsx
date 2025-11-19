import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const TeacherComparisonChart = ({ data }) => {
  const formattedData = data.map(item => ({
    name: item.name.split(' ').slice(0, 2).join(' '),
    'Jami ball': item.total_points,
    'Oylik ball': item.monthly_points,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Top 10 O'qituvchilar
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Jami ball" fill="#8884d8" />
            <Bar dataKey="Oylik ball" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TeacherComparisonChart;