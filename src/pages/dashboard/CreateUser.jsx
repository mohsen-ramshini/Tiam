/* eslint-disable prettier/prettier */
import React from 'react';
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
  FormControl
} from '@mui/material';
import MainCard from 'components/MainCard';

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

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/users/users/', data);
      alert('کاربر با موفقیت اضافه شد!');
      reset();
    } catch (err) {
      if (err.response?.status === 400) {
        const backendErrors = err.response.data;

        // نمایش خطای تکراری بودن نام کاربری
        if (backendErrors.username?.[0]?.includes('already exists')) {
          setError('username', {
            type: 'manual',
            message: 'این نام کاربری قبلاً ثبت شده است.'
          });
        }

        // نمایش سایر ارورها
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (field !== 'username') {
            setError(field, {
              type: 'manual',
              message: messages[0]
            });
          }
        });
      } else {
        alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  return (
    <MainCard title="افزودن کاربر">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
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
              <TextField
                {...field}
                label="رمز عبور"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
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
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'افزودن کاربر'}
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default CreateUser;
