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

  // این دو تا برای فیلتر
  const [ordering, setOrdering] = useState('created_at'); // مقدار پیش‌فرض
  const [limit, setLimit] = useState(5); // مقدار پیش‌فرض

  const taskAssignmentBaseUrl = '/repo/task-assignments/';

  const fetchData = async (orderingParam = ordering, limitParam = limit) => {
    setLoading(true);
    try {
      const [probeRes, taskRes, serviceRes, assignmentRes] = await Promise.all([
        axiosInstance.get('/users/probs/'),
        axiosInstance.get('/repo/tasks/'),
        axiosInstance.get('/repo/services/'),
        axiosInstance.get(`${taskAssignmentBaseUrl}?ordering=${orderingParam}&limit=${limitParam}`) // اضافه کردن پارامترها به URL
      ]);

      setProbes(probeRes.data.results || []);
      setTasks(taskRes.data.results || []);
      const serviceData = serviceRes.data;
      setServices(Array.isArray(serviceData) ? serviceData : serviceData?.results || []);
      setAssignments(assignmentRes.data.results || []); // توجه به structure داده
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

  // هر بار ordering یا limit تغییر کنه، داده‌ها رو دوباره بگیر
  useEffect(() => {
    fetchData(ordering, limit);
  }, [ordering, limit]);

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
      fetchData(ordering, limit);
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
        fetchData(ordering, limit);
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
      {/* فیلترها */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="flex-start" flexWrap="wrap">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="ordering-select-label">مرتب‌سازی</InputLabel>
          <Select
            labelId="ordering-select-label"
            value={ordering}
            label="مرتب‌سازی"
            onChange={(e) => setOrdering(e.target.value)}
          >
            <MenuItem value="created_at">تاریخ ایجاد</MenuItem>
            <MenuItem value="-created_at">تاریخ ایجاد نزولی</MenuItem>
            <MenuItem value="prob">پراب</MenuItem>
            <MenuItem value="task">تسک</MenuItem>
            <MenuItem value="service">سرویس</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="limit-select-label">تعداد</InputLabel>
          <Select
            labelId="limit-select-label"
            value={limit}
            label="تعداد"
            onChange={(e) => setLimit(e.target.value)}
          >
            {[2, 5, 10, 20, 50].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {error && !open && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} disabled={loading}>
          افزودن تخصیص
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="جدول تخصیص تسک‌ها">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">پراب</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">تسک</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">سرویس</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight="bold">عملیات</Typography>
              </TableCell>
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
                    <IconButton onClick={() => handleOpen(assignment)} disabled={loading}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assignment.id)} disabled={loading}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  داده‌ای برای نمایش وجود ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* مودال افزودن / ویرایش */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'ویرایش تخصیص تسک' : 'افزودن تخصیص تسک جدید'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="probe-select-label">انتخاب پراب</InputLabel>
              <Select
                labelId="probe-select-label"
                value={selectedProbe}
                label="انتخاب پراب"
                onChange={(e) => setSelectedProbe(e.target.value)}
              >
                {probes.map((probe) => (
                  <MenuItem key={probe.id} value={probe.id}>
                    {probe.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="task-select-label">انتخاب تسک</InputLabel>
              <Select
                labelId="task-select-label"
                value={selectedTask}
                label="انتخاب تسک"
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                {tasks.map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="service-select-label">انتخاب سرویس</InputLabel>
              <Select
                labelId="service-select-label"
                value={selectedService}
                label="انتخاب سرویس"
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            لغو
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editId ? 'ویرایش' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TaskAssignment;
