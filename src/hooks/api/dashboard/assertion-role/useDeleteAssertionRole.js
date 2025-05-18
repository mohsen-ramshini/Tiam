import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

export const useDeleteAssertionRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/repo/assertion-rule/${id}/`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assertion-role'] });
      toast.success('اعلان با موفقیت حذف شد');
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'خطا در حذف اعلان. لطفاً دوباره تلاش کنید.';

      toast.error(message);
      console.error('خطا در حذف اعلان:', error);
    }
  });
};
