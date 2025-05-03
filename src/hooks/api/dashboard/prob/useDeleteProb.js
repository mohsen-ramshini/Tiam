import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../api/axiosInstance';

export const useDeleteProbe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/users/probs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['probes']);
      alert('پراب با موفقیت حذف شد');
    },
    onError: (error) => {
      console.error('خطا در حذف پراب:', error);
      alert('خطا در حذف پراب. لطفاً دوباره تلاش کنید.');
    }
  });
};
