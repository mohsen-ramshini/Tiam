import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useCreateProbe = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newData) => axiosInstance.post('/users/probs/', newData),
    onSuccess: () => {
      queryClient.invalidateQueries(['probes']);
      reset();
      setOpen(false);
      alert('پراب با موفقیت ایجاد شد');
    },
    onError: (error) => {
      console.error('خطا در ایجاد پراب:', error);
      setError('api', { message: 'خطا در ایجاد پراب. لطفاً دوباره تلاش کنید.' });
    }
  });
};
