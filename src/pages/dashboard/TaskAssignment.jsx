/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import {
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
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from 'api/axiosInstance';

const TaskAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [probes, setProbes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedProbe, setSelectedProbe] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [probeRes, taskRes, serviceRes, assignmentRes] = await Promise.all([
        axiosInstance.get('/users/probs/'),
        axiosInstance.get('/repo/tasks/'),
        axiosInstance.get('/users/services/'), // فرض کردم همچین چیزی داری
        axiosInstance.get('/users/taskassignments/') // فرضی: برای لود لیست assignmentها
      ]);
      setProbes(probeRes.data);
      setTasks(taskRes.data);
      setServices(serviceRes.data.results || []); // اگر results توش بود (مثل سرچ)
      setAssignments(assignmentRes.data);
    } catch (err) {
      console.error('خطا در دریافت داده‌ها:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => {
    setSelectedProbe('');
    setSelectedTask('');
    setSelectedService('');
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProbe || !selectedTask || !selectedService) {
      setError('لطفاً همه فیلدها را انتخاب کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        probe: selectedProbe,
        task: selectedTask,
        service: selectedService
      };

      if (editId) {
        await axiosInstance.put(`/users/taskassignments/${editId}/`, payload);
        alert('تخصیص با موفقیت ویرایش شد!');
      } else {
        await axiosInstance.post('/users/taskassignments/', payload);
        alert('تخصیص جدید اضافه شد!');
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error('خطا:', err);
      setError('خطا در ذخیره‌سازی تخصیص');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedProbe(assignment.probe);
    setSelectedTask(assignment.task);
    setSelectedService(assignment.service);
    setEditId(assignment.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این تخصیص مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/users/taskassignments/${id}/`);
        fetchData();
        alert('تخصیص حذف شد!');
      } catch (err) {
        console.error('خطا در حذف تخصیص:', err);
      }
    }
  };

  return (
    <MainCard title="مدیریت تخصیص تسک‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن تخصیص
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">پراب</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">تسک</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">سرویس</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{probes.find((p) => p.id === assignment.probe)?.name || assignment.probe}</TableCell>
                <TableCell>{tasks.find((t) => t.id === assignment.task)?.name || assignment.task}</TableCell>
                <TableCell>{services.find((s) => s.id === assignment.service)?.name || assignment.service}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(assignment)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(assignment.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ تخصیصی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* فرم ساخت/ویرایش داخل دیالوگ */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'ویرایش تخصیص' : 'افزودن تخصیص'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>پراب</InputLabel>
              <Select value={selectedProbe} onChange={(e) => setSelectedProbe(e.target.value)} label="پراب">
                {probes.map((probe) => (
                  <MenuItem key={probe.id} value={probe.id}>
                    {probe.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>تسک</InputLabel>
              <Select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} label="تسک">
                {tasks.map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name} {/* اینجا فقط اسم تسک نشون میدم */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>سرویس</InputLabel>
              <Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} label="سرویس">
                {services.length > 0 ? (
                  services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name || `سرویس ${service.id}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>سرویسی موجود نیست</MenuItem>
                )}
              </Select>
            </FormControl>

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

export default TaskAssignment;
