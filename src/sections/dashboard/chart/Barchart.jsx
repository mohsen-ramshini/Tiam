import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

import MainCard from 'components/MainCard';

// Mock Data
const now = new Date();

const latencyData = {
  labels: ['Prop A', 'Prop B', 'Prop C'],
  values: [120, 90, 200],
};

const tlsData = {
  labels: ['Service A', 'Service B'],
  values: [
    Math.floor((new Date('2025-07-01') - now) / (1000 * 60 * 60 * 24)),
    Math.floor((new Date('2025-05-20') - now) / (1000 * 60 * 60 * 24)),
  ],
};

const dnsData = {
  labels: ['192.168.1.1', '8.8.8.8', '10.0.0.1'],
  valuesA: [10, 5, 3],
  valuesB: [2, 12, 6],
};

const NetworkChart = () => {
  const theme = useTheme();
  const [metric, setMetric] = useState('latency');

  const handleChange = (e) => setMetric(e.target.value);

  const axisFontStyle = { fontSize: 12, fill: theme.palette.text.secondary };

  const chartConfig = {
    height: 360,
    grid: { horizontal: true },
    yAxis: [
      {
        disableLine: true,
        disableTicks: true,
        tickLabelStyle: axisFontStyle,
      },
    ],
    margin: { top: 30, left: 40, right: 10 },
    sx: {
      '& .MuiBarElement-root:hover': { opacity: 0.6 },
      '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': {
        stroke: theme.palette.divider,
      },
    },
  };

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Network Metrics</Typography>

          <FormControl size="small">
            <InputLabel>Metric</InputLabel>
            <Select value={metric} onChange={handleChange} label="Metric">
              <MenuItem value="latency">Latency</MenuItem>
              <MenuItem value="tls">TLS Expiry</MenuItem>
              <MenuItem value="dns">DNS Resolutions</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {metric === 'latency' && (
          <BarChart
            xAxis={[{ data: latencyData.labels, scaleType: 'band', tickLabelStyle: axisFontStyle }]}
            series={[
              {
                data: latencyData.values,
                label: 'TCP Latency (ms)',
                color: theme.palette.primary.main,
              },
            ]}
            {...chartConfig}
          />
        )}

        {metric === 'tls' && (
          <BarChart
            xAxis={[{ data: tlsData.labels, scaleType: 'band', tickLabelStyle: axisFontStyle }]}
            series={[
              {
                data: tlsData.values,
                label: 'Days Until Expiry',
                color: theme.palette.warning.main,
              },
            ]}
            {...chartConfig}
          />
        )}

        {metric === 'dns' && (
          <BarChart
            xAxis={[{ data: dnsData.labels, scaleType: 'band', tickLabelStyle: axisFontStyle }]}
            series={[
              {
                data: dnsData.valuesA,
                label: 'Prop A',
                color: theme.palette.primary.main,
              },
              {
                data: dnsData.valuesB,
                label: 'Prop B',
                color: theme.palette.error.main,
              },
            ]}
            {...chartConfig}
          />
        )}
      </Box>
    </MainCard>
  );
};

export default NetworkChart;
