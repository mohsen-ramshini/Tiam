import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useCreateAssertionRole = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newData) => axiosInstance.post('/repo/assertion-rule/', newData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assertion-role'] });
      toast.success('اعلان با موفقیت ایجاد شد');
      reset();
      setOpen(false);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در ایجاد اعلان. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در ایجاد اعلان:', error);

      if (setError) {
        setError('api', { message });
      }
    }
  });
};
