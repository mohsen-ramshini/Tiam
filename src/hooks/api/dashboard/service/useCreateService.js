import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

export const useCreateService = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => axiosInstance.post('/repo/services/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onSuccessCallback?.();
      alert('سرویس با موفقیت اضافه شد!');
    },
    onError: (error) => {
      console.error('خطا در افزودن سرویس:', error);
      onErrorCallback?.(error);
    }
  });
};
