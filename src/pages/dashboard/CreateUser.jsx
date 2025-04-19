/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import MainCard from 'components/MainCard';
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
import axiosInstance from 'api/axiosInstance';  // ← آدرس درست axiosInstance

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState([36]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !firstName || !lastName) {
      setError('لطفاً تمامی فیلدهای ضروری را پر کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/users/users/', {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        is_active: isActive,
        user_permissions: permissions,
        groups
      });

      console.log('کاربر جدید اضافه شد:', response.data);
      alert('کاربر با موفقیت اضافه شد!');

      // پاک‌سازی فیلدها
      setUsername('');
      setPassword('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setGroups([]);
      setPermissions([36]);
      setIsActive(true);
    } catch (err) {
      console.error('خطا در افزودن کاربر:', err);
      setError('خطا در افزودن کاربر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="ساخت کاربر">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="نام کاربری"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="نام"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="نام خانوادگی"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="فعال بودن کاربر"
          />
          <FormControl fullWidth>
            <InputLabel>گروه‌ها</InputLabel>
            <Select
              multiple
              value={groups}
              onChange={(e) => setGroups(e.target.value)}
              label="گروه‌ها"
            >
              <MenuItem value={1}>گروه 1</MenuItem>
              <MenuItem value={2}>گروه 2</MenuItem>
              <MenuItem value={3}>گروه 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>مجوزها</InputLabel>
            <Select
              multiple
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              label="مجوزها"
            >
              <MenuItem value={36}>مجوز A</MenuItem>
              <MenuItem value={37}>مجوز B</MenuItem>
              <MenuItem value={38}>مجوز C</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'افزودن کاربر'}
          </Button>
        </Stack>
      </form>
    </MainCard>
  );
};

export default CreateUser;
