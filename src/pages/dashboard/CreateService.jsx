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

const CreateService = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get('/repo/services/');
      setServices(res.data);
    } catch (err) {
      console.error('خطا در دریافت سرویس‌ها:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpen = () => {
    setName('');
    setDescription('');
    setHost('');
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !host) {
      setError('لطفاً تمامی فیلدها را پر کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        description,
        properties: { host }
      };

      if (editId) {
        await axiosInstance.put(`/repo/services/${editId}/`, payload);
        alert('سرویس با موفقیت ویرایش شد!');
      } else {
        await axiosInstance.post('/repo/services/', payload);
        alert('سرویس با موفقیت اضافه شد!');
      }
      fetchServices();
      handleClose();
    } catch (err) {
      console.error('خطا:', err);
      setError('خطا در ذخیره‌سازی سرویس');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setName(service.name);
    setDescription(service.description);
    setHost(service.properties?.host || '');
    setEditId(service.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این سرویس مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/repo/services/${id}/`);
        fetchServices();
        alert('سرویس حذف شد!');
      } catch (err) {
        console.error('خطا در حذف سرویس:', err);
      }
    }
  };

  return (
    <MainCard title="مدیریت سرویس‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن سرویس
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">توضیحات</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">هاست</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.properties?.host}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(service)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(service.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ سرویسی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* فرم ساخت/ویرایش داخل دیالوگ */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'ویرایش سرویس' : 'افزودن سرویس'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="نام سرویس"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              error={!!error}
            />
            <TextField
              label="توضیحات"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              error={!!error}
            />
            <TextField
              label="هاست (Host)"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              fullWidth
              error={!!error}
            />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">انصراف</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : editId ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateService;
