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
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axiosInstance from 'api/axiosInstance';

const CreateProbe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [probes, setProbes] = useState([]);
  const [editId, setEditId] = useState(null);

  // گرفتن لیست پراب‌ها
  const fetchProbes = async () => {
    try {
      const res = await axiosInstance.get('/users/probs/');
      setProbes(res.data);
    } catch (err) {
      console.error('خطا در دریافت پراب‌ها:', err);
    }
  };

  useEffect(() => {
    fetchProbes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError('لطفاً تمامی فیلدها را پر کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editId) {
        await axiosInstance.put(`/users/probs/${editId}/`, { name, description });
        alert('پراب با موفقیت ویرایش شد!');
      } else {
        await axiosInstance.post('/users/probs/', { name, description });
        alert('پراب با موفقیت اضافه شد!');
      }
      setName('');
      setDescription('');
      setEditId(null);
      fetchProbes();
    } catch (err) {
      console.error('خطا:', err);
      setError('خطا در ذخیره‌سازی پراب');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (probe) => {
    setName(probe.name);
    setDescription(probe.description);
    setEditId(probe.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این پراب مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/users/probs/${id}/`);
        fetchProbes();
        alert('پراب حذف شد!');
      } catch (err) {
        console.error('خطا در حذف پراب:', err);
      }
    }
  };

  return (
    <MainCard title="مدیریت پراب‌ها">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="نام پراب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
          />
          <TextField
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            error={!!error}
            helperText={error}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : editId ? 'ویرایش پراب' : 'افزودن پراب'}
          </Button>
        </Stack>
      </form>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام</TableCell>
              <TableCell>توضیحات</TableCell>
              <TableCell align="center">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {probes.map((probe) => (
              <TableRow key={probe.id}>
                <TableCell>{probe.name}</TableCell>
                <TableCell>{probe.description}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(probe)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(probe.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {probes.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  هیچ پرابی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

export default CreateProbe;
