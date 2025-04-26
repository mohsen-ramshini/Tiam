/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import {
  TextField,
  Button,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from 'api/axiosInstance';

const CreateTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gitRepo, setGitRepo] = useState('');
  const [entrypoint, setEntrypoint] = useState('');
  const [metric, setMetric] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/repo/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('خطا در دریافت تسک‌ها:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpen = () => {
    setName('');
    setDescription('');
    setGitRepo('');
    setEntrypoint('');
    setMetric('');
    setIsActive(true);
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !gitRepo || !entrypoint || !metric) {
      setError('لطفاً همه فیلدها را پر کنید');
      return;
    }

    const payload = { name, description, git_repo: gitRepo, entrypoint, metric, is_active: isActive };

    setLoading(true);
    setError(null);

    try {
      if (editId) {
        await axiosInstance.put(`/repo/tasks/${editId}/`, payload);
        alert('تسک با موفقیت ویرایش شد!');
      } else {
        await axiosInstance.post('/repo/tasks/', payload);
        alert('تسک با موفقیت اضافه شد!');
      }
      fetchTasks();
      handleClose();
    } catch (err) {
      console.error('خطا:', err);
      setError('خطا در ذخیره‌سازی تسک');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setName(task.name);
    setDescription(task.description);
    setGitRepo(task.git_repo);
    setEntrypoint(task.entrypoint);
    setMetric(task.metric);
    setIsActive(task.is_active);
    setEditId(task.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این تسک مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/repo/tasks/${id}/`);
        fetchTasks();
        alert('تسک حذف شد!');
      } catch (err) {
        console.error('خطا در حذف تسک:', err);
      }
    }
  };

  return (
    <MainCard title="مدیریت تسک‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن تسک
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">توضیحات</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">مترک</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.metric}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ تسکی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* فرم ساخت/ویرایش داخل دیالوگ */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'ویرایش تسک' : 'افزودن تسک'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="نام تسک" value={name} onChange={(e) => setName(e.target.value)} fullWidth error={!!error} />
            <TextField label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} error={!!error} />
            <TextField label="گیت ریپو" value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} fullWidth error={!!error} />
            <TextField label="ورودی (entrypoint)" value={entrypoint} onChange={(e) => setEntrypoint(e.target.value)} fullWidth error={!!error} />
            <TextField label="مترک (metric)" value={metric} onChange={(e) => setMetric(e.target.value)} fullWidth error={!!error} />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : editId ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateTask;
