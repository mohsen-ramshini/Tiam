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
import { useFetchUsers } from '../../hooks/api/dashboard/user/useFetchUsers';
import { useCreateUser } from '../../hooks/api/dashboard/user/useCreateUser';
import { useDeleteUser } from '../../hooks/api/dashboard/user/useDeleteUser';
import { useUpdateUser } from '../../hooks/api/dashboard/user/useUpdateUser';

const userSchema = z.object({
  username: z.string().min(3, 'نام کاربری حداقل باید ۳ کاراکتر باشد'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد').optional(),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  is_active: z.boolean(),
  groups: z.array(z.number()).optional(),
  user_permissions: z.array(z.number())
});

const CreateUser = () => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isEditMode = Boolean(selectedUser);

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

  const { data: users, isLoading, isError } = useFetchUsers();
  const { mutate: createUser } = useCreateUser({ setError, reset, setOpen });
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser({ setError, setOpen });

  const onSubmit = (data) => {
    if (isEditMode) {
      updateUser({ id: selectedUser.id, data });
    } else {
      createUser(data);
    }
  };

  const handleDelete = (id) => {
    deleteUser(id);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    reset({ ...user, password: '' });
    setOpen(true);
  };

  const handleOpen = () => {
    setSelectedUser(null);
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
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
              {Array.isArray(users) ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.is_active ? 'فعال' : 'غیرفعال'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(user.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {isError ? 'خطا در دریافت کاربران' : 'در حال بارگذاری...'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}</DialogTitle>
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
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateUser;
