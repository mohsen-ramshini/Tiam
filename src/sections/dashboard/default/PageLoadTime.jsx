import React, { useState, useEffect, useRef } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const PageLoadTimeChart = () => {
  const [mode, setMode] = useState('realtime'); // realtime یا historical
  const [filter, setFilter] = useState('day');
  const [dataPoints, setDataPoints] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);

  const chartRef = useRef(null);

  // شبیه‌سازی داده‌های تاریخی
  const fetchHistoricalData = async (filter) => {
    const now = Date.now();
    const hours =
      filter === 'day' ? 24 : filter === 'week' ? 7 * 24 : 30 * 24;
    const result = [];

    for (let i = 0; i < hours; i++) {
      result.push({
        samplingRate: now - i * 60 * 60 * 1000, // هر ساعت
        pageLoadTime: Math.random() * 3000,
      });
    }

    return result.reverse();
  };

  // دریافت داده‌های realtime
  useEffect(() => {
    if (mode !== 'realtime') return;

    const intervalId = setInterval(() => {
      const newDataPoint = {
        samplingRate: Date.now(),
        pageLoadTime: Math.random() * 3000,
      };

      setDataPoints((prevDataPoints) => {
        if (prevDataPoints.length >= 100) {
          return [...prevDataPoints.slice(1), newDataPoint];
        }
        return [...prevDataPoints, newDataPoint];
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [mode]);

  // بارگذاری داده‌های تاریخی
  useEffect(() => {
    if (mode === 'historical') {
      fetchHistoricalData(filter).then((data) => setHistoricalData(data));
    }
  }, [mode, filter]);

  const chartData = mode === 'realtime' ? dataPoints : historicalData;

  const data = {
    labels: chartData.map((point) =>
      new Date(point.samplingRate).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Page Load Time (ms)',
        data: chartData.map((point) => point.pageLoadTime),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

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

      <Line ref={chartRef} data={data} options={options} />
    </Box>
  );
};

export default PageLoadTimeChart;
