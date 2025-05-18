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
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import axiosInstance from 'api/axiosInstance';

import { useFetchAssertionRole } from '../../hooks/api/dashboard/assertion-role/useFetchAssertionRoles';
import { useCreateAssertionRole } from '../../hooks/api/dashboard/assertion-role/useCreateAssertionRole';
import { useUpdateAssertionRole } from '../../hooks/api/dashboard/assertion-role/useUpdateAssertionRole';
import { useDeleteAssertionRole } from '../../hooks/api/dashboard/assertion-role/useDeleteAssertionRole';

const CreateAssertionRole = () => {
  const [open, setOpen] = useState(false);
  const [selectedAssertionRole, setSelectedAssertionRole] = useState(null);
  const isEditMode = Boolean(selectedAssertionRole);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      task_assignment: '',
      field: '',
      inverse: false,
      operator: 'equals',
      value: 0,
      alert_after: 0,
      is_active: true,
      severity: 'warning',
      alert_recipients: ''
    }
  });

  const { data: { results: assertionRoles } = { results: [] } } = useFetchAssertionRole();

  const [taskAssignments, setTaskAssignments] = useState([]);

  useEffect(() => {
    const fetchTaskAssignments = async () => {
      try {
        const response = await axiosInstance.get('/repo/task-assignments/', {
          params: {
            limit: 100,
            ordering: 'created_at'
          }
        });
        setTaskAssignments(response.data.results);
      } catch (error) {
        console.error('خطا در دریافت task assignments:', error);
        toast.error('دریافت لیست task assignment با خطا مواجه شد');
      }
    };

    fetchTaskAssignments();
  }, []);

  const { mutate: createAssertionRole } = useCreateAssertionRole({ setError, reset, setOpen });
  const { mutate: updateAssertionRole } = useUpdateAssertionRole({ setError, setOpen });
  const { mutate: deleteAssertionRole } = useDeleteAssertionRole();

  const onSubmit = (data) => {
    const parsedData = {
      ...data,
      task_assignment: Number(data.task_assignment),
      value: Number(data.value),
      alert_after: Number(data.alert_after),
      inverse: Boolean(data.inverse),
      is_active: Boolean(data.is_active),
      alert_recipients: data.alert_recipients
        .split(',')
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v))
    };

    if (isEditMode) {
      updateAssertionRole({ id: selectedAssertionRole.id, data: parsedData });
    } else {
      createAssertionRole(parsedData);
    }
  };

  const handleEdit = (assertionRole) => {
    setSelectedAssertionRole(assertionRole);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این اعلان مطمئن هستید؟')) {
      deleteAssertionRole(id);
    }
  };

  const handleOpen = () => {
    setSelectedAssertionRole(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAssertionRole(null);
  };

  useEffect(() => {
    if (selectedAssertionRole) {
      reset({
        ...selectedAssertionRole,
        task_assignment: String(selectedAssertionRole.task_assignment),
        alert_recipients: selectedAssertionRole.alert_recipients.join(',')
      });
    }
  }, [selectedAssertionRole, reset]);

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
              <TableCell>
                <Typography fontWeight="bold">فیلد</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">اپراتور</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">مقدار</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight="bold">عملیات</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assertionRoles.map((assertionRole) => (
              <TableRow key={assertionRole.id}>
                <TableCell>{assertionRole.field}</TableCell>
                <TableCell>{assertionRole.operator}</TableCell>
                <TableCell>{assertionRole.value}</TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: 'primary.main' }} onClick={() => handleEdit(assertionRole)}>
                    <Edit />
                  </IconButton>
                  <IconButton sx={{ color: 'error.main' }} onClick={() => handleDelete(assertionRole.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {assertionRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
              <FormControl fullWidth error={!!errors.task_assignment}>
                <InputLabel>Task Assignment</InputLabel>
                <Controller
                  name="task_assignment"
                  control={control}
                  rules={{ required: 'task_assignment الزامی است' }}
                  render={({ field }) => (
                    <Select label="Task Assignment" {...field}>
                      {taskAssignments?.map((task) => (
                        <MenuItem key={task.id} value={task.id}>
                          {task.name || `Task #${task.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.task_assignment && (
                  <Typography variant="caption" color="error">
                    {errors.task_assignment.message}
                  </Typography>
                )}
              </FormControl>

              <TextField label="Field" fullWidth {...register('field')} />
              <TextField
                label="Operator"
                fullWidth
                {...register('operator', { required: 'operator الزامی است' })}
                error={!!errors.operator}
                helperText={errors.operator?.message}
              />
              <TextField
                label="Value"
                type="number"
                fullWidth
                {...register('value', { required: 'value الزامی است' })}
                error={!!errors.value}
                helperText={errors.value?.message}
              />
              <TextField
                label="Alert After (ثانیه)"
                type="number"
                fullWidth
                {...register('alert_after', { required: 'alert_after الزامی است' })}
                error={!!errors.alert_after}
                helperText={errors.alert_after?.message}
              />
              <TextField
                label="Severity"
                fullWidth
                {...register('severity', { required: 'severity الزامی است' })}
                error={!!errors.severity}
                helperText={errors.severity?.message}
              />
              <TextField
                label="Alert Recipients (مثال: 1,2)"
                fullWidth
                {...register('alert_recipients', {
                  required: 'alert_recipients الزامی است',
                  validate: (value) => value.split(',').every((v) => !isNaN(parseInt(v))) || 'فرمت باید عددهای جداشده با کاما باشد'
                })}
                error={!!errors.alert_recipients}
                helperText={errors.alert_recipients?.message}
              />
              <FormControlLabel control={<Switch {...register('is_active')} />} label="فعال بودن" />
              <FormControlLabel control={<Switch {...register('inverse')} />} label="وارونه" />
              {errors.api && <Typography color="error">{errors.api.message}</Typography>}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateAssertionRole;
