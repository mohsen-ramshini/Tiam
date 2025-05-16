import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useUpdateUser = ({ setError, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/users/users/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('کاربر با موفقیت به‌روزرسانی شد!');
      queryClient.invalidateQueries(['usersList']);
      setOpen(false);
    },
    onError: (err) => {
      console.error('خطا در آپدیت کاربر:', err);
      if (err.response?.status === 400 && err.response.data) {
        const backendErrors = err.response.data;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, { type: 'manual', message: messages[0] });
        });
      } else {
        toast.error('خطا در به‌روزرسانی کاربر. لطفاً دوباره تلاش کنید.');
      }
    }
  });
};
