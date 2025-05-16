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
import { toast } from 'sonner';

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

  const taskAssignmentBaseUrl = '/repo/task-assignments/';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [probeRes, taskRes, serviceRes, assignmentRes] = await Promise.all([
        axiosInstance.get('/users/probs/'),
        axiosInstance.get('/repo/tasks/'),
        axiosInstance.get('/repo/services/'),
        axiosInstance.get(taskAssignmentBaseUrl)
      ]);

      setProbes(probeRes.data.results || []);
      setTasks(taskRes.data.results || []);
      const serviceData = serviceRes.data;
      setServices(Array.isArray(serviceData) ? serviceData : serviceData?.results || []);
      setAssignments(assignmentRes.data || []);
      setError(null);
    } catch (err) {
      console.error('خطا در دریافت داده‌ها:', err);
      let errorDetail = 'خطا در بارگذاری اطلاعات اولیه.';
      if (err.response) {
        errorDetail = `خطا در دریافت داده (${err.response.config.url}): ${err.response.status}`;
      } else if (err.request) {
        errorDetail = 'پاسخی از سرور دریافت نشد.';
      } else {
        errorDetail = err.message;
      }
      setError(errorDetail);
      setProbes([]);
      setTasks([]);
      setServices([]);
      setAssignments([]);
      toast.error(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (assignment = null) => {
    if (assignment) {
      setSelectedProbe(assignment.prob || '');
      setSelectedTask(assignment.task || '');
      setSelectedService(assignment.service || '');
      setEditId(assignment.id);
    } else {
      setSelectedProbe('');
      setSelectedTask('');
      setSelectedService('');
      setEditId(null);
    }
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProbe || !selectedTask || !selectedService) {
      setError('لطفاً همه فیلدها (پراب، تسک، سرویس) را انتخاب کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        prob: selectedProbe,
        task: selectedTask,
        service: selectedService,
        schedule: '* * * * *',
        is_active: true
      };

      if (editId) {
        await axiosInstance.put(`${taskAssignmentBaseUrl}${editId}/`, payload);
        toast.success('تخصیص با موفقیت ویرایش شد!');
      } else {
        await axiosInstance.post(taskAssignmentBaseUrl, payload);
        toast.success('تخصیص جدید با موفقیت اضافه شد!');
      }
      fetchData();
      handleClose();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'خطا در ارتباط با سرور یا داده‌های نامعتبر';
      toast.error(`خطا در ذخیره‌سازی: ${errorMsg}`);
      setError(`خطا در ذخیره‌سازی: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این تخصیص مطمئن هستید؟')) {
      setLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`${taskAssignmentBaseUrl}${id}/`);
        toast.success('تخصیص حذف شد!');
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'خطا در ارتباط با سرور';
        toast.error(`خطا در حذف: ${errorMsg}`);
        setError(`خطا در حذف: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const findNameById = (items, id) => {
    const targetId = typeof id === 'object' && id !== null ? id.id : id;
    const item = items.find((i) => i.id === targetId);
    return item ? (item.name || `ID: ${item.id}`) : `ID: ${targetId}`;
  };

  return (
    <MainCard title="مدیریت تخصیص تسک‌ها">
      {error && !open && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} disabled={loading}>
          افزودن تخصیص
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="جدول تخصیص تسک‌ها">
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">پراب</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">تسک</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">سرویس</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : assignments.length > 0 ? (
              assignments.map((assignment) => (
                <TableRow key={assignment.id} hover>
                  <TableCell>{findNameById(probes, assignment.prob)}</TableCell>
                  <TableCell>{findNameById(tasks, assignment.task)}</TableCell>
                  <TableCell>{findNameById(services, assignment.service)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(assignment)} disabled={loading}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(assignment.id)} disabled={loading}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">هیچ تخصیصی موجود نیست</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editId ? 'ویرایش تخصیص' : 'افزودن تخصیص جدید'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="probe-select-label">پراب</InputLabel>
                <Select
                  labelId="probe-select-label"
                  value={selectedProbe}
                  onChange={(e) => setSelectedProbe(e.target.value)}
                  required
                >
                  {probes.map((probe) => (
                    <MenuItem key={probe.id} value={probe.id}>
                      {probe.name || `ID: ${probe.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="task-select-label">تسک</InputLabel>
                <Select
                  labelId="task-select-label"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  required
                >
                  {tasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name || `ID: ${task.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="service-select-label">سرویس</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name || `ID: ${service.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>لغو</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editId ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TaskAssignment;
