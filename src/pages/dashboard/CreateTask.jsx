/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import {
  Button,
  Stack,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  TextField,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from 'api/axiosInstance';

const CreateTask = () => {
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedProbe, setSelectedProbe] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'تسک نمونه ۱' },
    { id: 2, name: 'تسک نمونه ۲' }
  ]);
  const [probes, setProbes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ساخت تسک جدید
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  // دریافت لیست پراب‌ها از API
  useEffect(() => {
    const fetchProbes = async () => {
      try {
        const response = await axiosInstance.get('/users/probs/');
        setProbes(response.data); // فرض بر اینکه آرایه‌ای از پراب‌ها برمی‌گردونه
      } catch (err) {
        console.error('خطا در دریافت پراب‌ها:', err);
      }
    };

    fetchProbes();
  }, []);

  const handleCreateTask = () => {
    if (!newTaskName) return;

    setCreatingTask(true);

    setTimeout(() => {
      const newTask = {
        id: tasks.length + 1,
        name: newTaskName
      };
      setTasks((prev) => [...prev, newTask]);
      setSelectedTask(newTask.id);
      setNewTaskName('');
      setShowNewTaskInput(false);
      setCreatingTask(false);
      alert('تسک جدید اضافه شد!');
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTask || !selectedProbe) {
      setError('لطفاً هر دو مورد را انتخاب کنید');
      return;
    }

    setError(null);
    setLoading(true);

    // شبیه‌سازی اختصاص تسک به پراب
    setTimeout(() => {
      console.log('تخصیص انجام شد:', {
        task_id: selectedTask,
        probe_id: selectedProbe
      });
      alert('تسک با موفقیت به پراب اختصاص یافت!');
      setSelectedTask('');
      setSelectedProbe('');
      setLoading(false);
    }, 1000);
  };

  return (
    <MainCard title="اختصاص تسک به پراب">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* انتخاب تسک */}
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <FormControl fullWidth>
              <InputLabel id="task-label">تسک</InputLabel>
              <Select labelId="task-label" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                {tasks.map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setShowNewTaskInput(!showNewTaskInput)} color="primary">
              <AddIcon />
            </IconButton>
          </Stack>

          {/* ورودی ساخت تسک جدید */}
          {showNewTaskInput && (
            <Stack direction="row" spacing={1}>
              <TextField label="نام تسک جدید" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} fullWidth />
              <Button onClick={handleCreateTask} variant="contained" disabled={creatingTask}>
                {creatingTask ? <CircularProgress size={20} /> : 'افزودن'}
              </Button>
            </Stack>
          )}

          {/* انتخاب پراب */}
          <FormControl fullWidth>
            <InputLabel id="probe-label">پراب</InputLabel>
            <Select labelId="probe-label" value={selectedProbe} onChange={(e) => setSelectedProbe(e.target.value)}>
              {probes.map((probe) => (
                <MenuItem key={probe.id} value={probe.id}>
                  {probe.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'اختصاص تسک به پراب'}
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default CreateTask;
