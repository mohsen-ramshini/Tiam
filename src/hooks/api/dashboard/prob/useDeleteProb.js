import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useDeleteProbe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/users/probs/${id}/`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['probes'] });
      toast.success('پراب با موفقیت حذف شد');
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در حذف پراب. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در حذف پراب:', error);
    }
  });
};
