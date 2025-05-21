/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard'; // فرض می‌کنیم MainCard در مسیر درستی قرار دارد
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
import axiosInstance from 'api/axiosInstance'; // مطمئن شوید این instance به درستی تنظیم شده باشد

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
  const [editId, setEditId] = useState(null); // شناسه تخصیص برای ویرایش
  const [open, setOpen] = useState(false); // وضعیت باز بودن دیالوگ فرم

  // آدرس پایه API برای تخصیص تسک
  const taskAssignmentBaseUrl = '/repo/task-assignments/';

  // --- تابع برای دریافت داده‌های اولیه ---
  const fetchData = async () => {
    setLoading(true); // نمایش لودینگ هنگام دریافت داده‌ها
    try {
      // دریافت همزمان همه داده‌های لازم
      const [probeRes, taskRes, serviceRes, assignmentRes] = await Promise.all([
        axiosInstance.get('/users/probs/'),      // آدرس دریافت پراب‌ها (مطمئن شوید این آدرس صحیح است)
        axiosInstance.get('/repo/tasks/'),       // آدرس دریافت تسک‌ها (مطمئن شوید این آدرس صحیح است)
        axiosInstance.get('/repo/services/'),    // <--- آدرس دریافت سرویس‌ها (اصلاح شده)
        axiosInstance.get(taskAssignmentBaseUrl) // آدرس دریافت لیست تخصیص‌ها
      ]);

      // تنظیم Stateها با داده‌های دریافتی
      setProbes(probeRes.data.results || []);
      setTasks(taskRes.data.results || []);

      // مدیریت پاسخ سرویس‌ها (ممکن است صفحه‌بندی شده باشد)
      const serviceData = serviceRes.data;
      setServices(Array.isArray(serviceData) ? serviceData : serviceData?.results || []);


      setAssignments(assignmentRes.data || []);

      setError(null); // پاک کردن خطای قبلی در صورت موفقیت


    } catch (err) {
      console.error('خطا در دریافت داده‌ها:', err);
      let errorDetail = 'خطا در بارگذاری اطلاعات اولیه.';
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        // نمایش URL که باعث خطا شده برای دیباگ راحت‌تر
        errorDetail = `خطا در دریافت داده (${err.response.config.url}): ${err.response.status}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorDetail = 'پاسخی از سرور دریافت نشد.';
      } else {
        console.error('Error setting up request:', err.message);
      }
      setError(errorDetail); // نمایش خطا به کاربر
      // خالی کردن لیست‌ها در صورت بروز خطا
      setProbes([]);
      setTasks([]);
      setServices([]);
      setAssignments([]);
    } finally {
        setLoading(false); // پایان لودینگ
    }
  };

  // دریافت داده‌ها هنگام بارگذاری اولیه کامپوننت
  useEffect(() => {
    fetchData();
    console.log(probes);
    
  }, []);

  // باز کردن دیالوگ فرم (برای ایجاد یا ویرایش)
  const handleOpen = (assignment = null) => {
    if (assignment) {
      // حالت ویرایش: پر کردن فرم با داده‌های موجود
      setSelectedProbe(assignment.prob || ''); // استفاده از prob چون payload با این نام ارسال می‌شود
      setSelectedTask(assignment.task || '');
      setSelectedService(assignment.service || '');
      setEditId(assignment.id);
    } else {
      // حالت ایجاد: خالی کردن فرم
      setSelectedProbe('');
      setSelectedTask('');
      setSelectedService('');
      setEditId(null);
    }
    setError(null); // پاک کردن خطاهای قبلی فرم
    setOpen(true); // باز کردن دیالوگ
  };

  // بستن دیالوگ فرم
  const handleClose = () => {
    setOpen(false);
  };

  // ارسال فرم (ایجاد یا ویرایش تخصیص)
  const handleSubmit = async (e) => {
    e.preventDefault(); // جلوگیری از رفرش صفحه
    // اعتبارسنجی ساده ورودی‌ها
    if (!selectedProbe || !selectedTask || !selectedService) {
      setError('لطفاً همه فیلدها (پراب، تسک، سرویس) را انتخاب کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Payload مطابق با انتظار بک‌اند
      const payload = {
        prob: selectedProbe,       // نام فیلد: prob
        task: selectedTask,
        service: selectedService,
        schedule: '* * * * *',   // مقدار پیش‌فرض schedule
        is_active: true          // مقدار پیش‌فرض is_active
      };

      if (editId) {
        // ویرایش (PUT)
        await axiosInstance.put(`${taskAssignmentBaseUrl}${editId}/`, payload);
        alert('تخصیص با موفقیت ویرایش شد!'); // یا استفاده از Snackbar/Toast
      } else {
        // ایجاد (POST)
        await axiosInstance.post(taskAssignmentBaseUrl, payload);
        alert('تخصیص جدید با موفقیت اضافه شد!'); // یا استفاده از Snackbar/Toast
      }
      fetchData(); // بارگذاری مجدد لیست تخصیص‌ها
      handleClose(); // بستن دیالوگ
    } catch (err) {
      console.error('خطا در ذخیره‌سازی تخصیص:', err);
      // نمایش خطای دقیق‌تر از سمت سرور در صورت وجود
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'خطا در ارتباط با سرور یا داده‌های نامعتبر';
      setError(`خطا در ذخیره‌سازی: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // تابع کمکی برای پیدا کردن نام آیتم بر اساس ID
  const findNameById = (items, id) => {
    const targetId = typeof id === 'object' && id !== null ? id.id : id;
    const item = items.find((i) => i.id === targetId);
    // اگر آیتم نام نداشت یا پیدا نشد، خود ID را نمایش بده
    return item ? (item.name || `ID: ${item.id}`) : `ID: ${targetId}`;
  };

  // حذف یک تخصیص
  const handleDelete = async (id) => {
    // تأیید قبل از حذف
    if (window.confirm('آیا از حذف این تخصیص مطمئن هستید؟')) {
      setLoading(true); // نمایش لودینگ هنگام حذف
      setError(null); // پاک کردن خطای قبلی
      try {
        // حذف (DELETE)
        await axiosInstance.delete(`${taskAssignmentBaseUrl}${id}/`);
        alert('تخصیص حذف شد!'); // یا استفاده از Snackbar/Toast
        fetchData(); // بارگذاری مجدد لیست
      } catch (err) {
        console.error('خطا در حذف تخصیص:', err);
        const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'خطا در ارتباط با سرور';
        setError(`خطا در حذف: ${errorMsg}`); // نمایش خطا
        // alert(`خطا در حذف تخصیص: ${errorMsg}`); // نمایش خطا با alert در صورت نیاز
      } finally {
          setLoading(false); // پایان لودینگ
      }
    }
  };


  const findNameById = (items, id) => {
    const targetId = typeof id === 'object' && id !== null ? id.id : id;
    const item = items.find((i) => i.id === targetId);
    return item ? item.name || `ID: ${item.id}` : `ID: ${targetId}`;
  };

  return (
    <MainCard title="مدیریت تخصیص تسک‌ها">
      {/* فیلترها */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="flex-start" flexWrap="wrap">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="ordering-select-label">مرتب‌سازی</InputLabel>
          <Select labelId="ordering-select-label" value={ordering} label="مرتب‌سازی" onChange={(e) => setOrdering(e.target.value)}>
            <MenuItem value="created_at">تاریخ ایجاد</MenuItem>
            <MenuItem value="-created_at">تاریخ ایجاد نزولی</MenuItem>
            <MenuItem value="prob">پراب</MenuItem>
            <MenuItem value="task">تسک</MenuItem>
            <MenuItem value="service">سرویس</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="limit-select-label">تعداد</InputLabel>
          <Select labelId="limit-select-label" value={limit} label="تعداد" onChange={(e) => setLimit(e.target.value)}>
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


      {/* دکمه افزودن */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} disabled={loading}>
          افزودن تخصیص
        </Button>
      </Stack>

      {/* جدول نمایش تخصیص‌ها */}
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
            {loading && assignments.length === 0 ? ( // نمایش لودینگ فقط اگر داده‌ای برای نمایش نیست
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : assignments.length > 0 ? (
              assignments.map((assignment) => (
                <TableRow key={assignment.id} hover>
                  <TableCell>{findNameById(probes, assignment.prob)}</TableCell> {/* استفاده از prob */}
                  <TableCell>{findNameById(tasks, assignment.task)}</TableCell>
                  <TableCell>{findNameById(services, assignment.service)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpen(assignment)} aria-label="ویرایش" disabled={loading}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(assignment.id)} aria-label="حذف" disabled={loading}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : !loading ? ( // فقط اگر لودینگ تمام شده و داده‌ای نیست
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    هیچ تخصیصی یافت نشد.
                  </TableCell>
                </TableRow>
             ) : null /* در حین لودینگ داده‌های قبلی، چیزی نشان نده */}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- فرم ساخت/ویرایش داخل دیالوگ --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{editId ? 'ویرایش تخصیص' : 'افزودن تخصیص جدید'}</DialogTitle>
        {/* استفاده از تگ form برای ارسال با Enter */}
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Dropdown پراب */}
              <FormControl fullWidth required error={!selectedProbe && !!error}>
                <InputLabel id="probe-select-label">پراب</InputLabel>
                <Select
                  labelId="probe-select-label"
                  value={selectedProbe}
                  onChange={(e) => setSelectedProbe(e.target.value)}
                  label="پراب"
                >
                  {probes.length === 0 && <MenuItem disabled>در حال بارگذاری یا پرابی یافت نشد...</MenuItem>}
                  {probes.map((probe) => (
                    <MenuItem key={probe.id} value={probe.id}>
                      {probe.name || `پراب ${probe.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dropdown تسک */}
              <FormControl fullWidth required error={!selectedTask && !!error}>
                <InputLabel id="task-select-label">تسک</InputLabel>
                <Select
                  labelId="task-select-label"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  label="تسک"
                >
                   {tasks.length === 0 && <MenuItem disabled>در حال بارگذاری یا تسکی یافت نشد...</MenuItem>}
                  {tasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name || `تسک ${task.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dropdown سرویس */}
              <FormControl fullWidth required error={!selectedService && !!error}>
                <InputLabel id="service-select-label">سرویس</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  label="سرویس"
                >
                  {services.length === 0 && <MenuItem disabled>در حال بارگذاری یا سرویسی یافت نشد...</MenuItem>}
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name || `سرویس ${service.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            <FormControl fullWidth>
              <InputLabel id="task-select-label">انتخاب تسک</InputLabel>
              <Select labelId="task-select-label" value={selectedTask} label="انتخاب تسک" onChange={(e) => setSelectedTask(e.target.value)}>
                {tasks.map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


              {/* در صورت نیاز، فیلدهای schedule و is_active را اینجا به صورت Input اضافه کنید */}

            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" disabled={loading}>
              انصراف
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {/* نمایش لودینگ روی دکمه */}
              {loading ? <CircularProgress size={24} color="inherit" /> : (editId ? 'ذخیره تغییرات' : 'افزودن تخصیص')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
};

export default TaskAssignment;