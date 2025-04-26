/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from 'api/axiosInstance';
import {
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TableContainer
} from '@mui/material';
import MainCard from 'components/MainCard';
import { Delete, Edit, Add } from '@mui/icons-material';

// اسکیما اعتبارسنجی Zod
const userSchema = z.object({
  username: z.string().min(3, 'نام کاربری حداقل باید ۳ کاراکتر باشد'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  is_active: z.boolean(),
  groups: z.array(z.number()).optional(),
  user_permissions: z.array(z.number())
});

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      is_active: true,
      groups: [],
      user_permissions: [36]
    }
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axiosInstance.get('/users/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/users/users/', data);
      alert('کاربر با موفقیت اضافه شد!');
      reset();
      fetchUsers();
      setOpen(false);
    } catch (err) {
      if (err.response?.status === 400) {
        const backendErrors = err.response.data;
        if (backendErrors.username?.[0]?.includes('already exists')) {
          setError('username', { type: 'manual', message: 'این نام کاربری قبلاً ثبت شده است.' });
        }
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (field !== 'username') {
            setError(field, { type: 'manual', message: messages[0] });
          }
        });
      } else {
        alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      try {
        await axiosInstance.delete(`/users/users/${id}/`);
        fetchUsers();
      } catch (error) {
        alert('خطا در حذف کاربر');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MainCard title="مدیریت کاربران">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          افزودن کاربر
        </Button>
      </Stack>

      {loadingUsers ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography fontWeight="bold">نام کاربری</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">نام</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">نام خانوادگی</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">ایمیل</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">وضعیت</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">عملیات</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_active ? 'فعال' : 'غیرفعال'}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => alert('ویرایش در دست توسعه است')}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    هیچ کاربری یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* دیالوگ افزودن کاربر */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>افزودن کاربر جدید</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="نام کاربری" fullWidth error={!!errors.username} helperText={errors.username?.message} />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="رمز عبور" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ایمیل" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="نام" fullWidth error={!!errors.first_name} helperText={errors.first_name?.message} />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="نام خانوادگی" fullWidth error={!!errors.last_name} helperText={errors.last_name?.message} />
                )}
              />
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="فعال بودن کاربر" />}
              />
              <Controller
                name="groups"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>گروه‌ها</InputLabel>
                    <Select {...field} multiple label="گروه‌ها">
                      <MenuItem value={1}>گروه ۱</MenuItem>
                      <MenuItem value={2}>گروه ۲</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="user_permissions"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>مجوزها</InputLabel>
                    <Select {...field} multiple label="مجوزها">
                      <MenuItem value={36}>مجوز A</MenuItem>
                      <MenuItem value={37}>مجوز B</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            انصراف
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateUser;
