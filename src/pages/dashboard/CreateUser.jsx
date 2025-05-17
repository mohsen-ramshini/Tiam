/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useFetchUsers } from '../../hooks/api/dashboard/user/useFetchUsers';
import { useCreateUser } from '../../hooks/api/dashboard/user/useCreateUser';
import { useDeleteUser } from '../../hooks/api/dashboard/user/useDeleteUser';
import { useUpdateUser } from '../../hooks/api/dashboard/user/useUpdateUser';

const userSchema = z.object({
  username: z.string().min(3, 'نام کاربری حداقل ۳ کاراکتر باشد'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد').optional(),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  first_name: z.string().min(1, 'نام الزامی است'),
  last_name: z.string().min(1, 'نام خانوادگی الزامی است'),
  is_active: z.boolean(),
  groups: z.array(z.number()).optional(),
  user_permissions: z.array(z.number())
});

const CreateUser = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isEditMode = Boolean(selectedUser);

  const theme = useTheme();
  const isXxs = useMediaQuery('(max-width:320px)');
  const isXs = useMediaQuery('(max-width:480px)');
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

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

  const { data: users = [], isLoading } = useFetchUsers();
  const { mutate: createUser } = useCreateUser({ setError, reset, setOpen });
  const { mutate: updateUser } = useUpdateUser({ setError, setOpen });
  const { mutate: deleteUser } = useDeleteUser();

  const onSubmit = (data) => {
    if (isEditMode) {
      updateUser({ id: selectedUser.id, data });
    } else {
      createUser(data);
    }
  };

  const handleOpen = () => {
    setSelectedUser(null);
    reset();
    setOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    reset({ ...user, password: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      deleteUser(id);
    }
  };

  const renderMobileView = () => (
    <Grid container spacing={isXxs ? 1 : 2}>
      {users.length === 0 ? (
        <Grid item xs={12}>
          <Card sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2">هیچ کاربری یافت نشد.</Typography>
          </Card>
        </Grid>
      ) : (
        users.map((user) => (
          <Grid item xs={12} key={user.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle2" fontWeight="bold">{user.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user.first_name} {user.last_name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                <Typography variant="caption" color={user.is_active ? "success.main" : "error.main"}>
                  {user.is_active ? 'فعال' : 'غیرفعال'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                  <Edit fontSize="inherit" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                  <Delete fontSize="inherit" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table size={isSm ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell><b>نام کاربری</b></TableCell>
            <TableCell><b>نام</b></TableCell>
            <TableCell><b>نام خانوادگی</b></TableCell>
            <TableCell><b>ایمیل</b></TableCell>
            <TableCell><b>وضعیت</b></TableCell>
            <TableCell align="center"><b>عملیات</b></TableCell>
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
                <IconButton color="primary" onClick={() => handleEdit(user)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <MainCard title="مدیریت کاربران">
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={isXxs ? null : <Add />}
          size={isXxs ? 'small' : 'medium'}
          sx={{ fontSize: isXxs ? '0.7rem' : 'inherit' }}
          onClick={handleOpen}
        >
          {isXxs ? '+' : 'افزودن کاربر'}
        </Button>
      </Stack>

      {isSm ? renderMobileView() : renderDesktopView()}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={isXxs ? 'xs' : 'sm'}
        fullScreen={isXs}
        PaperProps={{
          sx: {
            m: isXxs ? 1 : 2,
            width: isXxs ? 'calc(100% - 16px)' : 'auto',
            maxHeight: isXxs ? 'calc(100% - 16px)' : 'auto'
          }
        }}
      >
        <DialogTitle>{isEditMode ? 'ویرایش کاربر' : 'افزودن کاربر'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                ['username', 'نام کاربری'],
                ['password', 'رمز عبور'],
                ['email', 'ایمیل'],
                ['first_name', 'نام'],
                ['last_name', 'نام خانوادگی']
              ].map(([name, label]) => (
                <Grid item xs={12} sm={6} key={name}>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type={name === 'password' ? 'password' : 'text'}
                        label={label}
                        fullWidth
                        error={!!errors[name]}
                        helperText={errors[name]?.message}
                      />
                    )}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="فعال بودن کاربر" />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="groups"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>گروه‌ها</InputLabel>
                      <Select {...field} multiple>
                        <MenuItem value={1}>گروه ۱</MenuItem>
                        <MenuItem value={2}>گروه ۲</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="user_permissions"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>مجوزها</InputLabel>
                      <Select {...field} multiple>
                        <MenuItem value={36}>مجوز A</MenuItem>
                        <MenuItem value={37}>مجوز B</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">انصراف</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : isEditMode ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CreateUser;
