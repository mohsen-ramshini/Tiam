import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useUpdateProbe = ({ setError, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(`/users/probs/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['probes']);
      setOpen(false);
      alert('پراب با موفقیت ویرایش شد');
    },
    onError: (error) => {
      console.error('خطا در ویرایش پراب:', error);
      setError('api', { message: 'خطا در ویرایش پراب. لطفاً بررسی کنید.' });
    }
  });
};
