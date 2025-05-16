import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useUpdateProbe = ({ setError, setOpen }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.put(`/users/probs/${id}/`, data),

    onSuccess: () => {
      queryClient.invalidateQueries(['probes']);
      setOpen(false);
      toast.success('پراب با موفقیت ویرایش شد');
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در ویرایش پراب. لطفاً بررسی کنید.';

      toast.error(message);
      console.error('خطا در ویرایش پراب:', error);

      if (setError) {
        setError('api', { message });
      }
    }
  });
};
