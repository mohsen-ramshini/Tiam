import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useCreateUser = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post('/users/users/', data);
      return response.data;
    },

    onSuccess: () => {
      toast.success('کاربر با موفقیت اضافه شد!');
      queryClient.invalidateQueries(['usersList']);
      reset();
      setOpen(false);
    },

    onError: (err) => {
      const status = err?.response?.status;
      const backendErrors = err?.response?.data;

      if (status === 400 && backendErrors) {
        if (backendErrors.username?.[0]?.includes('already exists')) {
          setError('username', {
            type: 'manual',
            message: 'این نام کاربری قبلاً ثبت شده است.'
          });
        }

        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (field !== 'username') {
            setError(field, {
              type: 'manual',
              message: messages?.[0] || 'خطای نامشخص در این فیلد'
            });
          }
        });

        toast.error('لطفاً خطاهای فرم را بررسی کنید.');
      } else {
        toast.error('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
        console.error('Create user error:', err);
      }
    }
  });
};
