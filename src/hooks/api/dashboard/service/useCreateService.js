import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';
import { toast } from 'sonner'; // یا هر کتابخانه toast که استفاده می‌کنی

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosInstance.post('/repo/services/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('سرویس با موفقیت اضافه شد!');
    },
    onError: (error) => {
      console.error('خطا در افزودن سرویس:', error);
      toast.error('خطا در افزودن سرویس. لطفاً دوباره تلاش کنید.');
    }
  });
};
