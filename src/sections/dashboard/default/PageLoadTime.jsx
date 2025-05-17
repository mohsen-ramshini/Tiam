/* eslint-disable prettier/prettier */
// components/your/path/PageLoadTimeChart.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Box,
  Typography,
} from '@mui/material';
import useFetchHistoricalData from '../../../hooks/api/useFetchHistoricalData'; // مسیر درست کن

// ثبت پلاگین‌های ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const PageLoadTimeChart = () => {
  const [mode, setMode] = useState('realtime'); // realtime یا historical
  const [filter, setFilter] = useState('day'); // day, week, month
  const [probs] = useState('1,2');
  const [groupBy] = useState('hour');
  const [func] = useState('avg');
  const [zoomLevel, setZoomLevel] = useState(100);

  const chartRef = useRef(null);
  const now = useMemo(() => new Date(), []);

  // محاسبه بازه زمانی بر اساس فیلتر
  const { start, end } = useMemo(() => {
    let startDate;
    if (filter === 'day') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (filter === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return {
      start: startDate.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    };
  }, [filter, now]);

  // دریافت داده‌های historical
  const { data: historicalData = { data: [] }, isLoading, error } = useFetchHistoricalData({
    start: '2024-01-01',
    end: '2025-04-26',
    probs: '8',
    group_by: 'day',
    func: 'avg',
  });
  

  // مدیریت داده‌های realtime
  const [realtimeData, setRealtimeData] = useState([]);

  useEffect(() => {
    if (mode !== 'realtime') return;

    const intervalId = setInterval(() => {
      const newDataPoint = {
        samplingRate: Date.now(),
        pageLoadTime: Math.random() * 3000, // دیتای فیک
      };

      setRealtimeData((prev) => {
        if (prev.length >= 100) {
          return [...prev.slice(1), newDataPoint];
        }
        return [...prev, newDataPoint];
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mode]);

  // آماده‌سازی داده‌ها برای چارت
  const chartData = useMemo(() => {
    const sourceData = mode === 'realtime' ? realtimeData : historicalData.data;
  
    return {
      labels: sourceData.map((point) =>
        new Date(point.samplingRate || point.timestamp || point.time).toLocaleTimeString()
      ),
      datasets: [
        {
          label: 'Page Load Time (ms)',
          data: sourceData.map((point) => point.pageLoadTime || point.value || point.result),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  }, [mode, realtimeData, historicalData]);
  

  // تنظیمات چارت
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        position: 'bottom',
        ticks: {
          maxTicksLimit: zoomLevel,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: 3000,
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <Box p={3}>
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={2}>
        <FormControl style={{ minWidth: 140 }}>
          <InputLabel>Mode</InputLabel>
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <MenuItem value="realtime">Realtime</MenuItem>
            <MenuItem value="historical">Historical</MenuItem>
          </Select>
        </FormControl>

        {mode === 'historical' && (
          <FormControl style={{ minWidth: 140 }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>
        )}

        <Box style={{ width: 300 }}>
          <Typography gutterBottom>Zoom Level: {zoomLevel}</Typography>
          <Slider
            min={10}
            max={100}
            value={zoomLevel}
            onChange={(e, val) => setZoomLevel(val)}
            valueLabelDisplay="auto"
          />
        </Box>

        <Button
          variant="outlined"
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.resetZoom();
            }
          }}
        >
          Reset Zoom
        </Button>
      </Box>

      <Line ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default PageLoadTimeChart;
