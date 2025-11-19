import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const GrowthTrendChart = ({ data }) => {
  const formattedData = data.map(item => ({
    date: new Date(item.day).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }),
    Faoliyat: item.total_activities,
    Ball: item.total_points,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        30 Kunlik O'sish Trendi
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Faoliyat" stroke="#8884d8" fillOpacity={1} fill="url(#colorActivity)" />
            <Area type="monotone" dataKey="Ball" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPoints)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default GrowthTrendChart;