/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import { TextField, Button, Stack } from '@mui/material';

const CreateProbe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('فرم ارسال شد:', { name, description });
    // اینجا بعداً متصل می‌کنیم به API
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
          />
          <TextField
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Button type="submit" variant="contained" color="primary">
            افزودن پراب
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default CreateProbe;
