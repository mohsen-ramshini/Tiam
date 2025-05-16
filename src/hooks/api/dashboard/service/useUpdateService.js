import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';
import { toast } from 'sonner';

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(`/repo/services/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('سرویس با موفقیت ویرایش شد!');
    },
    onError: (error) => {
      console.error('خطا در ویرایش سرویس:', error);
      toast.error('خطا در ویرایش سرویس. لطفاً دوباره تلاش کنید.');
    }
  });
};
