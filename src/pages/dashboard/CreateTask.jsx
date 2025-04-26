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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from 'api/axiosInstance';

const CreateTask = () => {
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedProbe, setSelectedProbe] = useState('');
  const [tasks, setTasks] = useState([]);
  const [probes, setProbes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskGitRepo, setNewTaskGitRepo] = useState('');
  const [newTaskEntrypoint, setNewTaskEntrypoint] = useState('');
  const [newTaskMetric, setNewTaskMetric] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState([]);

  // گرفتن تسک‌ها از API
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/repo/tasks/?limit=1&offset=0&ordering=-created_at&search=check');
      setTasks(response.data.results || []); // توجه کن که نتایج ممکنه توی results باشه
    } catch (err) {
      console.error('خطا در دریافت تسک‌ها:', err);
    }
  };

  // گرفتن پراب‌ها از API
  const fetchProbes = async () => {
    try {
      const response = await axiosInstance.get('/users/probs/');
      setProbes(response.data);
    } catch (err) {
      console.error('خطا در دریافت پراب‌ها:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProbes();
  }, []);

  const handleCreateOrEditTask = async (e) => {
    e.preventDefault();
    if (!newTaskName || !newTaskDescription || !newTaskGitRepo || !newTaskEntrypoint || !newTaskMetric) {
      setError('لطفا تمام فیلدها را پر کنید');
      return;
    }

    setError(null);
    setCreatingTask(true);

    const taskData = {
      name: newTaskName,
      description: newTaskDescription,
      git_repo: newTaskGitRepo,
      entrypoint: newTaskEntrypoint,
      metric: newTaskMetric,
      is_active: true
    };

    try {
      if (editTaskId) {
        // اگر editTaskId داریم یعنی باید ویرایش کنیم
        await axiosInstance.put(`/repo/tasks/${editTaskId}/`, taskData);
        alert('تسک با موفقیت ویرایش شد!');
      } else {
        // ارسال درخواست برای ایجاد تسک جدید
        await axiosInstance.post('/repo/tasks/', taskData);
        alert('تسک جدید با موفقیت ایجاد شد!');
      }

      fetchTasks(); // بعد از ایجاد یا ویرایش لیست را آپدیت کن
      setShowNewTaskForm(false);
      setNewTaskName('');
      setNewTaskDescription('');
      setNewTaskGitRepo('');
      setNewTaskEntrypoint('');
      setNewTaskMetric('');
      setEditTaskId(null);
    } catch (err) {
      console.error('خطا در ایجاد/ویرایش تسک:', err);
      setError('مشکلی رخ داده است');
    } finally {
      setCreatingTask(false);
    }
  };

  const handleEditTask = (task) => {
    setNewTaskName(task.name);
    setNewTaskDescription(task.description || '');
    setNewTaskGitRepo(task.git_repo || '');
    setNewTaskEntrypoint(task.entrypoint || '');
    setNewTaskMetric(task.metric || '');
    setEditTaskId(task.id);
    setShowNewTaskForm(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('آیا از حذف این تسک مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/repo/tasks/${id}/`);
        alert('تسک با موفقیت حذف شد!');
        fetchTasks(); // بعد از حذف لیست را رفرش کن
      } catch (err) {
        console.error('خطا در حذف تسک:', err);
        alert('خطایی در حذف تسک رخ داد.');
      }
    }
  };

  const handleAssignTask = (e) => {
    e.preventDefault();

    if (!selectedTask || !selectedProbe) {
      setError('لطفاً هر دو مورد را انتخاب کنید');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setTaskAssignments((prev) => [...prev, { taskId: Number(selectedTask), probeId: Number(selectedProbe) }]);
      alert('تسک با موفقیت به پراب اختصاص یافت!');
      setSelectedTask('');
      setSelectedProbe('');
      setLoading(false);
    }, 1000);
  };

  return (
    <MainCard title="مدیریت تسک‌ها و اختصاص به پراب">
      {/* جدول تسک‌ها */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام تسک</TableCell>
              <TableCell>پراب اختصاص یافته</TableCell>
              <TableCell align="center">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              const assignment = taskAssignments.find((a) => a.taskId === task.id);
              const probeName = assignment ? probes.find((p) => p.id === assignment.probeId)?.name || '---' : '---';

              return (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{probeName}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEditTask(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  هیچ تسکی موجود نیست.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* دکمه باز کردن فرم */}
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => {
          setShowNewTaskForm(true);
          setNewTaskName('');
          setNewTaskDescription('');
          setNewTaskGitRepo('');
          setNewTaskEntrypoint('');
          setNewTaskMetric('');
          setEditTaskId(null);
        }}
      >
        ایجاد تسک جدید
      </Button>

      {/* فرم ساخت یا ویرایش تسک */}
      {showNewTaskForm && (
        <form onSubmit={handleCreateOrEditTask}>
          <Stack spacing={2} mb={4}>
            <TextField label="نام تسک" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} fullWidth error={!!error} />
            <TextField label="توضیحات" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} fullWidth />
            <TextField label="آدرس Git Repo" value={newTaskGitRepo} onChange={(e) => setNewTaskGitRepo(e.target.value)} fullWidth />
            <TextField label="Entry Point" value={newTaskEntrypoint} onChange={(e) => setNewTaskEntrypoint(e.target.value)} fullWidth />
            <TextField label="متریک" value={newTaskMetric} onChange={(e) => setNewTaskMetric(e.target.value)} fullWidth />
            {error && <Typography color="error">{error}</Typography>}

            <Button type="submit" variant="contained" disabled={creatingTask}>
              {creatingTask ? <CircularProgress size={24} /> : editTaskId ? 'ویرایش تسک' : 'افزودن تسک'}
            </Button>
          </Stack>
        </form>
      )}

      {/* فرم اختصاص تسک به پراب */}
      <form onSubmit={handleAssignTask}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="task-select-label">تسک</InputLabel>
            <Select labelId="task-select-label" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="probe-select-label">پراب</InputLabel>
            <Select labelId="probe-select-label" value={selectedProbe} onChange={(e) => setSelectedProbe(e.target.value)}>
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
