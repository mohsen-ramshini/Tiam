import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useCreateProbe = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newData) => axiosInstance.post('/users/probs/', newData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['probes'] });
      toast.success('پراب با موفقیت ایجاد شد');
      reset();
      setOpen(false);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در ایجاد پراب. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در ایجاد پراب:', error);

      if (setError) {
        setError('api', { message });
      }
    }
  });
};
