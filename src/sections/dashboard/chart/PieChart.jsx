import * as React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

// داده نمونه
const fakeData = {
  'www.tapsi.ir': [
    { probe: 'probe-1', ip: '185.12.0.1' },
    { probe: 'probe-2', ip: '127.0.0.1' },
    { probe: 'probe-3', ip: '185.12.0.1' },
    { probe: 'probe-4', ip: '127.0.0.1' },
    { probe: 'probe-5', ip: '192.168.1.1' },
  ],
  'www.digikala.com': [
    { probe: 'probe-1', ip: '10.0.0.1' },
    { probe: 'probe-2', ip: '10.0.0.1' },
    { probe: 'probe-3', ip: '185.12.0.1' },
  ],
};

// پالت رنگ ثابت برای IPها
const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

function getIpCounts(probes) {
  const counts = {};
  for (const p of probes) {
    counts[p.ip] = (counts[p.ip] || 0) + 1;
  }
  return Object.entries(counts).map(([ip, value]) => ({ id: ip, value }));
}

function LegendItem({ color, label }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      <Box sx={{ width: 16, height: 16, bgcolor: color, borderRadius: 1 }} />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}

export default function HostIPDistributionChart() {
  const [selectedHost, setSelectedHost] = React.useState('www.tapsi.ir');

  const probeResults = fakeData[selectedHost];
  const data = getIpCounts(probeResults);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // به داده رنگ اضافه می‌کنیم، رنگ‌ها چرخشی هستن اگر بیش از تعداد رنگ‌ها آی‌پی بود
  const dataWithColors = data.map((d, i) => ({
    ...d,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <Paper sx={{ p: 4, maxWidth: 650, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        توزیع IPهای بازگشتی از پراب‌ها برای سرویس
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>هاست</InputLabel>
        <Select
          value={selectedHost}
          label="هاست"
          onChange={(e) => setSelectedHost(e.target.value)}
        >
          {Object.keys(fakeData).map((host) => (
            <MenuItem key={host} value={host}>
              {host}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" justifyContent="center" gap={6}>
        <PieChart
          series={[
            {
              data: dataWithColors,
              colors: dataWithColors.map((d) => d.color),
              arcLabel: (item) => `${((item.value / total) * 100).toFixed(1)}%`,
              arcLabelMinAngle: 15,
              arcLabelRadius: '60%',
            },
          ]}
          height={300}
          width={300}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: 'bold',
              fill: '#333',
              fontSize: 13,
            },
          }}
        />

        {/* Legend کنار نمودار */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            راهنما
          </Typography>
          {dataWithColors.map((d) => (
            <LegendItem key={d.id} color={d.color} label={`${d.id} (${d.value} بار)`} />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
