import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

const SubjectDistributionChart = ({ data }) => {
  const subjectNames = {
    math: 'Matematika',
    physics: 'Fizika',
    chemistry: 'Kimyo',
    biology: 'Biologiya',
    informatics: 'Informatika',
    english: 'Ingliz tili',
    uzbek: 'O\'zbek tili',
    russian: 'Rus tili',
    history: 'Tarix',
    geography: 'Geografiya',
  };

  const formattedData = data.map(item => ({
    name: subjectNames[item.subject] || item.subject,
    value: item.count,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Fanlar bo'yicha taqsimot
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SubjectDistributionChart;