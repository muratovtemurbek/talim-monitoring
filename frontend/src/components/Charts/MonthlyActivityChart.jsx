import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const MonthlyActivityChart = ({ data }) => {
  const formattedData = data.map(item => ({
    month: new Date(item.month).toLocaleDateString('uz-UZ', { month: 'short' }),
    Materiallar: item.materials,
    Videolar: item.videos,
    Tahlillar: item.analyses,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Oylik Faoliyat
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Materiallar" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="Videolar" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="Tahlillar" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MonthlyActivityChart;