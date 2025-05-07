/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { useFetchProbes } from '../../hooks/api/dashboard/prob/useFetchProbs';
import { useCreateProbe } from '../../hooks/api/dashboard/prob/useCreateProbs';
import { useUpdateProbe } from '../../hooks/api/dashboard/prob/useUpdateProb';
import { useDeleteProbe } from '../../hooks/api/dashboard/prob/useDeleteProb';

const CreateProbe = () => {
  const [open, setOpen] = useState(false);
  const [selectedProbe, setSelectedProbe] = useState(null);
  const isEditMode = Boolean(selectedProbe);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: '', description: '' }
  });

  const { data: { results: probes } = { results: [] } } = useFetchProbes();

  const { mutate: createProbe } = useCreateProbe({ setError, reset, setOpen });
  const { mutate: updateProbe } = useUpdateProbe({ setError, setOpen });
  const { mutate: deleteProbe } = useDeleteProbe();

  const onSubmit = (data) => {
    if (isEditMode) {
      updateProbe({ id: selectedProbe.id, data });
    } else {
      createProbe(data);
    }
  };

  const handleEdit = (probe) => {
    setSelectedProbe(probe);
    reset({ name: probe.name, description: probe.description });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این پراب مطمئن هستید؟')) {
      deleteProbe(id);
    }
  };

  const handleOpen = () => {
    setSelectedProbe(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProbe(null);
  };

  return (
    <MainCard title="مدیریت پراب‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن پراب
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">توضیحات</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'ویرایش پراب' : 'افزودن پراب'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="نام پراب"
                fullWidth
                {...register('name', { required: 'نام الزامی است' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="توضیحات"
                fullWidth
                multiline
                rows={3}
                {...register('description', { required: 'توضیحات الزامی است' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              {errors.api && <Typography color="error">{errors.api.message}</Typography>}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">انصراف</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateProbe;
