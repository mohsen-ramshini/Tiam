import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useChangeProbToken = ({ setError, reset, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) =>
      axiosInstance.put(`/users/change-prob-token/${id}/`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['probes'] });
      toast.success('توکن با موفقیت تغییر کرد');
      reset?.();
      setOpen?.(false);
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در تغییر توکن. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در تغییر توکن:', error);

      if (setError) {
        setError('api', { message });
      }
    },
  });
};
