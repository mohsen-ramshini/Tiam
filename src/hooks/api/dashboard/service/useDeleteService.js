import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => axiosInstance.delete(`/repo/services/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      alert('سرویس حذف شد!');
    },
    onError: (error) => {
      console.error('خطا در حذف سرویس:', error);
      alert('خطا در حذف سرویس. لطفاً دوباره تلاش کنید.');
    }
  });
};
