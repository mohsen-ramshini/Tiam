import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useUpdateUser = ({ setError, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/users/users/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      alert('کاربر با موفقیت به‌روزرسانی شد!');
      queryClient.invalidateQueries(['usersList']);
      setOpen(false);
    },
    onError: (err) => {
      if (err.response?.status === 400) {
        const backendErrors = err.response.data;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, { type: 'manual', message: messages[0] });
        });
      } else {
        alert('خطا در به‌روزرسانی کاربر. لطفاً دوباره تلاش کنید.');
      }
    }
  });
};
