/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import { TextField, Button, Stack, CircularProgress } from '@mui/material';
import axiosInstance from 'api/axiosInstance';  // وارد کردن axiosInstance

const CreateProbe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError('لطفاً تمامی فیلدها را پر کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ارسال درخواست به API
      const response = await axiosInstance.post('/users/probs/', {
        name,
        description,
      });

      // نمایش موفقیت
      console.log('پراب جدید اضافه شد:', response.data);
      setName('');
      setDescription('');
      alert('پراب با موفقیت اضافه شد!');
    } catch (err) {
      // خطا در ارسال درخواست
      console.error('خطا در افزودن پراب:', err);
      setError('خطا در افزودن پراب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="ساخت پراب">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="نام پراب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={error}
            helperText={error}
          />
          <TextField
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            error={error}
            helperText={error}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'افزودن پراب'}
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default CreateProbe;
