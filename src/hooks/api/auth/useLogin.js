import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import axiosInstance from '../../../api/axiosInstance';

const loginUser = async ({ username, password }) => {
  const response = await axiosInstance.post('/users/login/', {
    login_type: 'user',
    username,
    password
  });

  if (response.status !== 200) {
    throw new Error('Login failed');
  }

  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Cookies.set('access_token', data.access, { expires: 1, secure: false, sameSite: 'Lax' });
      Cookies.set('refresh_token', data.refresh, { expires: 7, secure: false, sameSite: 'Lax' });

      toast.success('ورود موفقیت‌آمیز بود!');

      // اگر می‌خوای مثلاً پروفایل رو دوباره بخونی یا صفحه رو ببری جای دیگه
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      // مثال برای ریدایرکت:
      window.location.href = '/';
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'خطا در ورود!');
      console.error('Login error:', error);
    }
  });
};
