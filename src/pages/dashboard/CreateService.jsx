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
import { useCreateService } from "../../hooks/api/dashboard/service/useCreateService";
import { useUpdateService } from "../../hooks/api/dashboard/service/useUpdateService";
import { useDeleteService } from "../../hooks/api/dashboard/service/useDeleteService";
import { useFetchServices } from '../../hooks/api/dashboard/service/useFetchService';

const CreateService = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const { data: services = [], isLoading: isFetching, refetch } = useFetchServices();

  const createMutation = useCreateService({
    onSuccessCallback: () => {
      refetch();
      handleClose();
    },
    onErrorCallback: () => setError('خطا در افزودن سرویس')
  });

  const updateMutation = useUpdateService({
    onSuccessCallback: () => {
      refetch();
      handleClose();
    },
    onErrorCallback: () => setError('خطا در ویرایش سرویس')
  });

  const deleteMutation = useDeleteService({
    onSuccessCallback: () => refetch()
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !host) {
      setError('لطفاً تمامی فیلدها را پر کنید');
      return;
    }

    const payload = {
      name,
      description,
      properties: { host }
    };

    if (editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
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

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این سرویس مطمئن هستید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : services.length > 0 ? (
              services.map((service) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ سرویسی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : editId ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateService;
