import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
  OutlinedInput, Box, Typography, useMediaQuery, useTheme
} from '@mui/material';

const hosts = ['host1', 'host2', 'host3'];
const metrics = ['latency', 'ping'];

const data = [
  { time: '10:00', host1_latency: 20, host1_ping: 5, host2_latency: 30, host2_ping: 8, host3_latency: 15, host3_ping: 3 },
  { time: '10:01', host1_latency: 25, host1_ping: 7, host2_latency: 28, host2_ping: 9, host3_latency: 14, host3_ping: 4 },
  { time: '10:02', host1_latency: 22, host1_ping: 6, host2_latency: 35, host2_ping: 7, host3_latency: 16, host3_ping: 5 },
  { time: '10:03', host1_latency: 23, host1_ping: 6, host2_latency: 31, host2_ping: 9, host3_latency: 17, host3_ping: 6 },
  { time: '10:04', host1_latency: 21, host1_ping: 5, host2_latency: 29, host2_ping: 8, host3_latency: 18, host3_ping: 4 },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const colors = ['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#00c49f'];

export default function MultiHostLineChartWithMUI() {
  const [selectedHosts, setSelectedHosts] = useState(['host1']);
  const [selectedMetric, setSelectedMetric] = useState('latency');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleHostsChange = (event) => {
    const { target: { value } } = event;
    setSelectedHosts(typeof value === 'string' ? value.split(',') : value);
  };

  const handleMetricChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 720,
        mx: 'auto',
        mt: isSmallScreen ? 2 : 4,
        px: isSmallScreen ? 1 : 3,
      }}
    >
      <Typography variant={isSmallScreen ? 'subtitle1' : 'h6'} gutterBottom>
        انتخاب هاست‌ها
      </Typography>
      <FormControl fullWidth size={isSmallScreen ? 'small' : 'medium'}>
        <InputLabel id="hosts-multi-select-label">هاست‌ها</InputLabel>
        <Select
          labelId="hosts-multi-select-label"
          multiple
          value={selectedHosts}
          onChange={handleHostsChange}
          input={<OutlinedInput label="هاست‌ها" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {hosts.map((host) => (
            <MenuItem key={host} value={host}>
              <Checkbox checked={selectedHosts.indexOf(host) > -1} />
              <ListItemText primary={host} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={isSmallScreen ? 2 : 3}>
        <Typography variant={isSmallScreen ? 'subtitle1' : 'h6'} gutterBottom>
          انتخاب متریک
        </Typography>
        <FormControl fullWidth size={isSmallScreen ? 'small' : 'medium'}>
          <InputLabel id="metric-select-label">متریک</InputLabel>
          <Select
            labelId="metric-select-label"
            value={selectedMetric}
            label="متریک"
            onChange={handleMetricChange}
          >
            {metrics.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={isSmallScreen ? 3 : 4} height={isSmallScreen ? 300 : 350}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedHosts.map((host, idx) => (
              <Line
                key={host}
                type="monotone"
                dataKey={`${host}_${selectedMetric}`}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
