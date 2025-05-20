import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper, Stack } from '@mui/material';

const probeData = [
  { id: 'Probe A (127.0.0.1)', value: 20 },
  { id: 'Probe B (185.12.0.1)', value: 10 },
  { id: 'Probe C (185.12.0.2)', value: 5 },
  { id: 'Probe D (10.0.0.5)', value: 8 },
];

const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

const totalValue = probeData.reduce((sum, item) => sum + item.value, 0);

function LegendItem({ color, label }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      <Box sx={{ width: 16, height: 16, bgcolor: color, borderRadius: '3px' }} />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}

export default function DNSProbePieChart() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100"
      p={2}
    >
      <Paper elevation={4} sx={{ padding: 4, maxWidth: 650, width: '100%' }}>
        <Typography variant="h6" component="h2" textAlign="center" gutterBottom>
          سهم پراب‌ها در نتایج متریک DNS برای www.tapsi.ir
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" gap={6}>
          <PieChart
            series={[
              {
                data: probeData,
                colors,
                valueFormatter: (value) => `${value} بار`,
                arcLabel: (item) => {
                  const percent = ((item.value / totalValue) * 100).toFixed(1);
                  return `${percent}%`;
                },
                arcLabelMinAngle: 15,
                arcLabelRadius: '60%',
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 40, additionalRadius: -40, color: 'lightgray' },
              },
            ]}
            height={320}
            width={320}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: 'bold',
                fill: '#222',
                fontSize: 13,
              },
            }}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              راهنما
            </Typography>
            {probeData.map((item, index) => (
              <LegendItem key={item.id} color={colors[index]} label={item.id} />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
