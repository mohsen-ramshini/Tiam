import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from 'api/axiosInstance';

export const useUpdateService = ({ onSuccessCallback, onErrorCallback }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => axiosInstance.put(`/repo/services/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onSuccessCallback?.();
      alert('سرویس با موفقیت ویرایش شد!');
    },
    onError: (error) => {
      console.error('خطا در ویرایش سرویس:', error);
      onErrorCallback?.(error);
    }
  });
};
