import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useCreateUser = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post('/users/users/', data);
      return response.data;
    },
    onSuccess: () => {
      alert('کاربر با موفقیت اضافه شد!');
      queryClient.invalidateQueries(['usersList']);
      reset();
      setOpen(false);
    },
    onError: (err) => {
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
  });
};
