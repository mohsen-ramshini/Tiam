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

import useFetchTasks from '../../hooks/api/dashboard/tasks/useFetchTasks';
import useCreateTask from '../../hooks/api/dashboard/tasks/useCreateTask';
import useUpdateTask from '../../hooks/api/dashboard/tasks/useUpdateTask';
import useDeleteTask from '../../hooks/api/dashboard/tasks/useDeleteTask';
import { useQueryClient } from '@tanstack/react-query';

const CreateTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gitRepo, setGitRepo] = useState('');
  const [entrypoint, setEntrypoint] = useState('');
  const [metric, setMetric] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useFetchTasks();

  const createTaskMutation = useCreateTask({
    onSuccessCallback: () => {
      queryClient.invalidateQueries(['tasks']);
      handleClose();
      alert('تسک با موفقیت اضافه شد!');
    },
    onErrorCallback: () => {
      setError('خطا در ایجاد تسک');
    }
  });

  const updateTaskMutation = useUpdateTask({
    onSuccessCallback: () => {
      queryClient.invalidateQueries(['tasks']);
      handleClose();
      alert('تسک با موفقیت ویرایش شد!');
    },
    onErrorCallback: () => {
      setError('خطا در ویرایش تسک');
    }
  });

  const deleteTaskMutation = useDeleteTask({
    onSuccessCallback: () => {
      queryClient.invalidateQueries(['tasks']);
      alert('تسک حذف شد!');
    },
    onErrorCallback: () => {
      alert('خطا در حذف تسک');
    }
  });

  const handleOpen = () => {
    setName('');
    setDescription('');
    setGitRepo('');
    setEntrypoint('');
    setMetric('');
    setIsActive(true);
    setEditId(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !gitRepo || !entrypoint || !metric) {
      setError('لطفاً همه فیلدها را پر کنید');
      return;
    }

    const payload = { name, description, git_repo: gitRepo, entrypoint, metric, is_active: isActive };

    setError(null);

    if (editId) {
      updateTaskMutation.mutate({ id: editId, data: payload });
    } else {
      createTaskMutation.mutate(payload);
    }
  };

  const handleEdit = (task) => {
    setName(task.name);
    setDescription(task.description);
    setGitRepo(task.git_repo);
    setEntrypoint(task.entrypoint);
    setMetric(task.metric);
    setIsActive(task.is_active);
    setEditId(task.id);
    setError(null);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این تسک مطمئن هستید؟')) {
      deleteTaskMutation.mutate(id);
    }
  };

  return (
    <MainCard title="مدیریت تسک‌ها">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن تسک
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">توضیحات</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">مترک</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ تسکی یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.metric}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'ویرایش تسک' : 'افزودن تسک'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="نام تسک" value={name} onChange={(e) => setName(e.target.value)} fullWidth error={!!error} />
            <TextField label="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} error={!!error} />
            <TextField label="گیت ریپو" value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} fullWidth error={!!error} />
            <TextField label="ورودی (entrypoint)" value={entrypoint} onChange={(e) => setEntrypoint(e.target.value)} fullWidth error={!!error} />
            <TextField label="مترک (metric)" value={metric} onChange={(e) => setMetric(e.target.value)} fullWidth error={!!error} />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">انصراف</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading}
          >
            {(createTaskMutation.isLoading || updateTaskMutation.isLoading)
              ? <CircularProgress size={24} color="inherit" />
              : editId ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateTask;
